const {
  createVideoService,
  getVideosService,
  getVideoByIdService,
  updateVideoService,
  deleteVideoService,
  incrementViewService,
  searchVideosService,
  getSearchSuggestionsService,
  getVideosByUserIdService,
  countVideoOfUserIdService,
  updateVideoAdminService,
  deleteVideoAdminService,
} = require("../services/video.service");

const createVideo = async (req, res, next) => {
  try {
    const { video_url, title, description, thumbnail, duration, user_id } =
      req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required field: user_id" });
    }

    const videoData = {
      video_url,
      title,
      description,
      thumbnail,
      duration,
    };

    const result = await createVideoService(videoData, user_id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getVideos = async (req, res, next) => {
  try {
    const result = await getVideosService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getVideoByIdService(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail } = req.body;
    const user_id = req.body.user_id; // Giả sử user_id được gửi từ client

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required field: user_id" });
    }

    const videoData = {
      title,
      description,
      thumbnail,
    };

    const result = await updateVideoService(id, videoData, user_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const incrementView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await incrementViewService(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.body.user_id; // Giả sử user_id được gửi từ client

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required field: user_id" });
    }

    const result = await deleteVideoService(id, user_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const searchVideos = async (req, res) => {
  try {
    const result = await searchVideosService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSearchSuggestions = async (req, res) => {
  try {
    const result = await getSearchSuggestionsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách video theo userId
const getVideosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getVideosByUserIdService(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Đếm số lượng video của userId
const countVideoOfUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await countVideoOfUserIdService(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateAdminVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail } = req.body;
    //const user_id = req.body.user_id;

    const videoData = {
      title,
      description,
      thumbnail,
    };

    const result = await updateVideoAdminService(id, videoData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteAdminVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteVideoAdminService(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  incrementView,
  deleteVideo,
  searchVideos,
  getSearchSuggestions,
  getVideosByUserId,
  countVideoOfUserId,
  updateAdminVideo,
  deleteAdminVideo,
};
