const Video = require("../models/video.model");

const createVideoService = async (videoData, userId) => {
  try {
    if (!videoData.url || !videoData.title || !userId) {
      throw new Error("Missing required fields: url, title, or user_id");
    }

    const videoRecord = new Video({
      user_id: userId,
      title: videoData.title,
      description_video: videoData.description || null,
      url_video: videoData.url,
      thumbnail_video: videoData.thumbnail || "",
      duration: videoData.duration || 0,
      views: 0,
    });

    await videoRecord.save();

    return {
      message: "Video saved successfully",
      video: videoRecord,
    };
  } catch (error) {
    throw new Error(`Error saving video: ${error.message}`);
  }
};

const getVideosService = async (query) => {
  try {
    const { page = 1, limit = 10, user_id } = query;
    const filter = user_id ? { user_id } : {};

    const videos = await Video.find(filter)
      .populate("user_id", "username email") // Populate thông tin user
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments(filter);

    return {
      message: "Videos retrieved successfully",
      data: {
        videos,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error retrieving videos: ${error.message}`);
  }
};

const getVideoByIdService = async (videoId) => {
  try {
    const video = await Video.findById(videoId).populate(
      "user_id",
      "username email"
    );
    if (!video) {
      throw new Error("Video not found");
    }

    return {
      message: "Video retrieved successfully",
      video,
    };
  } catch (error) {
    throw new Error(`Error retrieving video: ${error.message}`);
  }
};

const updateVideoService = async (videoId, videoData, userId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    if (video.user_id.toString() !== userId) {
      throw new Error("Unauthorized: You can only update your own videos");
    }

    const updatedData = {
      title: videoData.title || video.title,
      description_video: videoData.description || video.description_video,
      url_video: videoData.url || video.url_video,
      thumbnail_video: videoData.thumbnail || video.thumbnail_video,
      duration: videoData.duration || video.duration,
    };

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updatedData, {
      new: true,
    });

    return {
      message: "Video updated successfully",
      video: updatedVideo,
    };
  } catch (error) {
    throw new Error(`Error updating video: ${error.message}`);
  }
};

const deleteVideoService = async (videoId, userId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    if (video.user_id.toString() !== userId) {
      throw new Error("Unauthorized: You can only delete your own videos");
    }

    await Video.findByIdAndDelete(videoId);

    return {
      message: "Video deleted successfully",
    };
  } catch (error) {
    throw new Error(`Error deleting video: ${error.message}`);
  }
};

module.exports = {
  createVideoService,
  getVideosService,
  getVideoByIdService,
  updateVideoService,
  deleteVideoService,
};
