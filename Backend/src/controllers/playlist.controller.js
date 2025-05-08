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
    const { user_id } = req.body;
    const playlist = await createPlaylistService(req.body, user_id);
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
    const { user_id } = req.body;
    const playlists = await getUserPlaylistsService(user_id);
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
    const { user_id } = req.body;
    const playlist = await updatePlaylistService(
      req.params.id,
      user_id,
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
    const { user_id } = req.body;
    await deletePlaylistService(req.params.id, user_id);
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
    const { user_id } = req.body;
    const playlist = await addVideoToPlaylistService(
      req.params.id,
      user_id,
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
    const { user_id } = req.body;
    const playlist = await removeVideoFromPlaylistService(
      req.params.id,
      user_id,
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
    const { user_id } = req.body;
    const playlist = await restorePlaylistService(req.params.id, user_id);
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
