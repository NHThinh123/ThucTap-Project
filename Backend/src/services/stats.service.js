const mongoose = require("mongoose");
const VideoStats = require("../models/video_stats.model");
const AppError = require("../utils/AppError");

const getVideoStatsService = async (videoId, period, startDate, endDate) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new AppError("Invalid video ID", 400);
    }

    let groupBy;
    switch (period) {
      case "daily":
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        break;
      case "weekly":
        groupBy = {
          $concat: [
            { $toString: { $year: "$date" } },
            "-W",
            { $toString: { $week: "$date" } },
          ],
        };
        break;
      case "monthly":
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
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
        $group: {
          _id: groupBy,
          views: { $sum: "$views" },
          comments: { $sum: "$comments" },
          reviews: { $sum: "$reviews" },
          average_rating: { $avg: "$average_rating" },
          likes: { $sum: "$likes" },
          dislikes: { $sum: "$dislikes" },
          subscriptions: { $sum: "$subscriptions" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Tính toán tăng/giảm so với khoảng thời gian trước
    const statsWithTrends = stats.map((current, index) => {
      if (index === 0) {
        return { ...current, trends: {} };
      }
      const previous = stats[index - 1];
      return {
        ...current,
        trends: {
          views: current.views - previous.views,
          comments: current.comments - previous.comments,
          reviews: current.reviews - previous.reviews,
          average_rating: current.average_rating - previous.average_rating,
          likes: current.likes - previous.likes,
          dislikes: current.dislikes - previous.dislikes,
          subscriptions: current.subscriptions - previous.subscriptions,
        },
      };
    });

    return {
      message: "Statistics retrieved successfully",
      data: statsWithTrends,
    };
  } catch (error) {
    throw new AppError(`Error retrieving stats: ${error.message}`, 500);
  }
};

module.exports = {
  getVideoStatsService,
};
