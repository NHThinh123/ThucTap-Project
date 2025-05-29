const Review = require("../models/review.model");
const VideoStats = require("../models/video_stats.model");
const User = require("../models/user.model"); // Thêm model User
const AppError = require("../utils/AppError");
const mongoose = require("mongoose"); // Thêm mongoose import

const createOrUpdateReviewService = async (data) => {
  const { user_id, video_id, review_rating } = data;

  // Kiểm tra validation
  if (!user_id || !video_id || !review_rating) {
    throw new AppError("Thiếu thông tin bắt buộc", 400);
  }

  if (review_rating < 1 || review_rating > 5) {
    throw new AppError("Điểm đánh giá phải từ 1 đến 5 sao", 400);
  }

  // Kiểm tra xem đã tồn tại đánh giá chưa
  const existingReview = await Review.findOne({ user_id, video_id });

  let review;
  let isNew = false;

  if (existingReview) {
    // Cập nhật đánh giá hiện tại
    existingReview.review_rating = review_rating;
    existingReview.updatedAt = new Date();
    review = await existingReview.save();
  } else {
    // Tạo đánh giá mới
    review = await Review.create({ user_id, video_id, review_rating });
    isNew = true;
  }

  // Lấy thông tin user
  const user = await User.findById(user_id).select(
    "username email avatar nickname"
  );

  //Thống kê số lượng review cho video và tính điểm trung bình
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

  return {
    review: {
      ...review.toObject(),
      user: user,
    },
    isNew,
    message: isNew
      ? "Đánh giá đã được tạo thành công"
      : "Đánh giá đã được cập nhật thành công",
  };
};

const getUserReviewForVideoService = async (user_id, video_id) => {
  if (!user_id || !video_id) {
    throw new AppError("Thiếu user_id hoặc video_id", 400);
  }

  const review = await Review.findOne({ user_id, video_id });
  let user = null;

  if (review) {
    user = await User.findById(user_id).select(
      "username email avatar nickname"
    );
  }

  return {
    hasReviewed: !!review,
    rating: review ? review.review_rating : null,
    review: review
      ? {
          ...review.toObject(),
          user: user,
        }
      : null,
  };
};

const getReviewByIdService = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Lấy thông tin user
  const user = await User.findById(review.user_id).select(
    "username email avatar nickname"
  );

  return {
    ...review.toObject(),
    user: user,
  };
};

const getAllReviewsOfVideoService = async (videoId) => {
  const reviews = await Review.find({ video_id: videoId });

  // Lấy thông tin user cho tất cả reviews
  const reviewsWithUser = await Promise.all(
    reviews.map(async (review) => {
      const user = await User.findById(review.user_id).select(
        "username email avatar nickname"
      );
      return {
        ...review.toObject(),
        user: user,
      };
    })
  );

  return reviewsWithUser;
};

const getAllReviewsOfUserService = async (userId) => {
  const reviews = await Review.find({ user_id: userId });

  // Lấy thông tin user
  const user = await User.findById(userId).select(
    "username email avatar nickname"
  );

  const reviewsWithUser = reviews.map((review) => ({
    ...review.toObject(),
    user: user,
  }));

  return reviewsWithUser;
};

const countReviewVideoService = async (video_id) => {
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("Invalid video ID", 400);
  }
  let result = await Review.countDocuments({ video_id });
  return result;
};

const deleteReviewService = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Lấy thông tin user trước khi xóa
  const user = await User.findById(review.user_id).select(
    "username email avatar nickname"
  );

  await review.deleteOne();

  return {
    ...review.toObject(),
    user: user,
  };
};

const deleteAllReviewsService = async (videoId) => {
  // Lấy tất cả reviews trước khi xóa để trả về thông tin
  const reviews = await Review.find({ video_id: videoId });

  // Lấy thông tin user cho tất cả reviews
  const reviewsWithUser = await Promise.all(
    reviews.map(async (review) => {
      const user = await User.findById(review.user_id).select(
        "username email avatar nickname"
      );
      return {
        ...review.toObject(),
        user: user,
      };
    })
  );

  // Xóa tất cả reviews
  const deleteResult = await Review.deleteMany({ video_id: videoId });

  return {
    deletedCount: deleteResult.deletedCount,
    deletedReviews: reviewsWithUser,
  };
};

const getVideoAverageRatingService = async (video_id) => {
  if (!mongoose.Types.ObjectId.isValid(video_id)) {
    throw new AppError("ID video không hợp lệ", 400);
  }

  const reviews = await Review.find({ video_id });
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      video_id,
      total_reviews: 0,
      average_rating: 0,
    };
  }

  const average_rating =
    reviews.reduce((sum, r) => sum + r.review_rating, 0) / totalReviews;

  return {
    video_id,
    total_reviews: totalReviews,
    average_rating: Math.round(average_rating * 10) / 10, // Làm tròn 1 chữ số thập phân
  };
};

module.exports = {
  createOrUpdateReviewService,
  getUserReviewForVideoService,
  getReviewByIdService,
  getAllReviewsOfVideoService,
  getAllReviewsOfUserService,
  countReviewVideoService,
  deleteReviewService,
  deleteAllReviewsService,
  getVideoAverageRatingService,
};
