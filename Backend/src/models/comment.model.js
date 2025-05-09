const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const commentSchema = new mongoose.Schema(
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
    parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    comment_content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxLength: [500, "Comment cannot exceed 500 characters"],
    },
    isEdited: { type: Boolean, default: false }, // Thêm trường để đánh dấu đã chỉnh sửa
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
commentSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
  deleted: true,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
