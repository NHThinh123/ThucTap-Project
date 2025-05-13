const express = require("express");
const router = express.Router();
const {
  createReview,
  getReview,
  getAllReviewsOfVideo,
  getAllReviewsOfUser,
  deleteReview,
  deleteAllReviews,
} = require("../controllers/review.controller");

router.route("/").post(createReview).delete(deleteAllReviews);

router.route("/:id").get(getReview).delete(deleteReview);

router.route("/video/:video_id").get(getAllReviewsOfVideo);

router.route("/user/:user_id").get(getAllReviewsOfUser);

module.exports = router;
