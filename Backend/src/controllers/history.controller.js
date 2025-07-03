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

function fixVideoUrl(video, req) {
  if (!video) return video;
  const protocol = req.protocol;
  const host = req.headers.host;
  if (video.video_url && video.video_url.includes('localhost')) {
    video.video_url = video.video_url.replace(
      /http:\/\/localhost:\d+/,
      `${protocol}://${host}`
    );
  }
  if (video.thumbnail_video && video.thumbnail_video.includes('localhost')) {
    video.thumbnail_video = video.thumbnail_video.replace(
      /http:\/\/localhost:\d+/,
      `${protocol}://${host}`
    );
  }
  return video;
}

const getAllHistories = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") {
      // Không có user id, trả về mảng rỗng
      return res.status(200).json({
        status: "success",
        results: 0,
        data: { histories: [] },
      });
    }
    const histories = await getAllHistoriesOfUserService(id);
    // Duyệt qua từng ngày, từng video trong histories để fix URL
    const fixedHistories = histories.map(group => ({
      ...group,
      videos: group.videos.map(item => {
        if (item.video_id && typeof item.video_id === 'object') {
          item.video_id = fixVideoUrl(item.video_id, req);
        }
        return item;
      })
    }));
    res.status(200).json({
      status: "success",
      results: fixedHistories.length,
      data: { histories: fixedHistories },
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
