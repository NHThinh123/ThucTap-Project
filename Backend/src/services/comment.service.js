const Comment = require("../models/comment.model");
const AppError = require("../utils/AppError");

const createCommentService = async (data, userId, videoId) => {
  const { parent_comment_id, comment_content } = data;

  if (parent_comment_id) {
    const parentComment = await Comment.findOne({
      _id: parent_comment_id,
    });
    if (!parentComment) {
      throw new AppError("Parent comment not found", 404);
    }
  }

  const comment = await Comment.create({
    comment_content,
    user_id: userId,
    video_id: videoId,
    parent_comment_id: parent_comment_id || null,
  });
  return comment;
};

const getCommentByIdService = async (commentId) => {
  const comment = await Comment.findById(commentId)
    .populate("user_id", "user_name email avatar nick_name")
    .populate("video_id", "title_video")
    .populate("parent_comment_id", "comment_content user_id");
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }
  return comment;
};

const getVideoCommentsService = async (videoId) => {
  // Get top-level comments (parentCommentId is null)
  const comments = await Comment.find({
    video_id: videoId,
    parent_comment_id: null,
  })
    .populate("user_id", "user_name email avatar nick_name")
    .sort({ createdAt: -1 });

  // For each top-level comment, fetch its replies
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({ parent_comment_id: comment._id })
        .populate("user_id", "user_name email avatar nick_name")
        .sort({ createdAt: 1 });
      return { ...comment.toObject(), replies };
    })
  );

  return commentsWithReplies;
};

const updateCommentService = async (commentId, userId, data) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, user_id: userId },
    { ...data, isEdited: true },
    { new: true, runValidators: true }
  );
  if (!comment) {
    throw new AppError("Comment not found or you are not authorized", 404);
  }
  return comment;
};

const deleteCommentService = async (commentId, userId) => {
  const comment = await Comment.findOne({ _id: commentId, user_id: userId });
  if (!comment) {
    throw new AppError("Comment not found or you are not authorized", 404);
  }
  await comment.delete(); // Use mongoose-delete's delete method
  return comment;
};

module.exports = {
  createCommentService,
  getCommentByIdService,
  getVideoCommentsService,
  updateCommentService,
  deleteCommentService,
};
