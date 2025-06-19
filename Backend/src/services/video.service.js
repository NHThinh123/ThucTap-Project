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
    console.time("Fetch reviews");
    const reviews = await Review.find({}).select(
      "user_id video_id review_rating"
    );
    console.timeEnd("Fetch reviews");
    console.log(`Fetched ${reviews.length} reviews`);

    console.time("Fetch likes");
    const likes = await User_Like_Video.find({}).select("user_id video_id");
    console.timeEnd("Fetch likes");
    console.log(`Fetched ${likes.length} likes`);

    console.time("Fetch dislikes");
    const dislikes = await User_Dislike_Video.find({}).select(
      "user_id video_id"
    );
    console.timeEnd("Fetch dislikes");
    console.log(`Fetched ${dislikes.length} dislikes`);

    console.time("Fetch comments");
    const comments = await Comment.find({}).select("user_id video_id");
    console.timeEnd("Fetch comments");
    console.log(`Fetched ${comments.length} comments`);

    console.time("Fetch playlist videos");
    const playlistVideos = await Playlist_Video.find({}).select("video_id");
    console.timeEnd("Fetch playlist videos");
    console.log(`Fetched ${playlistVideos.length} playlist videos`);

    console.time("Fetch history");
    const histories = await History.find({
      watch_duration: { $gte: 5 },
    }).select("user_id video_id");
    console.timeEnd("Fetch history");
    console.log(`Fetched ${histories.length} history records`);

    console.time("Aggregate data");
    const interactionData = [];

    // Xử lý reviews (explicit feedback)
    reviews.forEach((review) => {
      interactionData.push({
        user_id: review.user_id.toString(),
        video_id: review.video_id.toString(),
        rating: review.review_rating,
      });
    });

    // Xử lý likes (implicit feedback: +1)
    likes.forEach((like) => {
      interactionData.push({
        user_id: like.user_id.toString(),
        video_id: like.video_id.toString(),
        rating: 1,
      });
    });

    // Xử lý dislikes (implicit feedback: -1)
    dislikes.forEach((dislike) => {
      interactionData.push({
        user_id: dislike.user_id.toString(),
        video_id: dislike.video_id.toString(),
        rating: -1,
      });
    });

    // Xử lý comments (implicit feedback: +1)
    comments.forEach((comment) => {
      interactionData.push({
        user_id: comment.user_id.toString(),
        video_id: comment.video_id.toString(),
        rating: 1,
      });
    });

    // Xử lý playlist videos (implicit feedback: +1)
    playlistVideos.forEach((pv) => {
      interactionData.push({
        video_id: pv.video_id.toString(),
        rating: 1,
      });
    });

    // Xử lý history (implicit feedback: +1 nếu xem >= 30 giây)
    histories.forEach((history) => {
      interactionData.push({
        user_id: history.user_id.toString(),
        video_id: history.video_id.toString(),
        rating: 1,
      });
    });

    console.timeEnd("Aggregate data");
    console.log(`Aggregated ${interactionData.length} interactions`);

    return interactionData;
  } catch (error) {
    console.error("Error fetching interaction data:", error);
    throw new Error(`Error fetching interaction data: ${error.message}`);
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
};
