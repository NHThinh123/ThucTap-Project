const Review = require("../models/review.model");

// const getListReviewService = async (page = 1, limit = 10, search = "") => {
//   const skip = (page - 1) * limit;
//   const query = search
//     ? { review_contents: { $regex: search, $options: "i" } }
//     : {};

//   const reviews = await Review.find(query)
//     .populate("user_id", "user_name email") // Lấy thông tin user liên quan
//     .populate("business_id", "business_name") // Lấy thông tin business liên quan
//     .skip(skip)
//     .limit(limit);
//   const total = await Review.countDocuments(query);

//   return {
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit),
//     data: reviews,
//   };
// };

const getReviewByIdService = async (id) => {
  return await Review.findById(id)
    .populate("user_id", "user_name email")
    .populate("video_id", "title_video");
};

const createReviewService = async (video_id, review_rating, user_id) => {
  let result = await Review.create({
    video_id: video_id,
    review_rating: review_rating || null,
    user_id: user_id || null,
  });

  return result;
};

const getReviewsByVideoIdService = async (videoId) => {
  try {
    const reviews = await Review.find({ video_id: videoId })
      .populate("user_id", "avatar name")
      .populate("business_id_review", "business_name avatar");
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getNumberOfReviewsByVideoIdService = async (videoId) => {
  try {
    const totalReviews = await Review.countDocuments({
      video_id: videoId,
    });
    return totalReviews;
  } catch (error) {
    throw new Error(error.mesage);
  }
};

module.exports = {
  getListReviewService,
  getReviewByIdService,
  createReviewService,
  getNumberOfReviewsByBusinessIdService,
  deleteReviewService,
  getReviewsByBusinessIdService,
  getReviewResponseByParentReviewIdService,
};
