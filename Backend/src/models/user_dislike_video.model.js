const mongoose = require("mongoose");

const user_dislike_videoSchema = new mongoose.Schema(
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

const User_Dislike_Video = mongoose.model(
  "User_Dislike_Video",
  user_dislike_videoSchema
);

module.exports = User_Dislike_Video;
