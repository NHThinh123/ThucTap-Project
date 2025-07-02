const {
  getRecommendationsService,
} = require("../services/recommendation.service");

const getRecommendations = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    console.log(
      `Lấy đề xuất cho user_id: ${user_id || "người dùng đăng xuất"}`
    );
    const result = await getRecommendationsService(user_id || null);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
