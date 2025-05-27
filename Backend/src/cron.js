const cron = require("node-cron");
const Video = require("./models/video.model");
const VideoStats = require("./models/video_stats.model");
const Comment = require("./models/comment.model");
const Review = require("./models/review.model");
const User_Like_Video = require("./models/user_like_video.model");
const User_Dislike_Video = require("./models/user_dislike_video.model");

// Hàm tổng hợp dữ liệu cho một ngày cụ thể (sử dụng UTC)
const aggregateStatsForDay = async (targetDate) => {
  try {
    const utcDate = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate()
      )
    );
    console.log(`Aggregating stats for ${utcDate.toISOString().split("T")[0]}`);

    const startOfDay = new Date(utcDate);
    const endOfDay = new Date(utcDate);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    // Tính ngày trước đó
    const previousDay = new Date(startOfDay);
    previousDay.setUTCDate(previousDay.getUTCDate() - 1);

    const videos = await Video.find({});

    for (const video of videos) {
      // Lấy số lượt view hiện tại từ Video
      const currentViews = video.views || 0;

      // Lấy số lượt view của ngày trước từ VideoStats
      const previousStats = await VideoStats.findOne({
        video_id: video._id,
        date: previousDay,
      });

      // Tính số lượt view của ngày hiện tại
      const previousViews = previousStats ? previousStats.views : 0;
      const dailyViews = Math.max(0, currentViews - previousViews); // Đảm bảo không âm

      const comments = await Comment.countDocuments({
        video_id: video._id,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      const reviews = await Review.find({
        video_id: video._id,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });
      const reviewCount = reviews.length;
      const average_rating =
        reviewCount > 0
          ? reviews.reduce((sum, r) => sum + r.review_rating, 0) / reviewCount
          : 0;

      const likes = await User_Like_Video.countDocuments({
        video_id: video._id,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      const dislikes = await User_Dislike_Video.countDocuments({
        video_id: video._id,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      await VideoStats.findOneAndUpdate(
        { video_id: video._id, date: startOfDay },
        {
          $set: {
            views: dailyViews, // Lưu số lượt view hàng ngày
            comments,
            reviews: reviewCount,
            average_rating,
            likes,
            dislikes,
          },
        },
        { upsert: true, new: true }
      );
    }

    console.log(
      `Stats for ${utcDate.toISOString().split("T")[0]} updated successfully`
    );
  } catch (error) {
    console.error(
      `Error aggregating stats for ${targetDate.toISOString().split("T")[0]}:`,
      error
    );
  }
};

// Chạy cron job hàng ngày lúc 0h UTC
cron.schedule("0 0 * * *", async () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);
  await aggregateStatsForDay(yesterday);
});

// Chạy bù khi server khởi động
const catchUpMissedDays = async () => {
  try {
    console.log("Checking for missed stats aggregation...");

    const latestStat = await VideoStats.findOne().sort({ date: -1 });
    const lastAggregatedDate = latestStat
      ? new Date(latestStat.date)
      : new Date(Date.UTC(2025, 0, 1));
    lastAggregatedDate.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);

    const missedDays = [];
    let currentDate = new Date(lastAggregatedDate);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);

    while (currentDate <= yesterday) {
      missedDays.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    const maxCatchUpDays = 7;
    const daysToProcess = missedDays.slice(-maxCatchUpDays);

    for (const missedDay of daysToProcess) {
      await aggregateStatsForDay(missedDay);
    }

    console.log(
      "Catch-up completed. Processed",
      daysToProcess.length,
      "of",
      missedDays.length,
      "missed days."
    );
  } catch (error) {
    console.error("Error during catch-up:", error);
  }
};

// Chạy catch-up khi server khởi động
catchUpMissedDays();

module.exports = { aggregateStatsForDay, catchUpMissedDays };
