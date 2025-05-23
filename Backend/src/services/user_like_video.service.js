require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Like_Video = require("../models/user_like_video.model");
const User = require("../models/user.model");
const VideoStats = require("../models/video_stats.model");

const likeVideoService = async (id, video_id) => {
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

  // Create like record
  const likeData = {
    user_id: objectId,
    video_id,
  };

  // Check if already liked
  const existingLike = await User_Like_Video.findOne(likeData);
  if (existingLike) {
    throw new AppError("Video already liked by this user", 400);
  }

  let result = await User_Like_Video.create(likeData);

  // Thống kê số lượng like cho video
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await VideoStats.findOneAndUpdate(
    { video_id, date: today },
    { $inc: { likes: 1 } },
    { upsert: true }
  );
  //
  return result;
};

const unlikeVideoService = async (id, video_id) => {
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

  const unlikeCondition = {
    user_id: objectId,
    video_id,
  };

  let result = await User_Like_Video.deleteMany(unlikeCondition);
  if (result.deletedCount === 0) {
    throw new AppError("No like found to remove", 404);
  }

  return result;
};

const getUserLikeVideoService = async (video_id) => {
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("Invalid video ID", 400);
  }
  let result = await User_Like_Video.find({ video_id }).populate("user_id");
  return result.map((item) => item.user_id);
};

const getVideoLikeByUserService = async (user_id) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new AppError("Invalid ID", 400);
  }
  let result = await User_Like_Video.find({ user_id }).populate("video_id");
  return result.map((item) => item.video_id);
};

const countLikeVideoService = async (video_id) => {
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("Invalid video ID", 400);
  }
  let result = await User_Like_Video.countDocuments({ video_id });
  return result;
};

module.exports = {
  likeVideoService,
  getUserLikeVideoService,
  getVideoLikeByUserService,
  unlikeVideoService,
  countLikeVideoService,
};
