const {
  createPlaylistService,
  getPlaylistByIdService,
  getUserPlaylistsService,
  updatePlaylistService,
  deletePlaylistService,
  addVideoToPlaylistService,
  removeVideoFromPlaylistService,
  restorePlaylistService,
} = require("../services/playlist.service");

const createPlaylist = async (req, res, next) => {
  try {
    const playlist = await createPlaylistService(req.body, req.user._id);
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

const getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await getUserPlaylistsService(req.user._id);
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
    const playlist = await updatePlaylistService(
      req.params.id,
      req.user._id,
      req.body
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
    await deletePlaylistService(req.params.id, req.user._id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const addVideoToPlaylist = async (req, res, next) => {
  try {
    const playlist = await addVideoToPlaylistService(
      req.params.id,
      req.user._id,
      req.body.videoId
    );
    res.status(200).json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
};

const removeVideoFromPlaylist = async (req, res, next) => {
  try {
    const playlist = await removeVideoFromPlaylistService(
      req.params.id,
      req.user._id,
      req.body.videoId
    );
    res.status(200).json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
};

const restorePlaylist = async (req, res, next) => {
  try {
    const playlist = await restorePlaylistService(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      data: { playlist },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlaylist,
  getPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  restorePlaylist,
};
