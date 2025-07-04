const History = require("../models/history.model");
const User = require("../models/user.model");
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
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }
  const histories = await History.find({ user_id: userId })
    .sort({
      updatedAt: -1,
    })
    .populate({
      path: "video_id",
      select: "title thumbnail_video duration views createdAt user_id",
      populate: {
        path: "user_id",
        select: "nickname avatar",
      },
    });

  // Lấy danh sách các ngày duy nhất (bỏ trùng) từ updatedAt
  const uniqueDates = [
    ...new Set(
      histories.map(
        (history) => new Date(history.updatedAt).toISOString().split("T")[0]
      )
    ),
  ];

  // Nhóm các video theo ngày
  const result = uniqueDates.map((date) => ({
    date,
    videos: histories
      .filter(
        (history) =>
          new Date(history.updatedAt).toISOString().split("T")[0] === date
      )
      .map((history) => ({
        _id: history._id,
        video_id: history.video_id,
        watch_duration: history.watch_duration,
        updatedAt: history.updatedAt,
      })),
  }));

  return result;
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
  const history = await History.findByIdAndDelete(historyId);
  if (!history) {
    throw new AppError("History record not found", 404);
  }
  return history;
};

const deleteAllHistoriesService = async (userId) => {
  const result = await History.deleteMany({ user_id: userId });
  return result;
};

const togglePauseHistoryService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Nếu isPauseHistory chưa tồn tại, thêm với giá trị true
  // Nếu đã tồn tại, đảo ngược trạng thái
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isPauseHistory: !user.isPauseHistory || true,
      },
    },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

module.exports = {
  createHistoryService,
  getHistoryByIdService,
  getAllHistoriesOfUserService,
  updateWatchDurationService,
  deleteHistoryService,
  deleteAllHistoriesService,
  togglePauseHistoryService,
};
