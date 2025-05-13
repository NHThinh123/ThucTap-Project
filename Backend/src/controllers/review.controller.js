const {
  createReviewService,
  getReviewByIdService,
  getAllReviewsOfVideoService,
  getAllReviewsOfUserService,
  deleteReviewService,
  deleteAllReviewsService,
} = require("../services/review.service");

const createReview = async (req, res, next) => {
  try {
    const review = await createReviewService(req.body);
    res.status(201).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

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

module.exports = {
  createReview,
  getReview,
  getAllReviewsOfVideo,
  getAllReviewsOfUser,
  deleteReview,
  deleteAllReviews,
};
