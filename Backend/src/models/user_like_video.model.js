const mongoose = require("mongoose");

const user_like_videoSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

user_like_videoSchema.index({ user_id: 1, video_id: 1 });

const User_Like_Video = mongoose.model(
  "User_Like_Video",
  user_like_videoSchema
);

module.exports = User_Like_Video;
