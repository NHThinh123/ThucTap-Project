const express = require("express");
const router = express.Router();
const {
  createOrUpdateReview,
  getUserReviewForVideo,
  getReview,
  getAllReviewsOfVideo,
  getAllReviewsOfUser,
  countReviewVideo,
  deleteReview,
  deleteAllReviews,
  getVideoAverageRating,
} = require("../controllers/review.controller");

// Route chính: tạo/cập nhật đánh giá và xóa tất cả đánh giá
router
  .route("/")
  .post(createOrUpdateReview) // Tạo hoặc cập nhật đánh giá
  .delete(deleteAllReviews); // Xóa tất cả đánh giá của video (video_id trong body)

// Route theo ID đánh giá: lấy và xóa đánh giá cụ thể
router
  .route("/:id")
  .get(getReview) // Lấy đánh giá theo ID
  .delete(deleteReview); // Xóa đánh giá theo ID

// Route cho video: lấy tất cả đánh giá và thống kê của video
router.route("/video/:video_id").get(getAllReviewsOfVideo); // Lấy tất cả đánh giá của video

// Route đếm số lượng đánh giá của video
router.route("/video/:video_id/count").get(countReviewVideo); // Đếm số đánh giá của video

// Route lấy điểm trung bình của video
router.route("/video/:video_id/average").get(getVideoAverageRating); // Lấy điểm trung bình của video

// Route cho user: lấy tất cả đánh giá của user
router.route("/user/:user_id").get(getAllReviewsOfUser); // Lấy tất cả đánh giá của user

// Route kiểm tra đánh giá của user cho video cụ thể
router.route("/user/:user_id/video/:video_id").get(getUserReviewForVideo); // Kiểm tra user đã đánh giá video chưa

module.exports = router;
