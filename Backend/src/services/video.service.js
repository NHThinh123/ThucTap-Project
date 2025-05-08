const Video = require("../models/video.model");

const createVideoService = async (videoData, userId) => {
  try {
    // Kiểm tra dữ liệu bắt buộc
    if (!videoData.url || !videoData.title || !userId) {
      throw new Error("Missing required fields: url, title, or user_id");
    }

    // Tạo bản ghi video
    const videoRecord = new Video({
      user_id: userId,
      title: videoData.title,
      description_video: videoData.description || null,
      url_video: videoData.url,
      thumbnail_video: videoData.thumbnail || "",
      duration: videoData.duration || 0,
      views: 0,
    });

    // Lưu vào MongoDB
    await videoRecord.save();

    return {
      message: "Video saved successfully",
      video: videoRecord,
    };
  } catch (error) {
    throw new Error(`Error saving video: ${error.message}`);
  }
};

module.exports = {
  createVideoService,
};
