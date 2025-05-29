const PlaylistVideo = require("../models/playlist_video.model");
const AppError = require("../utils/AppError");

const addVideoToPlaylistService = async (playlistId, videoId) => {
  const existing = await PlaylistVideo.findOne({
    playlist_id: playlistId,
    video_id: videoId,
  });
  if (existing) {
    throw new AppError("Video already exists in playlist", 400);
  }
  const count = await PlaylistVideo.countDocuments({ playlist_id: playlistId });
  const playlist_video = await PlaylistVideo.create({
    playlist_id: playlistId,
    video_id: videoId,
    order: count + 1,
  });
  return playlist_video;
};

const removeVideoFromPlaylistService = async (playlistId, videoId) => {
  const playlist_video = await PlaylistVideo.findOneAndDelete({
    playlist_id: playlistId,
    video_id: videoId,
  });
  if (!playlist_video) {
    throw new AppError("Video not found in playlist", 404);
  }
  return playlist_video;
};

module.exports = {
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
};
