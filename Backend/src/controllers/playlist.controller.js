const {
  createPlaylistService,
  getPlaylistByIdService,
  getAllPlaylistOfUserService,
  updatePlaylistService,
  deletePlaylistService,
} = require("../services/playlist.service");

const createPlaylist = async (req, res, next) => {
  try {
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
    const playlist = await getPlaylistByIdService(req.params.id);
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
    const { user_id } = req.body;
    const playlists = await getAllPlaylistOfUserService(user_id);
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
    const playlist = await updatePlaylistService(req.params.id, req.body);
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
    await deletePlaylistService(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
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
