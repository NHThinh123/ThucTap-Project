const userLikeVideoService = require("../services/user_like_video.service");
const userDislikeVideoService = require("../services/user_dislike_video.service");
const AppError = require("../utils/AppError");

const likeVideo = async (req, res, next) => {
  try {
    const { video_id, user_id } = req.body;

    const result = await userLikeVideoService.likeVideoService(
      user_id,
      video_id
    );
    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const unlikeVideo = async (req, res, next) => {
  try {
    const { user_id, video_id } = req.body;

    const result = await userLikeVideoService.unlikeVideoService(
      user_id,
      video_id
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserLikedVideos = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const result = await userLikeVideoService.getUserLikeVideoService(video_id);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getVideoLikes = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await userLikeVideoService.getVideoLikeByUserService(
      user_id
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const countLikeVideo = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const result = await userLikeVideoService.countLikeVideoService(video_id);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserLikeStatus = async (req, res, next) => {
  try {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
      return res.status(400).json({
        status: "error",
        message: "Missing user_id or video_id",
      });
    }

    const result = await userLikeVideoService.getUserLikeStatusService(
      user_id,
      video_id
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likeVideo,
  unlikeVideo,
  getVideoLikes,
  getUserLikedVideos,
  countLikeVideo,
  getUserLikeStatus,
};
