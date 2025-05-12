const mongoose = require("mongoose");

const playlist_videoSchema = new mongoose.Schema(
  {
    playlist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
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

const Playlist_Video = mongoose.model("Playlist_Video", playlist_videoSchema);

module.exports = Playlist_Video;
