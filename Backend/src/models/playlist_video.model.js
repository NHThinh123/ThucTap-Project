const mongoose = require("mongoose");

const playlistVideoSchema = new mongoose.Schema(
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
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

playlistVideoSchema.index({ playlist_id: 1, video_id: 1 });

const PlaylistVideo = mongoose.model("PlaylistVideo", playlistVideoSchema);

module.exports = PlaylistVideo;
