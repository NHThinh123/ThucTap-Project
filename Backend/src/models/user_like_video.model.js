const mongoose = require("mongoose");

const user_like_videoSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

const User_Like_Video = mongoose.model(
  "User_Like_Video",
  user_like_videoSchema
);

module.exports = User_Like_Video;
