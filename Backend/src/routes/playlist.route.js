const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  getPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  restorePlaylist,
} = require("../controllers/playlist.controller");

router.route("/").post(createPlaylist).get(getUserPlaylists);

router
  .route("/:id")
  .get(getPlaylist)
  .patch(updatePlaylist)
  .delete(deletePlaylist)
  .post(restorePlaylist);

router
  .route("/:id/videos")
  .post(addVideoToPlaylist)
  .delete(removeVideoFromPlaylist);

module.exports = router;
