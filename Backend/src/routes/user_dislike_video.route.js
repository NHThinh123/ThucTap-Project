const express = require("express");
const {
  dislikeVideo,
  undislikeVideo,
  getUserDislikedVideos,
  getVideoDislikes,
  countDislikeVideo,
  getUserDislikeStatus,
} = require("../controllers/user_dislike_video.controller");

const router = express.Router();

//Public routes
router.put("/dislike", dislikeVideo);
router.put("/undislike", undislikeVideo);
router.get("/user/:video_id", getUserDislikedVideos);
router.get("/video/:user_id", getVideoDislikes);
router.get("/count/:video_id", countDislikeVideo);
router.post("/status", getUserDislikeStatus);

module.exports = router;
