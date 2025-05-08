const { createVideoService } = require("../services/video.service");

const createVideo = async (req, res, next) => {
  try {
    const { url, title, description, thumbnail, duration, user_id } = req.body;

    // Kiểm tra user_id
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required field: user_id" });
    }

    const videoData = {
      url,
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

module.exports = {
  createVideo,
};
