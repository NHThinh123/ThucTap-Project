const {
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
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
    next(error);
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

module.exports = {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
