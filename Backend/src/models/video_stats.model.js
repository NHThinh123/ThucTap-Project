const mongoose = require("mongoose");

const VideoStatsSchema = new mongoose.Schema(
  {
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    date: {
      type: Date,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VideoStats", VideoStatsSchema);
