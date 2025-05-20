const cron = require("node-cron");
const Video = require("./models/video.model");
const VideoStats = require("./models/video_stats.model");
const Comment = require("./models/comment.model");
const Review = require("./models/review.model");
const User_Like_Video = require("./models/user_like_video.model");
const User_Dislike_Video = require("./models/user_dislike_video.model");
const UserSubscription = require("./models/user_subscription.model");

// Hàm tổng hợp dữ liệu cho một ngày cụ thể
const aggregateStatsForDay = async (targetDate) => {
  try {
    console.log(
      `Aggregating stats for ${targetDate.toISOString().split("T")[0]}`
    );

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const videos = await Video.find({});

    for (const video of videos) {
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

      const subscriptions = await UserSubscription.countDocuments({
        channel_id: video.user_id,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      });

      await VideoStats.findOneAndUpdate(
        { video_id: video._id, date: startOfDay },
        {
          $set: {
            views: video.views,
            comments,
            reviews: reviewCount,
            average_rating,
            likes,
            dislikes,
            subscriptions,
          },
        },
        { upsert: true, new: true }
      );
    }

    console.log(
      `Stats for ${targetDate.toISOString().split("T")[0]} updated successfully`
    );
  } catch (error) {
    console.error(
      `Error aggregating stats for ${targetDate.toISOString().split("T")[0]}:`,
      error
    );
  }
};

// Chạy cron job hàng ngày lúc 0h
cron.schedule("0 0 * * *", async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  await aggregateStatsForDay(yesterday);
});

// Chạy bù khi server khởi động
const catchUpMissedDays = async () => {
  try {
    console.log("Checking for missed stats aggregation...");

    // Tìm ngày gần nhất có dữ liệu trong VideoStats
    const latestStat = await VideoStats.findOne().sort({ date: -1 });
    const lastAggregatedDate = latestStat
      ? new Date(latestStat.date)
      : new Date("2025-01-01"); // Ngày mặc định
    lastAggregatedDate.setHours(0, 0, 0, 0);

    // Ngày hôm qua
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Tính các ngày bị bỏ lỡ
    const missedDays = [];
    let currentDate = new Date(lastAggregatedDate);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate <= yesterday) {
      missedDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Chạy bù cho các ngày bị bỏ lỡ
    for (const missedDay of missedDays) {
      await aggregateStatsForDay(missedDay);
    }

    console.log(
      "Catch-up completed. Processed",
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
