const Playlist = require("../models/playlist.model");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

const createPlaylistService = async (data) => {
  const { user_id, title_playlist } = data;
  const playlist = await Playlist.create({
    user_id,
    title_playlist,
    description_playlist: data.description_playlist || "",
    isPublic: data.isPublic ?? true,
  });
  return playlist;
};

const getPlaylistByIdService = async (playlist_id, user_id) => {
  // Tạm thời bỏ populate để test
  const playlist = await Playlist.findById(playlist_id);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }
  // Check authorization
  if (
    !playlist.isPublic &&
    user_id &&
    playlist.user_id.toString() !== user_id.toString()
  ) {
    throw new AppError("You are not authorized to view this playlist", 403);
  }

  return playlist;
};
const getAllPlaylistOfUserService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return Playlist.find({ user_id: userId }).skip(skip).limit(limit);
};

const updatePlaylistService = async (playlistId, data, user_id) => {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }
  if (playlist.user_id.toString() !== user_id.toString()) {
    throw new AppError("You are not authorized to update this playlist", 403);
  }
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId },
    data,
    {
      new: true,
      runValidators: true,
    }
  );
  return updatedPlaylist;
};

const deletePlaylistService = async (playlistId, user_id) => {
  if (!user_id) {
    throw new AppError("Người dùng chưa được xác thực", 401);
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new AppError("Không tìm thấy danh sách phát", 404);
  }
  if (playlist.user_id.toString() !== user_id.toString()) {
    throw new AppError("Bạn không có quyền xóa danh sách phát này", 403);
  }
  await Playlist.deleteOne({ _id: playlistId });
  return playlist;
};

module.exports = {
  createPlaylistService,
  getPlaylistByIdService,
  getAllPlaylistOfUserService,
  updatePlaylistService,
  deletePlaylistService,
};
