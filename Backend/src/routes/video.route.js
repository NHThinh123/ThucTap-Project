const express = require("express");
const router = express.Router();
const { createVideo } = require("../controllers/video.controller"); // Tùy chọn

// Giả sử có middleware xác thực (nếu cần)
router.post("/", createVideo);

module.exports = router;
