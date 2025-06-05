const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  incrementView,
  searchVideos,
  getSearchSuggestions,
  getVideosByUserId,
  countVideoOfUserId,
} = require("../controllers/video.controller");
const {
  getRecommendations,
} = require("../controllers/recommendation.controller");

router.post("/create", createVideo);
router.get("/search", searchVideos);
router.get("/suggestions", getSearchSuggestions);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.put("/increment-view/:id", incrementView);
router.delete("/:id", deleteVideo);
router.get("/recommend/:user_id", getRecommendations);
router.get("/user/:userId", getVideosByUserId);
router.get("/user/:userId/count", countVideoOfUserId);

module.exports = router;
