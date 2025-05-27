require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Dislike_Video = require("../models/user_dislike_video.model");
const User_Like_Video = require("../models/user_like_video.model");
const User = require("../models/user.model");
const VideoStats = require("../models/video_stats.model");

const dislikeVideoService = async (id, video_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(video_id)
  ) {
    throw new AppError("Invalid ID or video ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Check if user exists
  const user = await User.findById(objectId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existingLike = await User_Like_Video.findOneAndDelete({
    user_id: objectId,
    video_id,
  });

  // Create dislike record
  const dislikeData = {
    user_id: objectId,
    video_id,
  };

  // Check if already disliked
  const existingDislike = await User_Dislike_Video.findOne(dislikeData);
  if (existingDislike) {
    throw new AppError("Video already disliked by this user", 400);
  }

  let result = await User_Dislike_Video.create(dislikeData);

  // Thống kê số lượng dislike cho video
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updateStats = { $inc: { dislikes: 1 } };
  if (existingLike) {
    updateStats.$inc.likes = -1;
  }

  await VideoStats.findOneAndUpdate({ video_id, date: today }, updateStats, {
    upsert: true,
  });
  //

  return result;
};

const undislikeVideoService = async (id, video_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(video_id)
  ) {
    throw new AppError("Invalid ID or video ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Check if user exists
  const user = await User.findById(objectId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const undislikeCondition = {
    user_id: objectId,
    video_id,
  };

  // Xóa bản ghi dislike
  const result = await User_Dislike_Video.findOneAndDelete(undislikeCondition);
  if (!result) {
    throw new AppError("Không tìm thấy lượt không thích để xóa", 404);
  }

  // Cập nhật thống kê video
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await VideoStats.findOneAndUpdate(
    { video_id, date: today },
    { $inc: { dislikes: -1 } },
    { upsert: true }
  );

  return result;
};

const getUserDislikeVideoService = async (video_id) => {
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("Invalid video ID", 400);
  }
  let result = await User_Dislike_Video.find({ video_id }).populate("user_id");
  return result.map((item) => item.user_id);
};

const getVideoDislikeByUserService = async (user_id) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new AppError("Invalid ID", 400);
  }
  let result = await User_Dislike_Video.find({ user_id }).populate("video_id");
  return result.map((item) => item.video_id);
};

const countDislikeVideoService = async (video_id) => {
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("Invalid video ID", 400);
  }
  let result = await User_Dislike_Video.countDocuments({ video_id });
  return result;
};

const getUserDislikeStatusService = async (user_id, video_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(video_id)
  ) {
    throw new AppError("Invalid user ID or video ID", 400);
  }

  const dislikeStatus = await User_Dislike_Video.findOne({
    user_id: new mongoose.Types.ObjectId(user_id),
    video_id,
  });

  return !!dislikeStatus; // Returns true if liked, false otherwise
};

module.exports = {
  dislikeVideoService,
  getUserDislikeVideoService,
  getVideoDislikeByUserService,
  undislikeVideoService,
  countDislikeVideoService,
  getUserDislikeStatusService,
};
