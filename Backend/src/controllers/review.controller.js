const {
  getReviewByIdService,
  createReviewService,
  getReviewsByVideoIdService,
  getNumberOfReviewsByVideoIdService,
} = require("../services/review.service");

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getReviewByIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { video_id, review_rating, user_id } = req.body;

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
    const data = await getReviewsByVideoIdService(videoId);
    res.status(200).json(data);
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
    return res.status(200).json({ totalReviews });
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
