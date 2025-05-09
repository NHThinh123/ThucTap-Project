const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

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

// Thêm plugin xóa mềm
playlist_videoSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
  deleted: true,
});

const Playlist_Video = mongoose.model("Playlist_Video", playlist_videoSchema);

module.exports = Playlist_Video;
