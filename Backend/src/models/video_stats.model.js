const mongoose = require("mongoose");

const videoStatsSchema = new mongoose.Schema(
  {
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    average_rating: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    subscriptions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

videoStatsSchema.index({ video_id: 1, date: 1 });

const VideoStats = mongoose.model("VideoStats", videoStatsSchema);

module.exports = VideoStats;
