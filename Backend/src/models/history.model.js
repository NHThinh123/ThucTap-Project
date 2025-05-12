const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const historySchema = new mongoose.Schema(
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
    watch_duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
historySchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
  deleted: true,
});

const History = mongoose.model("History", historySchema);

module.exports = History;
