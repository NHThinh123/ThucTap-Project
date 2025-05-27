require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Like_Video = require("../models/user_like_video.model");
const User_Dislike_Video = require("../models/user_dislike_video.model");
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

  // Check and remove existing dislike
  const existingDislike = await User_Dislike_Video.findOneAndDelete({
    user_id: objectId,
    video_id,
  });

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

  const updateStats = { $inc: { likes: 1 } };
  if (existingDislike) {
    updateStats.$inc.dislikes = -1;
  }

  await VideoStats.findOneAndUpdate({ video_id, date: today }, updateStats, {
    upsert: true,
  });
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

  // Xóa bản ghi like
  const result = await User_Like_Video.findOneAndDelete(unlikeCondition);
  if (!result) {
    throw new AppError("Không tìm thấy lượt thích để xóa", 404);
  }

  // Cập nhật thống kê video
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await VideoStats.findOneAndUpdate(
    { video_id, date: today },
    { $inc: { likes: -1 } },
    { upsert: true }
  );
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

const getUserLikeStatusService = async (user_id, video_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(video_id)
  ) {
    throw new AppError("Invalid user ID or video ID", 400);
  }

  const likeStatus = await User_Like_Video.findOne({
    user_id: new mongoose.Types.ObjectId(user_id),
    video_id,
  });

  return !!likeStatus; // Returns true if liked, false otherwise
};

module.exports = {
  likeVideoService,
  getUserLikeVideoService,
  getVideoLikeByUserService,
  unlikeVideoService,
  countLikeVideoService,
  getUserLikeStatusService,
};
