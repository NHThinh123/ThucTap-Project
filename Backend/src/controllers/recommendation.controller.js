const {
  getRecommendationsService,
} = require("../services/recommendation.service");

const getRecommendations = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await getRecommendationsService(user_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
