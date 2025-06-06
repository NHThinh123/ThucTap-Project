const mongoose = require("mongoose");
const VideoStats = require("../models/video_stats.model");
const Video = require("../models/video.model");
const UserSubscription = require("../models/user_subscription.model");
const AppError = require("../utils/AppError");
const redisClient = require("../configs/redis");
const User_Like_Video = require("../models/user_like_video.model");
const User_Dislike_Video = require("../models/user_dislike_video.model");
const Comment = require("../models/comment.model");

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
        // console.log(`Cache hit for ${cacheKey} (Upstash)`);
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
        // console.log(`Cache hit for ${cacheKey} (Upstash)`);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      // console.warn(
      //   `Invalid cache data for ${cacheKey}: ${error.message}. Falling back to MongoDB.`
      // );
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
const getChannelOverviewService = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    // Tính toán ngày bắt đầu và kết thúc (tuần hiện tại và tuần trước)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Cuối ngày hiện tại (22/5/2025)

    // Tìm thứ Hai của tuần hiện tại
    const currentDate = new Date(endDate);
    const currentDayOfWeek = currentDate.getDay(); // 0 (CN), 1 (T2), ..., 4 (T5)
    const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const mondayThisWeek = new Date(currentDate);
    mondayThisWeek.setDate(currentDate.getDate() - daysToMonday);
    mondayThisWeek.setHours(0, 0, 0, 0); // Thứ Hai tuần hiện tại (19/5/2025)

    // Tìm thứ Hai của tuần trước
    const startDate = new Date(mondayThisWeek);
    startDate.setDate(mondayThisWeek.getDate() - 7); // Thứ Hai tuần trước (12/5/2025)
    // 1. Lấy số người đăng ký hiện tại
    const subscriberCount = await UserSubscription.countDocuments({
      channel_id: new mongoose.Types.ObjectId(userId),
    });

    // 2. Lấy thống kê trong 7 ngày qua (theo tuần)
    const stats = await getUserStatsService(
      userId,
      "weekly",
      startDate,
      endDate
    );

    // 3. Lấy 3 video nổi bật (theo views)
    const topVideos = await VideoStats.aggregate([
      {
        $match: {
          video_id: {
            $in: await Video.find({
              user_id: new mongoose.Types.ObjectId(userId),
            }).distinct("_id"),
          },
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$video_id",
          totalViews: { $sum: "$views" },
        },
      },
      {
        $sort: { totalViews: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "_id",
          as: "video",
        },
      },
      {
        $unwind: "$video",
      },
      {
        $project: {
          _id: "$video._id",
          title: "$video.title",
          views: "$totalViews",
        },
      },
    ]);

    return {
      message: "Channel overview retrieved successfully",
      data: {
        subscriberCount,
        stats: stats.data, // Trả về stats trực tiếp, bao gồm trends
        topVideos,
      },
    };
  } catch (error) {
    throw new AppError(
      `Error retrieving channel overview: ${error.message}`,
      500
    );
  }
};

const getNewestVideoAnalysisService = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    // Tính toán ngày bắt đầu và kết thúc (tuần hiện tại và tuần trước)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Cuối ngày hiện tại (22/5/2025)

    // Tìm thứ Hai của tuần hiện tại
    const currentDate = new Date(endDate);
    const currentDayOfWeek = currentDate.getDay(); // 0 (CN), 1 (T2), ..., 4 (T5)
    const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const mondayThisWeek = new Date(currentDate);
    mondayThisWeek.setDate(currentDate.getDate() - daysToMonday);
    mondayThisWeek.setHours(0, 0, 0, 0); // Thứ Hai tuần hiện tại (19/5/2025)

    // Tìm thứ Hai của tuần trước
    const startDate = new Date(mondayThisWeek);
    startDate.setDate(mondayThisWeek.getDate() - 7); // Thứ Hai tuần trước (12/5/2025)

    // 1. Lấy video mới nhất của người dùng
    const newestVideo = await Video.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .select("title thumbnail_video _id views");
    if (!newestVideo) {
      throw new AppError("No videos found for this user", 404);
    }
    console.log(newestVideo);

    // 2. Tính tổng view, like, dislike, comment
    const [totalViews, totalLikes, totalDislikes, totalComments] =
      await Promise.all([
        // Tổng view từ VideoStats
        newestVideo.views,

        // Tổng like từ UserLikeVideo
        User_Like_Video.countDocuments({ video_id: newestVideo._id }),

        // Tổng dislike từ UserDislikeVideo
        User_Dislike_Video.countDocuments({ video_id: newestVideo._id }),

        // Tổng comment từ Comment
        Comment.countDocuments({ video_id: newestVideo._id }),
      ]);

    // 3. Lấy trends từ VideoStats (weekly)
    // 2. Lấy thống kê trong 7 ngày qua (theo tuần)
    const stats = await getUserStatsService(
      userId,
      "weekly",
      startDate,
      endDate
    );
    return {
      message: "Newest video analysis retrieved successfully",
      data: {
        video: {
          _id: newestVideo._id,
          title: newestVideo.title,
          thumbnail: newestVideo.thumbnail_video,
          totalViews,
          totalLikes,
          totalDislikes,
          totalComments,
        },
        stats: stats.data, // Trả về stats trực tiếp, bao gồm trends
      },
    };
  } catch (error) {
    throw new AppError(
      `Error retrieving newest video analysis: ${error.message}`,
      error.statusCode || 500
    );
  }
};

module.exports = {
  getVideoStatsService,
  getUserStatsService,
  getChannelOverviewService,
  getNewestVideoAnalysisService,
};
