const {
  getReviewByIdService,
  createReviewService,
  getReviewsByVideoIdService,
  getNumberOfReviewsByVideoIdService,
} = require("../services/review.service");

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await getReviewByIdService(id);
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { video_id, review_rating, user_id } = req.body;

    // Validate required fields
    if (!video_id || !review_rating || !user_id) {
      return res.status(400).json({
        message: "video_id, review_rating, and user_id are required",
      });
    }

    const newReview = await createReviewService(
      video_id,
      review_rating,
      user_id
    );
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

const getReviewsByVideoId = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const reviews = await getReviewsByVideoIdService(videoId);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const getNumberOfReviewsByVideoId = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const totalReviews = await getNumberOfReviewsByVideoIdService(videoId);
    res.status(200).json({ totalReviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviewById,
  createReview,
  getReviewsByVideoId,
  getNumberOfReviewsByVideoId,
};
