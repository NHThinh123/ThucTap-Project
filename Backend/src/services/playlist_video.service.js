const Playlist_Video = require("../models/playlist_video.model");
const AppError = require("../utils/AppError");

const addVideoToPlaylistService = async (playlistId, videoId) => {
  const playlist_video = await Playlist_Video.create({
    playlist_id: playlistId,
    video_id: videoId,
  });
  return playlist_video;
};

const removeVideoFromPlaylistService = async (playlistId, videoId) => {
  const playlist_video = await Playlist_Video.findOne({
    playlist_id: playlistId,
    video_id: videoId,
  });
  if (!playlist_video) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  await playlist_video.delete();
  return playlist_video;
};

module.exports = {
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
};
