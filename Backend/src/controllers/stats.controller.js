const statsService = require("../services/stats.service");
const AppError = require("../utils/AppError");

const getVideoStats = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { period, startDate, endDate } = req.body;

    // Kiểm tra các tham số bắt buộc
    if (!period || !startDate || !endDate) {
      throw new AppError(
        "Missing required query parameters: period, startDate, endDate",
        400
      );
    }

    // Gọi service để lấy thống kê
    const result = await statsService.getVideoStatsService(
      videoId,
      period,
      startDate,
      endDate
    );

    // Trả về phản hồi
    res.status(200).json(result);
  } catch (error) {
    next(error); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { period, startDate, endDate } = req.query;

    if (!period || !startDate || !endDate) {
      throw new AppError(
        "Missing required query parameters: period, startDate, endDate",
        400
      );
    }

    const result = await statsService.getUserStatsService(
      userId,
      period,
      startDate,
      endDate
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const getChannelOverview = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await statsService.getChannelOverviewService(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getNewestVideoAnalysis = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await statsService.getNewestVideoAnalysisService(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideoStats,
  getUserStats,
  getChannelOverview,
  getNewestVideoAnalysis,
};
