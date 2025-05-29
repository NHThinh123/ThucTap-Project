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
  console.log("🔍 Searching for playlist ID:", playlist_id);

  // Tạm thời bỏ populate để test
  const playlist = await Playlist.findById(playlist_id);

  console.log("📋 Found playlist:", playlist);

  if (!playlist) {
    console.log("❌ Playlist not found in database");
    throw new AppError("Playlist not found", 404);
  }

  console.log("✅ Playlist found successfully");

  // Check authorization
  if (
    !playlist.isPublic &&
    user_id &&
    playlist.user_id.toString() !== user_id.toString()
  ) {
    console.log("🚫 Authorization failed");
    throw new AppError("You are not authorized to view this playlist", 403);
  }

  console.log("✅ Authorization passed");

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
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }
  if (playlist.user_id.toString() !== user_id.toString()) {
    throw new AppError("You are not authorized to delete this playlist", 403);
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
