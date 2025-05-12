const {
  createHistoryService,
  getHistoryByIdService,
  getAllHistoriesOfUserService,
  updateWatchDurationService,
  deleteHistoryService,
  deleteAllHistoriesService,
} = require("../services/history.service");

const createHistory = async (req, res, next) => {
  try {
    const history = await createHistoryService(req.body);
    res.status(201).json({
      status: "success",
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await getHistoryByIdService(req.params.id);
    res.status(200).json({
      status: "success",
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

const getAllHistories = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const histories = await getAllHistoriesOfUserService(user_id);
    res.status(200).json({
      status: "success",
      results: histories.length,
      data: { histories },
    });
  } catch (error) {
    next(error);
  }
};

const updateWatchDuration = async (req, res, next) => {
  try {
    const { watch_duration } = req.body;
    const history = await updateWatchDurationService(
      req.params.id,
      watch_duration
    );
    res.status(200).json({
      status: "success",
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    await deleteHistoryService(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAllHistories = async (req, res, next) => {
  try {
    await deleteAllHistoriesService(req.body.user_id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHistory,
  getHistory,
  getAllHistories,
  deleteHistory,
  deleteAllHistories,
  updateWatchDuration,
};
