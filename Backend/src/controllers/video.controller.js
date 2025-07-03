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

// Hàm tiện ích chỉ thay thế localhost trong video_url và thumbnail_video
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
    if (result?.data?.videos) {
      result.data.videos = result.data.videos.map(video => fixVideoUrl(video, req));
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getVideoByIdService(id);
    if (result?.video) {
      result.video = fixVideoUrl(result.video, req);
    }
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
    if (result?.data?.videos) {
      result.data.videos = result.data.videos.map(video => fixVideoUrl(video, req));
    }
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
    if (Array.isArray(result)) {
      res.status(200).json(result.map(video => fixVideoUrl(video, req)));
    } else if (result?.data?.videos) {
      result.data.videos = result.data.videos.map(video => fixVideoUrl(video, req));
      res.status(200).json(result);
    } else {
      res.status(200).json(result);
    }
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
