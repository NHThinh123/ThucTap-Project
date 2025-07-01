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
  updateAdminVideo,
  deleteAdminVideo,
} = require("../controllers/video.controller");
const {
  getRecommendations,
} = require("../controllers/recommendation.controller");
const { protect, adminOnly } = require("../middlewares/admin");

// Các route cụ thể được đặt trước
router.get("/recommend", getRecommendations);
router.get("/recommend/:user_id", getRecommendations);
router.get("/search", searchVideos);
router.get("/suggestions", getSearchSuggestions);
router.get("/admin/getAllVideo", protect, adminOnly, getVideos);
router.get("/user/:userId", getVideosByUserId);
router.get("/user/:userId/count", countVideoOfUserId);

// Các route động được đặt sau
router.get("/:id", getVideoById);
router.post("/create", createVideo);
router.put("/:id", updateVideo);
router.put("/increment-view/:id", incrementView);
router.delete("/:id", deleteVideo);
router.put("/admin/updateVideo/:id", protect, adminOnly, updateAdminVideo);
router.delete("/admin/deleteVideo/:id", protect, adminOnly, deleteAdminVideo);

module.exports = router;
