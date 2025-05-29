const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title_playlist: {
      type: String,
      required: [true, "Playlist title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description_playlist: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

playlistSchema.index({ user_id: 1 });

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
