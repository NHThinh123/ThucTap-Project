const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../controllers/video.controller");

// Giả sử có middleware xác thực (nếu cần)
router.post("/", createVideo); // Tạo video
router.get("/", getVideos); // Lấy danh sách video
router.get("/:id", getVideoById); // Lấy chi tiết video
router.put("/:id", updateVideo); // Cập nhật video
router.delete("/:id", deleteVideo); // Xóa video

module.exports = router;
