const Video = require("../models/video.model");
const Review = require("../models/review.model");
const User_Like_Video = require("../models/user_like_video.model");
const User_Dislike_Video = require("../models/user_dislike_video.model");
const Comment = require("../models/comment.model");
const Playlist_Video = require("../models/playlist_video.model");

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
      .populate("user_id", "user_name email")
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
      "user_name email"
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

const getInteractionDataService = async () => {
  try {
    console.time("Fetch reviews");
    const reviews = await Review.find().select(
      "user_id video_id review_rating"
    );
    console.timeEnd("Fetch reviews");
    console.log(`Fetched ${reviews.length} reviews`);
    const reviewData = reviews.map((review) => ({
      user_id: review.user_id.toString(),
      video_id: review.video_id.toString(),
      rating: review.review_rating,
    }));

    console.time("Fetch likes");
    const likes = await User_Like_Video.find().select("user_id video_id");
    console.timeEnd("Fetch likes");
    console.log(`Fetched ${likes.length} likes`);
    const likeData = likes.map((like) => ({
      user_id: like.user_id.toString(),
      video_id: like.video_id.toString(),
      rating: 1,
    }));

    console.time("Fetch dislikes");
    const dislikes = await User_Dislike_Video.find().select("user_id video_id");
    console.timeEnd("Fetch dislikes");
    console.log(`Fetched ${dislikes.length} dislikes`);
    const dislikeData = dislikes.map((dislike) => ({
      user_id: dislike.user_id.toString(),
      video_id: dislike.video_id.toString(),
      rating: -1,
    }));

    console.time("Fetch comments");
    const comments = await Comment.find().select("user_id video_id");
    console.timeEnd("Fetch comments");
    console.log(`Fetched ${comments.length} comments`);
    const commentData = comments.map((comment) => ({
      user_id: comment.user_id.toString(),
      video_id: comment.video_id.toString(),
      rating: 1,
    }));

    console.time("Fetch playlist videos");
    const playlistVideos = await Playlist_Video.find()
      .select("video_id")
      .populate("playlist_id", "user_id");
    console.timeEnd("Fetch playlist videos");
    console.log(`Fetched ${playlistVideos.length} playlist videos`);
    const playlistData = playlistVideos.map((pv) => ({
      user_id: pv.playlist_id.user_id.toString(),
      video_id: pv.video_id.toString(),
      rating: 1,
    }));

    console.time("Aggregate data");
    const interactionData = [
      ...reviewData,
      ...likeData,
      ...dislikeData,
      ...commentData,
      ...playlistData,
    ];
    const aggregatedData = interactionData.reduce((acc, curr) => {
      const key = `${curr.user_id}-${curr.video_id}`;
      if (!acc[key]) {
        acc[key] = { ...curr, rating: 0 };
      }
      acc[key].rating = Math.min(
        Math.max(acc[key].rating + curr.rating, -1),
        5
      );
      return acc;
    }, {});
    console.timeEnd("Aggregate data");
    console.log(
      `Aggregated ${Object.keys(aggregatedData).length} interactions`
    );

    return Object.values(aggregatedData);
  } catch (error) {
    console.error("Interaction data error:", error);
    throw new Error(`Error retrieving interaction data: ${error.message}`);
  }
};

module.exports = {
  createVideoService,
  getVideosService,
  getVideoByIdService,
  updateVideoService,
  deleteVideoService,
  getInteractionDataService,
};
