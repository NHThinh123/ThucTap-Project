const History = require("../models/history.model");
const AppError = require("../utils/AppError");

const createHistoryService = async (data) => {
  const { user_id, video_id, watch_duration } = data;

  // Kiểm tra xem đã tồn tại bản ghi với user_id và video_id chưa
  const existingHistory = await History.findOne({ user_id, video_id });
  if (existingHistory) {
    throw new AppError("This video already exists in the user's history", 400);
  }

  const history = await History.create({
    user_id,
    video_id,
    watch_duration,
  });
  return history;
};

const getHistoryByIdService = async (historyId) => {
  const history = await History.findById(historyId);
  if (!history) {
    throw new AppError("History record not found", 404);
  }
  return history;
};

const getAllHistoriesOfUserService = async (userId) => {
  return History.find({ user_id: userId });
};

const updateWatchDurationService = async (id, watch_duration) => {
  const history = await History.findByIdAndUpdate(
    id,
    { watch_duration },
    { new: true, runValidators: true }
  );
  if (!history) {
    throw new AppError("History not found", 404);
  }
  return history;
};

const deleteHistoryService = async (historyId) => {
  const history = await History.findOne({ _id: historyId });
  if (!history) {
    throw new AppError("History record not found", 404);
  }
  await history.delete();
  return history;
};

const deleteAllHistoriesService = async (userId) => {
  const result = await History.deleteMany({ user_id: userId });
  return result;
};

module.exports = {
  createHistoryService,
  getHistoryByIdService,
  getAllHistoriesOfUserService,
  updateWatchDurationService,
  deleteHistoryService,
  deleteAllHistoriesService,
};
