const {
  getRecommendationsService,
} = require("../services/recommendation.service");

const getRecommendations = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    console.log(`Fetching recommendations for user_id: ${user_id}`);
    const result = await getRecommendationsService(user_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
