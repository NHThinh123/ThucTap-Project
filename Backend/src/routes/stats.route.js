const express = require("express");
const {
  getVideoStats,
  getUserStats,
  getChannelOverview,
  getNewestVideoAnalysis,
} = require("../controllers/stats.controller");
const router = express.Router();

// Route để lấy thống kê video
router.get("/video/:videoId", getVideoStats);
// Route để lấy thống kê người dùng
router.get("/user/:userId", getUserStats);
// Route để lấy tổng quan kênh
router.get("/overview/:userId", getChannelOverview);

router.get("/newest/:userId", getNewestVideoAnalysis);

module.exports = router;
