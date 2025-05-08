const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

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
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
playlistSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
