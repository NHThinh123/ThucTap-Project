const express = require("express");
const router = express.Router();
const {
  getReviewById,
  createReview,
  getReviewsByVideoId,
  getNumberOfReviewsByVideoId,
} = require("../controllers/review.controller");

router.route("/").post(createReview);

router.route("/:id").get(getReviewById);

router.route("/video/:videoId").get(getReviewsByVideoId);

router.route("/video/:videoId/count").get(getNumberOfReviewsByVideoId);

module.exports = router;
