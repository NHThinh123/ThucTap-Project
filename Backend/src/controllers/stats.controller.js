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

module.exports = {
  getVideoStats,
};
