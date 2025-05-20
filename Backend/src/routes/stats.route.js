const express = require("express");
const { getVideoStats } = require("../controllers/stats.controller");
const router = express.Router();

// Route để lấy thống kê video
router.get("/video/:videoId", getVideoStats);

module.exports = router;
