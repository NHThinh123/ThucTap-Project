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

    // Sử dụng aggregation pipeline để tổng hợp dữ liệu
    const statsAggregation = await Video.aggregate([
      {
        $lookup: {
          from: "videostats",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$video_id", "$$videoId"] },
                    { $eq: ["$date", startOfDay] },
                  ],
                },
              },
            },
            { $project: { views: 1 } },
          ],
          as: "stats",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$video_id", "$$videoId"] },
                    { $gte: ["$createdAt", startOfDay] },
                    { $lt: ["$createdAt", endOfDay] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "reviews",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$video_id", "$$videoId"] },
                    { $gte: ["$createdAt", startOfDay] },
                    { $lt: ["$createdAt", endOfDay] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalRating: { $sum: "$review_rating" },
              },
            },
          ],
          as: "reviews",
        },
      },
      {
        $lookup: {
          from: "user_like_videos",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$video_id", "$$videoId"] },
                    { $gte: ["$createdAt", startOfDay] },
                    { $lt: ["$createdAt", endOfDay] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "user_dislike_videos",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$video_id", "$$videoId"] },
                    { $gte: ["$createdAt", startOfDay] },
                    { $lt: ["$createdAt", endOfDay] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "dislikes",
        },
      },
      {
        $project: {
          video_id: "$_id",
          views: { $ifNull: [{ $arrayElemAt: ["$stats.views", 0] }, 0] },
          comments: { $ifNull: [{ $arrayElemAt: ["$comments.count", 0] }, 0] },
          reviews: { $ifNull: [{ $arrayElemAt: ["$reviews.count", 0] }, 0] },
          average_rating: {
            $cond: [
              { $gt: [{ $arrayElemAt: ["$reviews.count", 0] }, 0] },
              {
                $divide: [
                  { $arrayElemAt: ["$reviews.totalRating", 0] },
                  { $arrayElemAt: ["$reviews.count", 0] },
                ],
              },
              0,
            ],
          },
          likes: { $ifNull: [{ $arrayElemAt: ["$likes.count", 0] }, 0] },
          dislikes: { $ifNull: [{ $arrayElemAt: ["$dislikes.count", 0] }, 0] },
        },
      },
    ]);

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        for (const stat of statsAggregation) {
          await VideoStats.findOneAndUpdate(
            { video_id: stat.video_id, date: startOfDay },
            {
              $set: {
                views: stat.views,
                comments: stat.comments,
                reviews: stat.reviews,
                average_rating: stat.average_rating,
                likes: stat.likes,
                dislikes: stat.dislikes,
              },
            },
            { upsert: true, new: true, session }
          );
        }
      });
    } finally {
      session.endSession();
    }

    console.log(
      `Stats for ${utcDate.toISOString().split("T")[0]} updated successfully`
    );
  } catch (error) {
    console.error(
      `Error aggregating stats for ${targetDate.toISOString().split("T")[0]}:`,
      {
        error: error.message,
        stack: error.stack,
      }
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
    console.error("Error during catch-up:", {
      error: error.message,
      stack: error.stack,
    });
  }
};

// Chạy catch-up khi server khởi động
catchUpMissedDays();

module.exports = { aggregateStatsForDay, catchUpMissedDays };
