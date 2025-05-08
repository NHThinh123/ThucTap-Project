const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
require("dotenv").config();

const createCommentService = async (
  id,
  video_id,
  parent_comment_id,
  comment_content
) => {
  if (!id || !post_id || !comment_content) {
    throw new AppError("Missing required fields", 400);
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(post_id)
  ) {
    throw new AppError("Invalid ID or post ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);

  if (!user && !business) {
    throw new AppError("ID does not belong to any user or business", 404);
  }

  let result = await Comment.create({
    user_id: user ? objectId : null,
    business_id: business ? objectId : null,
    post_id: post_id,
    parent_comment_id: parent_comment_id,
    comment_content: comment_content,
  });
  return result;
};

// const getListCommentByPostService = async (query) => {
//   const { post_id, id } = query;
//   if (!mongoose.Types.ObjectId.isValid(post_id)) {
//     throw new AppError("Invalid post ID", 400);
//   }

//   const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
//   const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

//   let comments = await Comment.collection
//     .aggregate([
//       { $match: { post_id: new mongoose.Types.ObjectId(post_id) } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "businesses",
//           localField: "business_id",
//           foreignField: "_id",
//           as: "business",
//         },
//       },
//       { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "user_like_comments",
//           localField: "_id",
//           foreignField: "comment_id",
//           as: "likes",
//         },
//       },
//       {
//         $addFields: {
//           likeCount: { $size: "$likes" },
//           isLike: isValidId
//             ? {
//                 $or: [
//                   { $in: [objectId, "$likes.user_id"] },
//                   { $in: [objectId, "$likes.business_id"] },
//                 ],
//               }
//             : false,
//           author: {
//             $cond: {
//               if: { $ne: ["$user_id", null] },
//               then: {
//                 id: "$user_id",
//                 name: "$user.name",
//                 avatar: "$user.avatar",
//                 isBusiness: false,
//               },
//               else: {
//                 id: "$business_id",
//                 name: "$business.business_name",
//                 avatar: "$business.avatar",
//                 isBusiness: true,
//               },
//             },
//           },
//           comment_content: {
//             $cond: {
//               if: "$deleted",
//               then: "(bình luận đã bị xóa)",
//               else: "$comment_content",
//             },
//           },
//         },
//       },
//       { $sort: { createdAt: -1 } },
//       {
//         $project: {
//           author: 1,
//           comment_content: 1,
//           createdAt: 1,
//           likeCount: 1,
//           isLike: 1,
//           parent_comment_id: 1,
//           isEdited: 1,
//           deleted: 1,
//         },
//       },
//     ])
//     .toArray();

//   let parentComments = comments.filter((c) => !c.parent_comment_id);
//   let result = parentComments.map((comment) => ({
//     ...comment,
//     replyCount: comments.filter(
//       (c) => String(c.parent_comment_id) === String(comment._id)
//     ).length,
//   }));

//   return result;
// };

// const getCommentByIdService = async (comment_id, id) => {
//   if (!mongoose.Types.ObjectId.isValid(comment_id)) {
//     throw new AppError("Invalid comment ID", 400);
//   }

//   const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
//   const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

//   let result = await Comment.collection
//     .aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(comment_id) } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "businesses",
//           localField: "business_id",
//           foreignField: "_id",
//           as: "business",
//         },
//       },
//       { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "user_like_comments",
//           localField: "_id",
//           foreignField: "comment_id",
//           as: "likes",
//         },
//       },
//       {
//         $addFields: {
//           likeCount: { $size: "$likes" },
//           isLike: isValidId
//             ? {
//                 $or: [
//                   { $in: [objectId, "$likes.user_id"] },
//                   { $in: [objectId, "$likes.business_id"] },
//                 ],
//               }
//             : false,
//           author: {
//             $cond: {
//               if: { $ne: ["$user_id", null] },
//               then: {
//                 id: "$user_id",
//                 name: "$user.name",
//                 avatar: "$user.avatar",
//                 isBusiness: false,
//               },
//               else: {
//                 id: "$business_id",
//                 name: "$business.business_name",
//                 avatar: "$business.avatar",
//                 isBusiness: true,
//               },
//             },
//           },
//           comment_content: {
//             $cond: {
//               if: "$deleted",
//               then: "(bình luận đã bị xóa)",
//               else: "$comment_content",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           author: 1,
//           comment_content: 1,
//           createdAt: 1,
//           likeCount: 1,
//           isLike: 1,
//           parent_comment_id: 1,
//           isEdited: 1,
//           deleted: 1,
//         },
//       },
//     ])
//     .toArray();

//   if (!result || result.length === 0) {
//     throw new AppError("Comment not found", 404);
//   }

//   let replies = await Comment.collection
//     .aggregate([
//       {
//         $match: { parent_comment_id: new mongoose.Types.ObjectId(comment_id) },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "businesses",
//           localField: "business_id",
//           foreignField: "_id",
//           as: "business",
//         },
//       },
//       { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } },
//       {
//         $addFields: {
//           author: {
//             $cond: {
//               if: { $ne: ["$user_id", null] },
//               then: {
//                 id: "$user_id",
//                 name: "$user.name",
//                 avatar: "$user.avatar",
//                 isBusiness: false,
//               },
//               else: {
//                 id: "$business_id",
//                 name: "$business.business_name",
//                 avatar: "$business.avatar",
//                 isBusiness: true,
//               },
//             },
//           },
//           comment_content: {
//             $cond: {
//               if: "$deleted",
//               then: "(bình luận đã bị xóa)",
//               else: "$comment_content",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           author: 1,
//           comment_content: 1,
//           createdAt: 1,
//           parent_comment_id: 1,
//           isEdited: 1,
//           deleted: 1,
//         },
//       },
//     ])
//     .toArray();

//   return { ...result[0], replies };
// };

// const getReplyByCommentService = async (query) => {
//   const { comment_id, id } = query;
//   if (!mongoose.Types.ObjectId.isValid(comment_id)) {
//     throw new AppError("Invalid comment ID", 400);
//   }

//   const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
//   const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

//   let replies = await Comment.collection
//     .aggregate([
//       {
//         $match: { parent_comment_id: new mongoose.Types.ObjectId(comment_id) },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "businesses",
//           localField: "business_id",
//           foreignField: "_id",
//           as: "business",
//         },
//       },
//       { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: "user_like_comments",
//           localField: "_id",
//           foreignField: "comment_id",
//           as: "likes",
//         },
//       },
//       {
//         $addFields: {
//           likeCount: { $size: "$likes" },
//           isLike: isValidId
//             ? {
//                 $or: [
//                   { $in: [objectId, "$likes.user_id"] },
//                   { $in: [objectId, "$likes.business_id"] },
//                 ],
//               }
//             : false,
//           author: {
//             $cond: {
//               if: { $ne: ["$user_id", null] },
//               then: {
//                 id: "$user_id",
//                 name: "$user.name",
//                 avatar: "$user.avatar",
//                 isBusiness: false,
//               },
//               else: {
//                 id: "$business_id",
//                 name: "$business.business_name",
//                 avatar: "$business.avatar",
//                 isBusiness: true,
//               },
//             },
//           },
//           comment_content: {
//             $cond: {
//               if: "$deleted",
//               then: "(bình luận đã bị xóa)",
//               else: "$comment_content",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           author: 1,
//           comment_content: 1,
//           createdAt: 1,
//           likeCount: 1,
//           isLike: 1,
//           parent_comment_id: 1,
//           isEdited: 1,
//           deleted: 1,
//         },
//       },
//     ])
//     .toArray();

//   for (let reply of replies) {
//     let replyCount = await Comment.countDocuments({
//       parent_comment_id: reply._id,
//     });
//     reply.replyCount = replyCount;
//   }

//   return replies;
// };

const updateCommentService = async (comment_id, dataUpdate) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  const { comment_content } = dataUpdate;
  if (!comment_content) {
    throw new AppError("Comment content is required", 400);
  }

  let result = await Comment.findOneAndUpdate(
    { _id: comment_id },
    { comment_content, isEdited: true },
    { new: true }
  );

  if (!result) {
    throw new AppError("Comment not found", 404);
  }

  return result;
};

const deleteCommentService = async (comment_id) => {
  let comment = await Comment.findById(comment_id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }
  let result = await comment.delete();
  return result;
};

module.exports = {
  createCommentService,
  getListCommentByPostService,
  getCommentByIdService,
  getReplyByCommentService,
  updateCommentService,
  deleteCommentService,
};
