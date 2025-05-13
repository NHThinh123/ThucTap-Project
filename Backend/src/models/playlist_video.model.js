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

playlist_videoSchema.index({ playlist_id: 1, video_id: 1 });

const Playlist_Video = mongoose.model("Playlist_Video", playlist_videoSchema);

module.exports = Playlist_Video;
