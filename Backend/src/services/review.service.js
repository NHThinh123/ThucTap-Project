const Review = require("../models/review.model");

const getReviewByIdService = async (id) => {
  try {
    const review = await Review.findById(id)
      .populate("user_id", "user_name email")
      .populate("video_id", "title_video");

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  } catch (error) {
    throw new Error(`Error getting review: ${error.message}`);
  }
};

const createReviewService = async (video_id, review_rating, user_id) => {
  try {
    // Validate rating
    if (review_rating < 1 || review_rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const review = await Review.create({
      video_id,
      review_rating,
      user_id,
    });

    return review;
  } catch (error) {
    throw new Error(`Error creating review: ${error.message}`);
  }
};

const getReviewsByVideoIdService = async (videoId) => {
  try {
    const reviews = await Review.find({ video_id: videoId })
      .populate("user_id", "user_name email")
      .populate("video_id", "title_video");

    return reviews;
  } catch (error) {
    throw new Error(`Error getting reviews: ${error.message}`);
  }
};

const getNumberOfReviewsByVideoIdService = async (videoId) => {
  try {
    const totalReviews = await Review.countDocuments({ video_id: videoId });
    return totalReviews;
  } catch (error) {
    throw new Error(`Error counting reviews: ${error.message}`);
  }
};

module.exports = {
  getReviewByIdService,
  createReviewService,
  getReviewsByVideoIdService,
  getNumberOfReviewsByVideoIdService,
};
