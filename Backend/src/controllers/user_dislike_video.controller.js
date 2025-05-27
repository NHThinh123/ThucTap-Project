const userDislikeVideoService = require("../services/user_dislike_video.service");
const userLikeVideoService = require("../services/user_like_video.service");
const AppError = require("../utils/AppError");

const dislikeVideo = async (req, res, next) => {
  try {
    const { video_id, user_id } = req.body;

    const result = await userDislikeVideoService.dislikeVideoService(
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

const undislikeVideo = async (req, res, next) => {
  try {
    const { user_id, video_id } = req.body;

    const result = await userDislikeVideoService.undislikeVideoService(
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

const getUserDislikedVideos = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const result = await userDislikeVideoService.getUserDislikeVideoService(
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

const getVideoDislikes = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await userDislikeVideoService.getVideoDislikeByUserService(
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

const countDislikeVideo = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const result = await userDislikeVideoService.countDislikeVideoService(
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

const getUserDislikeStatus = async (req, res, next) => {
  try {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
      return res.status(400).json({
        status: "error",
        message: "Missing user_id or video_id",
      });
    }

    const result = await userDislikeVideoService.getUserDislikeStatusService(
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
  dislikeVideo,
  undislikeVideo,
  getVideoDislikes,
  getUserDislikedVideos,
  countDislikeVideo,
  getUserDislikeStatus,
};
