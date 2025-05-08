const express = require("express");
const router = express.Router();
const {
  getReviewById,
  createReview,
  getReviewsByVideoId,
  getNumberOfReviewsByVideoId,
} = require("../controllers/review.controller");

// Create a new review
router.post("/", createReview);

// Get review by ID
router.get("/:id", getReviewById);

// Get all reviews for a specific video
router.get("/video/:videoId", getReviewsByVideoId);

// Get total number of reviews for a specific video
router.get("/video/:videoId/count", getNumberOfReviewsByVideoId);

module.exports = router;
