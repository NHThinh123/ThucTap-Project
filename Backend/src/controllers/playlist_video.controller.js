const {
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
  getVideosInPlaylistService,
} = require("../services/playlist_video.service");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`${fieldName} is invalid`, 400);
  }
};

const addVideoToPlaylist = async (req, res, next) => {
  try {
    console.log("Nhận yêu cầu:", req.body);
    const { playlist_id, video_id } = req.body;
    validateObjectId(playlist_id, "Playlist ID");
    validateObjectId(video_id, "Video ID");
    const playlist_video = await addVideoToPlaylistService(
      playlist_id,
      video_id
    );
    res.status(200).json({
      status: "success",
      data: { playlist_video },
    });
  } catch (error) {
    console.error("Lỗi trong controller:", error);
    const status = error.status || 500;
    const message = error.message || "Lỗi máy chủ nội bộ";
    return res.status(status).json({ message });
  }
};

const removeVideoFromPlaylist = async (req, res, next) => {
  try {
    const { playlist_id, video_id } = req.body;
    validateObjectId(playlist_id, "Playlist ID");
    validateObjectId(video_id, "Video ID");
    const playlist_video = await removeVideoFromPlaylistService(
      playlist_id,
      video_id
    );
    res.status(200).json({
      status: "success",
      data: { playlist_video },
    });
  } catch (error) {
    next(error);
  }
};
const getVideoInPlaylist = async (req, res, next) => {
  try {
    const { playlist_id } = req.params;
    validateObjectId(playlist_id, "Playlist ID");
    const videos = await getVideosInPlaylistService(playlist_id);
    res.status(200).json({
      status: "success",
      data: { videos },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getVideoInPlaylist,
};
