const express = require("express");
const {
  likeVideo,
  unlikeVideo,
  getUserLikedVideos,
  getVideoLikes,
} = require("../controllers/user_like_video.controller");

const router = express.Router();

//Public routes
router.put("/like", likeVideo);
router.put("/unlike", unlikeVideo);
router.get("/user/:video_id", getUserLikedVideos);
router.get("/video/:user_id", getVideoLikes);

module.exports = router;
