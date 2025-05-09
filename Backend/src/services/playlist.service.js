const Playlist = require("../models/playlist.model");
const AppError = require("../utils/AppError");

const createPlaylistService = async (data) => {
  const { user_id, title_playlist } = data;
  const playlist = await Playlist.create({
    user_id,
    title_playlist,
    description_playlist: data.description_playlist || "",
    isPublic: data.isPublic || true,
  });
  return playlist;
};

const getPlaylistByIdService = async (playlistId) => {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }
  return playlist;
};

const getAllPlaylistOfUserService = async (userId) => {
  return Playlist.find({ user_id: userId });
};

const updatePlaylistService = async (playlistId, data) => {
  const playlist = await Playlist.findOneAndUpdate({ _id: playlistId }, data, {
    new: true,
    runValidators: true,
  });
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  return playlist;
};

const deletePlaylistService = async (playlistId) => {
  const playlist = await Playlist.findOne({ _id: playlistId });
  if (!playlist) {
    throw new AppError("Playlist not found or you are not authorized", 404);
  }
  await playlist.delete();
  return playlist;
};

module.exports = {
  createPlaylistService,
  getPlaylistByIdService,
  getAllPlaylistOfUserService,
  updatePlaylistService,
  deletePlaylistService,
};
