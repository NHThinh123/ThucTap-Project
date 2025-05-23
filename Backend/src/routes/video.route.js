const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  incrementView,
} = require("../controllers/video.controller");
const {
  getRecommendations,
} = require("../controllers/recommendation.controller");

router.post("/create", createVideo);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.put("/increment-view/:id", incrementView);
router.delete("/:id", deleteVideo);
router.get("/recommend/:user_id", getRecommendations);

module.exports = router;
