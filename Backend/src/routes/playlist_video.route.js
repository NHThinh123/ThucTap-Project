const express = require("express");
const router = express.Router();
const {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} = require("../controllers/playlist_video.controller");

router.route("/").post(addVideoToPlaylist).delete(removeVideoFromPlaylist);

module.exports = router;
