const {
  createOrUpdateReviewService,
  getUserReviewForVideoService,
  getReviewByIdService,
  getAllReviewsOfVideoService,
  getAllReviewsOfUserService,
  countReviewVideoService,
  deleteReviewService,
  deleteAllReviewsService,
  getVideoAverageRatingService,
} = require("../services/review.service");

// Tạo hoặc cập nhật đánh giá
const createOrUpdateReview = async (req, res, next) => {
  try {
    const result = await createOrUpdateReviewService(req.body);
    res.status(201).json({
      status: "success",
      message: result.message,
      data: {
        review: result.review,
        isNew: result.isNew,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy đánh giá của user cho video cụ thể
const getUserReviewForVideo = async (req, res, next) => {
  try {
    const { user_id, video_id } = req.params;
    const result = await getUserReviewForVideoService(user_id, video_id);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy đánh giá theo ID
const getReview = async (req, res, next) => {
  try {
    const review = await getReviewByIdService(req.params.id);
    res.status(200).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả đánh giá của một video
const getAllReviewsOfVideo = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const reviews = await getAllReviewsOfVideoService(video_id);
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả đánh giá của một user
const getAllReviewsOfUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const reviews = await getAllReviewsOfUserService(user_id);
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

// Đếm số lượng đánh giá của video
const countReviewVideo = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const count = await countReviewVideoService(video_id);
    res.status(200).json({
      status: "success",
      data: {
        video_id,
        total_reviews: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Xóa một đánh giá
const deleteReview = async (req, res, next) => {
  try {
    await deleteReviewService(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tất cả đánh giá của một video
const deleteAllReviews = async (req, res, next) => {
  try {
    const { video_id } = req.body;
    await deleteAllReviewsService(video_id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy điểm đánh giá trung bình của video
const getVideoAverageRating = async (req, res, next) => {
  try {
    const { video_id } = req.params;
    const result = await getVideoAverageRatingService(video_id);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateReview,
  getUserReviewForVideo,
  getReview,
  getAllReviewsOfVideo,
  getAllReviewsOfUser,
  countReviewVideo,
  deleteReview,
  deleteAllReviews,
  getVideoAverageRating,
};
