const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description_video: {
      type: String,
      default: null,
    },
    url_video: {
      type: String,
      required: true,
    },
    thumbnail_video: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

videoSchema.index({ user_id: 1, createdAt: -1 });

module.exports = mongoose.model("Video", videoSchema);
