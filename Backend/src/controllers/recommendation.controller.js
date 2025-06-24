// recommendation.controller.js
const {
  getRecommendationsService,
} = require("../services/recommendation.service");

const getRecommendations = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const result = await getRecommendationsService(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
