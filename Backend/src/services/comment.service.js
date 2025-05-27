const Comment = require("../models/comment.model");
const VideoStats = require("../models/video_stats.model");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

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

  //Thống kê số lượng comment cho video
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await VideoStats.findOneAndUpdate(
    { video_id: videoId, date: today },
    { $inc: { comments: 1 } },
    { upsert: true }
  );
  //

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

const getVideoCommentsService = async (query) => {
  const { video_id, user_id } = query;
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("Invalid video ID", 400);
  }
  const isValidId = user_id ? mongoose.Types.ObjectId.isValid(user_id) : false;
  const objectId = isValidId ? new mongoose.Types.ObjectId(user_id) : null;
  let comments = await Comment.collection
    .aggregate([
      { $match: { video_id: new mongoose.Types.ObjectId(video_id) } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          comment_content: {
            $cond: {
              if: "$deleted",
              then: "(bình luận đã bị xóa)",
              else: "$comment_content",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          comment_content: 1,
          createdAt: 1,
          parent_comment_id: 1,
          isEdited: 1,
          deleted: 1,
          user: {
            _id: "$user._id",
            user_name: "$user.user_name",
            nickname: "$user.nickname",
            avatar: "$user.avatar",
          },
        },
      },
    ])
    .toArray();
  let parentComments = comments.filter((c) => !c.parent_comment_id); // lọc bình luận gốc
  let result = parentComments.map((comment) => ({
    ...comment,
    replyCount: comments.filter(
      (c) => String(c.parent_comment_id) === String(comment._id)
    ).length,
  }));
  return result;
};

const getReplyCommentsService = async (parentCommentId) => {
  const replies = await Comment.find({ parent_comment_id: parentCommentId })
    .populate("user_id", "user_name email avatar nickname")
    .sort({ createdAt: 1 });
  if (!replies) {
    throw new AppError("Replies not found", 404);
  }
  return replies;
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
  getReplyCommentsService,
  updateCommentService,
  deleteCommentService,
};
