const mongoose = require("mongoose");
const VideoStats = require("../models/video_stats.model");
const Video = require("../models/video.model");
const UserSubscription = require("../models/user_subscription.model");
const AppError = require("../utils/AppError");
const redisClient = require("../configs/redis");

const getVideoStatsService = async (videoId, period, startDate, endDate) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new AppError("Invalid video ID", 400);
    }

    const cacheKey = `stats:${videoId}:${period}:${startDate}:${endDate}`;
    let cachedData;
    try {
      cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for ${cacheKey} (Upstash)`);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.warn(
        `Invalid cache data for ${cacheKey}: ${error.message}. Falling back to MongoDB.`
      );
    }

    let groupBy, dateFormat;
    switch (period) {
      case "daily":
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        dateFormat = "%Y-%m-%d";
        break;
      case "weekly":
        groupBy = {
          $concat: [
            { $toString: { $year: "$date" } },
            "-W",
            { $toString: { $week: "$date" } },
          ],
        };
        dateFormat = "%Y-%m-%d";
        break;
      case "monthly":
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
        dateFormat = "%Y-%m-%d";
        break;
      default:
        throw new AppError(
          "Invalid period. Use 'daily', 'weekly', or 'monthly'",
          400
        );
    }

    const stats = await VideoStats.aggregate([
      {
        $match: {
          video_id: new mongoose.Types.ObjectId(videoId),
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $group: {
          _id: groupBy,
          views: { $last: "$views" },
          comments: { $sum: "$comments" },
          reviews: { $sum: "$reviews" },
          weightedRatingSum: {
            $sum: {
              $cond: [
                { $gt: ["$reviews", 0] },
                { $multiply: ["$average_rating", "$reviews"] },
                0,
              ],
            },
          },
          totalReviews: { $sum: "$reviews" },
          likes: { $sum: "$likes" },
          dislikes: { $sum: "$dislikes" },
          lastDate: { $last: "$date" },
        },
      },
      {
        $project: {
          _id: 1,
          views: 1,
          comments: 1,
          reviews: 1,
          average_rating: {
            $cond: [
              { $gt: ["$totalReviews", 0] },
              { $divide: ["$weightedRatingSum", "$totalReviews"] },
              0,
            ],
          },
          likes: 1,
          dislikes: 1,
          lastDate: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const statsWithTrends = stats.map((current, index) => {
      if (index === 0) {
        return { ...current, trends: {} };
      }
      const previous = stats[index - 1];
      return {
        ...current,
        trends: {
          views: current.views - (previous.views || 0),
          comments: current.comments - previous.comments,
          reviews: current.reviews - previous.reviews,
          average_rating: current.average_rating - previous.average_rating,
          likes: current.likes - previous.likes,
          dislikes: current.dislikes - previous.dislikes,
        },
      };
    });

    const result = {
      message: "Statistics retrieved successfully",
      data: statsWithTrends,
    };

    let serializedResult;
    try {
      serializedResult = JSON.stringify(result);
    } catch (error) {
      console.error(
        `Failed to serialize result for ${cacheKey}: ${error.message}`
      );
      throw new AppError(
        "Internal server error: Failed to serialize stats",
        500
      );
    }

    try {
      await redisClient.set(cacheKey, serializedResult, { ex: 3600 });
      console.log(`Cache set for ${cacheKey} (Upstash)`);
    } catch (error) {
      console.warn(`Failed to set cache for ${cacheKey}: ${error.message}`);
    }

    return result;
  } catch (error) {
    throw new AppError(`Error retrieving stats: ${error.message}`, 500);
  }
};

const getUserStatsService = async (userId, period, startDate, endDate) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const cacheKey = `user_stats:${userId}:${period}:${startDate}:${endDate}`;
    let cachedData;
    try {
      cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for ${cacheKey} (Upstash)`);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.warn(
        `Invalid cache data for ${cacheKey}: ${error.message}. Falling back to MongoDB.`
      );
    }

    const videos = await Video.find({
      user_id: new mongoose.Types.ObjectId(userId),
    }).select("_id");
    if (!videos.length) {
      return {
        message: "No videos found for this user",
        data: [],
      };
    }

    const videoIds = videos.map((video) => video._id);

    let groupBy, dateFormat, subscriptionGroupBy;
    switch (period) {
      case "daily":
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        subscriptionGroupBy = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        dateFormat = "%Y-%m-%d";
        break;
      case "weekly":
        groupBy = {
          $concat: [
            { $toString: { $year: "$date" } },
            "-W",
            { $toString: { $week: "$date" } },
          ],
        };
        subscriptionGroupBy = {
          $concat: [
            { $toString: { $year: "$createdAt" } },
            "-W",
            { $toString: { $week: "$createdAt" } },
          ],
        };
        dateFormat = "%Y-%m-%d";
        break;
      case "monthly":
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
        subscriptionGroupBy = {
          $dateToString: { format: "%Y-%m", date: "$createdAt" },
        };
        dateFormat = "%Y-%m-%d";
        break;
      default:
        throw new AppError(
          "Invalid period. Use 'daily', 'weekly', or 'monthly'",
          400
        );
    }

    // Tổng hợp stats từ VideoStats
    const stats = await VideoStats.aggregate([
      {
        $match: {
          video_id: { $in: videoIds },
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $group: {
          _id: groupBy,
          views: { $last: "$views" },
          comments: { $sum: "$comments" },
          reviews: { $sum: "$reviews" },
          weightedRatingSum: {
            $sum: {
              $cond: [
                { $gt: ["$reviews", 0] },
                { $multiply: ["$average_rating", "$reviews"] },
                0,
              ],
            },
          },
          totalReviews: { $sum: "$reviews" },
          likes: { $sum: "$likes" },
          dislikes: { $sum: "$dislikes" },
          lastDate: { $last: "$date" },
        },
      },
      {
        $project: {
          _id: 1,
          views: 1,
          comments: 1,
          reviews: 1,
          average_rating: {
            $cond: [
              { $gt: ["$totalReviews", 0] },
              { $divide: ["$weightedRatingSum", "$totalReviews"] },
              0,
            ],
          },
          likes: 1,
          dislikes: 1,
          lastDate: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Tổng hợp subscriptions từ UserSubscription
    const subscriptionStats = await UserSubscription.aggregate([
      {
        $match: {
          channel_id: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: subscriptionGroupBy,
          subscriptions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Kết hợp stats và subscriptionStats
    const statsWithSubscriptions = stats.map((stat) => {
      const subscription = subscriptionStats.find((s) => s._id === stat._id);
      return {
        ...stat,
        subscriptions: subscription ? subscription.subscriptions : 0,
      };
    });

    // Nếu có subscriptions mà không có stats, thêm vào
    const finalStats = [
      ...statsWithSubscriptions,
      ...subscriptionStats
        .filter((s) => !stats.some((stat) => stat._id === s._id))
        .map((s) => ({
          _id: s._id,
          views: 0,
          comments: 0,
          reviews: 0,
          average_rating: 0,
          likes: 0,
          dislikes: 0,
          subscriptions: s.subscriptions,
          lastDate: null,
        })),
    ].sort((a, b) => a._id.localeCompare(b._id));

    const statsWithTrends = finalStats.map((current, index) => {
      if (index === 0) {
        return { ...current, trends: {} };
      }
      const previous = finalStats[index - 1];
      return {
        ...current,
        trends: {
          views: current.views - (previous.views || 0),
          comments: current.comments - previous.comments,
          reviews: current.reviews - previous.reviews,
          average_rating: current.average_rating - previous.average_rating,
          likes: current.likes - previous.likes,
          dislikes: current.dislikes - previous.dislikes,
          subscriptions: current.subscriptions - previous.subscriptions,
        },
      };
    });

    const result = {
      message: "User statistics retrieved successfully",
      data: statsWithTrends,
    };

    let serializedResult;
    try {
      serializedResult = JSON.stringify(result);
    } catch (error) {
      console.error(
        `Failed to serialize result for ${cacheKey}: ${error.message}`
      );
      throw new AppError(
        "Internal server error: Failed to serialize stats",
        500
      );
    }

    try {
      await redisClient.set(cacheKey, serializedResult, { ex: 3600 });
      console.log(`Cache set for ${cacheKey} (Upstash)`);
    } catch (error) {
      console.warn(`Failed to set cache for ${cacheKey}: ${error.message}`);
    }

    return result;
  } catch (error) {
    throw new AppError(`Error retrieving user stats: ${error.message}`, 500);
  }
};

module.exports = {
  getVideoStatsService,
  getUserStatsService,
};
