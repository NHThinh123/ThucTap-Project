const {
  createHistoryService,
  getHistoryByIdService,
  getAllHistoriesOfUserService,
  updateWatchDurationService,
  deleteHistoryService,
  deleteAllHistoriesService,
  togglePauseHistoryService,
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
    const { id } = req.params;
    const histories = await getAllHistoriesOfUserService(id);
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
    const { id } = req.params;
    await deleteAllHistoriesService(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const togglePauseHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await togglePauseHistoryService(id);
    res.status(200).json({
      status: "success",
      data: { isPauseHistory: user.isPauseHistory },
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
  togglePauseHistory,
};
