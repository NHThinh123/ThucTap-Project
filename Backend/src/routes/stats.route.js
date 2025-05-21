const express = require("express");
const {
  getVideoStats,
  getUserStats,
} = require("../controllers/stats.controller");
const router = express.Router();

// Route để lấy thống kê video
router.get("/video/:videoId", getVideoStats);
// Route để lấy thống kê người dùng
router.get("/user/:userId", getUserStats);

module.exports = router;
