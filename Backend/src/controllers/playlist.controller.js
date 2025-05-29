const {
  createPlaylistService,
  getPlaylistByIdService,
  getAllPlaylistOfUserService,
  updatePlaylistService,
  deletePlaylistService,
} = require("../services/playlist.service");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`${fieldName} is invalid`, 400);
  }
};

const createPlaylist = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    validateObjectId(user_id, "User ID");
    const playlist = await createPlaylistService(req.body);
    res.status(201).json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
};

const getPlaylist = async (req, res, next) => {
  try {
    validateObjectId(req.params.id, "Playlist ID");
    const playlist = await getPlaylistByIdService(req.params.id, req.user?._id);
    res.status(200).json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
};

const getAllPlaylistOfUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    validateObjectId(userId, "User ID");
    const playlists = await getAllPlaylistOfUserService(userId, page, limit);
    res.status(200).json({
      status: "success",
      results: playlists.length,
      data: { playlists },
    });
  } catch (error) {
    next(error);
  }
};

const updatePlaylist = async (req, res, next) => {
  try {
    validateObjectId(req.params.id, "Playlist ID");
    const playlist = await updatePlaylistService(
      req.params.id,
      req.body,
      req.user?._id
    );
    res.status(200).json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
};

const deletePlaylist = async (req, res, next) => {
  try {
    validateObjectId(req.params.id, "Playlist ID");
    await deletePlaylistService(req.params.id, req.user?._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlaylist,
  getPlaylist,
  getAllPlaylistOfUser,
  updatePlaylist,
  deletePlaylist,
};
