const Video = require("../models/video.model");
const Review = require("../models/review.model");
const User_Like_Video = require("../models/user_like_video.model");
const User_Dislike_Video = require("../models/user_dislike_video.model");
const Comment = require("../models/comment.model");
const Playlist_Video = require("../models/playlist_video.model");
const History = require("../models/history.model");
const VideoStats = require("../models/video_stats.model");

const {
  countLikeVideoService,
} = require("../services/user_like_video.service");
const {
  countDislikeVideoService,
} = require("../services/user_dislike_video.service");
const { getVideoCommentsCountService } = require("../services/comment.service");

const createVideoService = async (videoData, userId) => {
  try {
    if (!videoData.video_url || !videoData.title || !userId) {
      throw new Error("Missing required fields: url, title, or user_id");
    }

    const videoRecord = new Video({
      user_id: userId,
      title: videoData.title,
      description_video: videoData.description || null,
      video_url: videoData.video_url,
      thumbnail_video: videoData.thumbnail || "",
      duration: videoData.duration ? Math.round(Number(videoData.duration)) : 0,
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
    const { page = 1, limit = 99, user_id } = query;
    const filter = user_id ? { user_id } : {};

    const videos = await Video.find(filter)
      .populate("user_id", "user_name email avatar nickname")
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
      "user_name email avatar nickname"
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
      video_url: videoData.video_url || video.video_url,
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

const incrementViewService = async (videoId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new AppError("Video not found", 404);
    }

    video.views += 1;
    await video.save();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await VideoStats.findOneAndUpdate(
      { video_id: videoId, date: today },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    );

    return { message: "View incremented successfully", views: video.views };
  } catch (error) {
    throw new AppError(`Error incrementing view: ${error.message}`, 500);
  }
};

const getInteractionDataService = async () => {
  try {
    console.time("Lấy đánh giá");
    const reviews = await Review.find({}).select(
      "user_id video_id review_rating"
    );
    console.timeEnd("Lấy đánh giá");
    console.log(`Lấy được ${reviews.length} đánh giá`);

    console.time("Lấy lượt thích");
    const likes = await User_Like_Video.find({}).select("user_id video_id");
    console.timeEnd("Lấy lượt thích");
    console.log(`Lấy được ${likes.length} lượt thích`);

    console.time("Lấy lượt không thích");
    const dislikes = await User_Dislike_Video.find({}).select(
      "user_id video_id"
    );
    console.timeEnd("Lấy lượt không thích");
    console.log(`Lấy được ${dislikes.length} lượt không thích`);

    console.time("Lấy bình luận");
    const comments = await Comment.find({}).select("user_id video_id");
    console.timeEnd("Lấy bình luận");
    console.log(`Lấy được ${comments.length} bình luận`);

    console.time("Lấy video danh sách phát");
    const playlistVideos = await Playlist_Video.find({}).select("video_id");
    console.timeEnd("Lấy video danh sách phát");
    console.log(`Lấy được ${playlistVideos.length} video danh sách phát`);

    console.time("Lấy lịch sử");
    const histories = await History.find({}).select(
      "user_id video_id watch_duration"
    );
    console.timeEnd("Lấy lịch sử");
    console.log(`Lấy được ${histories.length} bản ghi lịch sử`);

    // Lấy duration của tất cả video để so sánh
    console.time("Lấy duration video");
    const videos = await Video.find({}).select("_id duration").lean();
    const videoDurationMap = new Map(
      videos.map((v) => [v._id.toString(), v.duration])
    );
    console.timeEnd("Lấy duration video");

    console.time("Tổng hợp dữ liệu");
    const interactionData = [];

    // Xử lý reviews (phản hồi rõ ràng)
    reviews.forEach((review) => {
      interactionData.push({
        user_id: review.user_id.toString(),
        video_id: review.video_id.toString(),
        rating: review.review_rating,
      });
    });

    // Xử lý likes (phản hồi ngầm: +1)
    likes.forEach((like) => {
      interactionData.push({
        user_id: like.user_id.toString(),
        video_id: like.video_id.toString(),
        rating: 1,
      });
    });

    // Xử lý dislikes (phản hồi ngầm: -1)
    dislikes.forEach((dislike) => {
      interactionData.push({
        user_id: dislike.user_id.toString(),
        video_id: dislike.video_id.toString(),
        rating: -1,
      });
    });

    // Xử lý comments (phản hồi ngầm: +1)
    comments.forEach((comment) => {
      interactionData.push({
        user_id: comment.user_id.toString(),
        video_id: comment.video_id.toString(),
        rating: 1,
      });
    });

    // Xử lý playlist videos (phản hồi ngầm: +1)
    playlistVideos.forEach((pv) => {
      interactionData.push({
        video_id: pv.video_id.toString(),
        rating: 1,
      });
    });

    // Xử lý history (phản hồi ngầm: dựa trên tỷ lệ watch_duration / duration)
    histories.forEach((history) => {
      const videoId = history.video_id.toString();
      const duration = videoDurationMap.get(videoId) || 1; // Tránh chia cho 0
      const watchRatio = history.watch_duration / duration;
      if (watchRatio < 0.7) {
        // Chỉ thêm video xem dưới 70% vào interactionData
        interactionData.push({
          user_id: history.user_id.toString(),
          video_id: videoId,
          rating: 1, // Hoặc điều chỉnh rating dựa trên watchRatio, ví dụ: watchRatio * 5
        });
      }
    });

    console.timeEnd("Tổng hợp dữ liệu");
    console.log(`Tổng hợp ${interactionData.length} tương tác`);

    return interactionData;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tương tác:", error);
    throw new Error(`Lỗi khi lấy dữ liệu tương tác: ${error.message}`);
  }
};

const searchVideosService = async (query) => {
  try {
    const { q } = query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      throw new Error(
        "Search query is required and must be a non-empty string"
      );
    }

    // Tìm kiếm văn bản sử dụng text index
    const regexQuery = { $regex: q, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    const videos = await Video.find({
      $or: [{ title: regexQuery }],
    })
      .populate("user_id", "user_name email avatar nickname")
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments({
      $or: [{ title: regexQuery }],
    });

    return {
      message: "Videos retrieved successfully",
      data: {
        videos,
        total,
      },
    };
  } catch (error) {
    throw new Error(`Error searching videos: ${error.message}`);
  }
};

// Dịch vụ gợi ý tìm kiếm
const getSearchSuggestionsService = async (query) => {
  try {
    const { q } = query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return {
        message: "No suggestions available",
        suggestions: [],
      };
    }

    const regexQuery = { $regex: q, $options: "i" };
    const videos = await Video.find({ title: regexQuery }, { title: 1 })
      .limit(5) // Giới hạn số gợi ý
      .sort({ createdAt: -1 });

    // Lấy danh sách tiêu đề làm gợi ý
    const suggestions = videos.map((video) => video.title);

    return {
      message: "Suggestions retrieved successfully",
      suggestions,
    };
  } catch (error) {
    throw new Error(`Error retrieving search suggestions: ${error.message}`);
  }
};

// Lấy danh sách video theo userId
const getVideosByUserIdService = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Thiếu user_id");
    }

    const videos = await Video.find({ user_id: userId })
      .populate("user_id", "user_name email avatar nickname")
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments({ user_id: userId });

    // Tạo mảng để lưu thông tin bổ sung (like, dislike, comment)
    const videosWithStats = await Promise.all(
      videos.map(async (video) => {
        const likes = await countLikeVideoService(video._id);
        const dislikes = await countDislikeVideoService(video._id);
        const comments = await getVideoCommentsCountService({
          video_id: video._id,
        });

        return {
          ...video._doc, // Lấy toàn bộ dữ liệu video
          likes,
          dislikes,
          comments: comments.totalCount,
        };
      })
    );

    return {
      message: "Lấy danh sách video theo user_id thành công",
      data: {
        videos: videosWithStats,
        total,
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách video: ${error.message}`);
  }
};

// Đếm số lượng video của một userId
const countVideoOfUserIdService = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Thiếu user_id");
    }

    const total = await Video.countDocuments({ user_id: userId });

    return {
      message: "Đếm số lượng video thành công",
      total,
    };
  } catch (error) {
    throw new Error(`Lỗi khi đếm số lượng video: ${error.message}`);
  }
};
const updateVideoAdminService = async (videoId, videoData) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    const updatedData = {
      title: videoData.title || video.title,
      description_video: videoData.description || video.description_video,
      video_url: videoData.video_url || video.video_url,
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
const deleteVideoAdminService = async (videoId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
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
  getInteractionDataService,
  incrementViewService,
  searchVideosService,
  getSearchSuggestionsService,
  getVideosByUserIdService,
  countVideoOfUserIdService,
  updateVideoAdminService,
  deleteVideoAdminService,
};
