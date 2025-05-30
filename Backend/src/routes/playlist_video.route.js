const express = require("express");
const router = express.Router();
const {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getVideoInPlaylist,
} = require("../controllers/playlist_video.controller");

router.route("/").post(addVideoToPlaylist).delete(removeVideoFromPlaylist);

router.get("/:playlist_id", getVideoInPlaylist);

module.exports = router;
