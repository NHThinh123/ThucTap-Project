const Playlist = require("../models/playlist.model");
const AppError = require("../utils/AppError");

const createPlaylistService = async (data, userId) => {
  const playlist = await Playlist.create({
    ...data,
    user_id: userId,
  });
  return playlist;
};

const getPlaylistByIdService = async (playlistId) => {
  const playlist = await Playlist.findById(playlistId)
    .populate("user_id", "username email")
    .populate("videos", "title thumbnail duration");
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }
  return playlist;
};

const getUserPlaylistsService = async (userId) => {
  return Playlist.find({ user_id: userId })
    .populate("videos", "title thumbnail duration")
    .sort({ createdAt: -1 });
};

const updatePlaylistService = async (playlistId, userId, data) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, user_id: userId },
    data,
    { new: true, runValidators: true }
  );
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  return playlist;
};

const deletePlaylistService = async (playlistId, userId) => {
  const playlist = await Playlist.findOne({ _id: playlistId, user_id: userId });
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  await playlist.delete();
  return playlist;
};

const addVideoToPlaylistService = async (playlistId, userId, videoId) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, user_id: userId },
    { $addToSet: { videos: videoId } },
    { new: true }
  );
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  return playlist;
};

const removeVideoFromPlaylistService = async (playlistId, userId, videoId) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, user_id: userId },
    { $pull: { videos: videoId } },
    { new: true }
  );
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  return playlist;
};

const restorePlaylistService = async (playlistId, userId) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, user: userId, deleted: true },
    { deleted: false, deletedAt: null },
    { new: true }
  );
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  return playlist;
};

module.exports = {
  createPlaylistService,
  getPlaylistByIdService,
  getUserPlaylistsService,
  updatePlaylistService,
  deletePlaylistService,
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
  restorePlaylistService,
};
