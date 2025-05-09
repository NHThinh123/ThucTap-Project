const {
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
} = require("../services/playlist_video.service");

const addVideoToPlaylist = async (req, res, next) => {
  try {
    const { playlist_id, video_id } = req.body;
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
