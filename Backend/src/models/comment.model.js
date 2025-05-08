const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    video_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    comment_content: {
      type: String,
      required: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    isEdited: { type: Boolean, default: false }, // Thêm trường để đánh dấu đã chỉnh sửa
  },
  { timestamps: true }
);

// Thêm plugin xóa mềm
commentSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
