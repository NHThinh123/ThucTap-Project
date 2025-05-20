const Review = require("../models/review.model");
const VideoStats = require("../models/video_stats.model");
const AppError = require("../utils/AppError");

const createReviewService = async (data) => {
  const { user_id, video_id, review_rating } = data;

  // Kiểm tra xem đã tồn tại bản ghi với user_id và video_id chưa
  const existingReview = await Review.findOne({ user_id, video_id });
  if (existingReview) {
    throw new AppError("This user already reviewed this video", 400);
  }

  const review = await Review.create({ user_id, video_id, review_rating });

  //Thống kê số lượng review cho video và tính điểm trung bình
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviews = await Review.find({ video_id });
  const average_rating =
    reviews.reduce((sum, r) => sum + r.review_rating, 0) / reviews.length;

  await VideoStats.findOneAndUpdate(
    { video_id, date: today },
    { $inc: { reviews: 1 }, $set: { average_rating } },
    { upsert: true }
  );
  //

  return review;
};

const getReviewByIdService = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  return review;
};

const getAllReviewsOfVideoService = async (videoId) => {
  return Review.find({ video_id: videoId });
};

const getAllReviewsOfUserService = async (userId) => {
  return Review.find({ user_id: userId });
};

const deleteReviewService = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  await review.deleteOne();
  return review;
};

const deleteAllReviewsService = async (videoId) => {
  const reviews = await Review.deleteMany({ video_id: videoId });
  return reviews;
};

module.exports = {
  createReviewService,
  getReviewByIdService,
  getAllReviewsOfVideoService,
  getAllReviewsOfUserService,
  deleteReviewService,
  deleteAllReviewsService,
};
