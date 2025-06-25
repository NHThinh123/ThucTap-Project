const Video = require("../models/video.model");
const Review = require("../models/review.model");
const User_Like_Video = require("../models/user_like_video.model");
const User_Dislike_Video = require("../models/user_dislike_video.model");
const Comment = require("../models/comment.model");
const Playlist_Video = require("../models/playlist_video.model");
const History = require("../models/history.model");

const getInteractionDataServiceImproved = async () => {
  try {
    console.time("Fetch all interaction data");

    // Fetch tất cả data song song để tăng performance
    const [reviews, likes, dislikes, comments, playlistVideos, histories] =
      await Promise.all([
        Review.find({}).select("user_id video_id review_rating").lean(),
        User_Like_Video.find({}).select("user_id video_id").lean(),
        User_Dislike_Video.find({}).select("user_id video_id").lean(),
        Comment.find({}).select("user_id video_id").lean(),
        Playlist_Video.find({})
          .populate("playlist_id", "user_id")
          .select("video_id playlist_id")
          .lean(),
        History.find({ watch_duration: { $gte: 5 } })
          .select("user_id video_id watch_duration")
          .lean(), // Giảm về 5s để capture nhiều interactions hơn
      ]);

    console.timeEnd("Fetch all interaction data");

    // Sử dụng Map để aggregate interactions theo (user_id, video_id)
    const interactionMap = new Map();

    const addInteraction = (userId, videoId, rating, type) => {
      if (!userId || !videoId) return; // Skip invalid data

      const key = `${userId}-${videoId}`;
      if (!interactionMap.has(key)) {
        interactionMap.set(key, {
          user_id: userId.toString(),
          video_id: videoId.toString(),
          rating: 0,
          interactions: new Set(),
        });
      }

      const interaction = interactionMap.get(key);

      // Tránh trùng lặp cùng loại interaction
      if (!interaction.interactions.has(type)) {
        interaction.rating += rating;
        interaction.interactions.add(type);
      }
    };

    // Xử lý Reviews (explicit feedback) - giữ nguyên rating gốc
    reviews.forEach((review) => {
      addInteraction(
        review.user_id,
        review.video_id,
        review.review_rating,
        "review"
      );
    });

    // Xử lý Likes (implicit feedback: +2 - tăng từ +1)
    likes.forEach((like) => {
      addInteraction(like.user_id, like.video_id, 2, "like");
    });

    // Xử lý Dislikes (implicit feedback: -2 - tăng từ -1)
    dislikes.forEach((dislike) => {
      addInteraction(dislike.user_id, dislike.video_id, -2, "dislike");
    });

    // Xử lý Comments (implicit feedback: +1)
    comments.forEach((comment) => {
      addInteraction(comment.user_id, comment.video_id, 1, "comment");
    });

    // Xử lý Playlist Videos (implicit feedback: +3 - tăng từ +1)
    // FIX: Lấy user_id từ playlist thay vì thiếu user_id
    playlistVideos.forEach((pv) => {
      if (pv.playlist_id && pv.playlist_id.user_id) {
        addInteraction(pv.playlist_id.user_id, pv.video_id, 3, "playlist");
      }
    });

    // Xử lý History với rating dựa trên thời gian xem
    histories.forEach((history) => {
      // Rating dựa trên watch_duration: 5-30s = +0.5, 30-120s = +1, >120s = +1.5
      let rating = 0.5; // Mặc định cho video đã xem (≥5s)
      if (history.watch_duration >= 120) {
        rating = 1.5; // Xem lâu
      } else if (history.watch_duration >= 30) {
        rating = 1; // Xem vừa
      }

      addInteraction(history.user_id, history.video_id, rating, "history");
    });

    // Convert Map to Array và áp dụng rating constraints
    const interactionData = Array.from(interactionMap.values()).map(
      (interaction) => ({
        user_id: interaction.user_id,
        video_id: interaction.video_id,
        rating: Math.max(-2, Math.min(5, interaction.rating)),
        watch_duration: interaction.watch_duration || null, // Thêm watch_duration
      })
    );

    console.log(`
      Raw data counts:
      - Reviews: ${reviews.length}
      - Likes: ${likes.length}
      - Dislikes: ${dislikes.length}
      - Comments: ${comments.length}
      - Playlist Videos: ${playlistVideos.length}
      - Histories: ${histories.length}
      
      Processed interactions: ${interactionData.length}
      Unique users: ${new Set(interactionData.map((i) => i.user_id)).size}
      Unique videos: ${new Set(interactionData.map((i) => i.video_id)).size}
    `);

    // Log sample interactions để debug
    if (interactionData.length > 0) {
      console.log("Sample interactions:");
      interactionData.slice(0, 5).forEach((interaction) => {
        console.log(
          `  User ${interaction.user_id} -> Video ${interaction.video_id} (Rating: ${interaction.rating})`
        );
      });
    }

    return interactionData;
  } catch (error) {
    console.error("Error fetching interaction data:", error);
    throw new Error(`Error fetching interaction data: ${error.message}`);
  }
};

// Hàm lấy TẤT CẢ video interactions (không chỉ có rating) để đảm bảo capture video đã xem
const getAllUserVideoInteractions = async (userId) => {
  try {
    console.log(`Getting all video interactions for user: ${userId}`);

    const [reviews, likes, dislikes, comments, playlistVideos, histories] =
      await Promise.all([
        Review.find({ user_id: userId }).select("video_id").lean(),
        User_Like_Video.find({ user_id: userId }).select("video_id").lean(),
        User_Dislike_Video.find({ user_id: userId }).select("video_id").lean(),
        Comment.find({ user_id: userId }).select("video_id").lean(),
        Playlist_Video.find({})
          .populate({
            path: "playlist_id",
            match: { user_id: userId },
            select: "user_id",
          })
          .select("video_id")
          .lean(),
        History.find({ user_id: userId, watch_duration: { $gte: 5 } })
          .select("video_id")
          .lean(),
      ]);

    // Collect all unique video IDs
    const watchedVideoIds = new Set();

    reviews.forEach((r) => watchedVideoIds.add(r.video_id.toString()));
    likes.forEach((l) => watchedVideoIds.add(l.video_id.toString()));
    dislikes.forEach((d) => watchedVideoIds.add(d.video_id.toString()));
    comments.forEach((c) => watchedVideoIds.add(c.video_id.toString()));
    playlistVideos.forEach((pv) => {
      if (pv.playlist_id) {
        // Only if user owns the playlist
        watchedVideoIds.add(pv.video_id.toString());
      }
    });
    histories.forEach((h) => watchedVideoIds.add(h.video_id.toString()));

    const watchedArray = Array.from(watchedVideoIds);

    console.log(
      `User ${userId} has interacted with ${watchedArray.length} videos:`
    );
    console.log(`  - Reviews: ${reviews.length}`);
    console.log(`  - Likes: ${likes.length}`);
    console.log(`  - Dislikes: ${dislikes.length}`);
    console.log(`  - Comments: ${comments.length}`);
    console.log(
      `  - Playlist Videos: ${
        playlistVideos.filter((pv) => pv.playlist_id).length
      }`
    );
    console.log(`  - Histories: ${histories.length}`);

    return watchedArray;
  } catch (error) {
    console.error("Error getting user video interactions:", error);
    return [];
  }
};

// Hàm phân tích chất lượng dữ liệu
const analyzeInteractionDataQuality = async () => {
  try {
    const interactionData = await getInteractionDataServiceImproved();

    const analysis = {
      totalInteractions: interactionData.length,
      uniqueUsers: new Set(interactionData.map((i) => i.user_id)).size,
      uniqueVideos: new Set(interactionData.map((i) => i.video_id)).size,
      ratingDistribution: {},
      sparsity: 0,
    };

    // Phân bố rating
    interactionData.forEach((interaction) => {
      const rating = interaction.rating;
      analysis.ratingDistribution[rating] =
        (analysis.ratingDistribution[rating] || 0) + 1;
    });

    // Tính độ thưa (sparsity)
    const totalPossibleInteractions =
      analysis.uniqueUsers * analysis.uniqueVideos;
    analysis.sparsity = (
      ((totalPossibleInteractions - analysis.totalInteractions) /
        totalPossibleInteractions) *
      100
    ).toFixed(2);

    // User và Video statistics
    const userInteractionCounts = {};
    const videoInteractionCounts = {};

    interactionData.forEach((interaction) => {
      userInteractionCounts[interaction.user_id] =
        (userInteractionCounts[interaction.user_id] || 0) + 1;
      videoInteractionCounts[interaction.video_id] =
        (videoInteractionCounts[interaction.video_id] || 0) + 1;
    });

    analysis.userStats = {
      avg:
        Object.values(userInteractionCounts).reduce((a, b) => a + b, 0) /
        analysis.uniqueUsers,
      min: Math.min(...Object.values(userInteractionCounts)),
      max: Math.max(...Object.values(userInteractionCounts)),
    };

    analysis.videoStats = {
      avg:
        Object.values(videoInteractionCounts).reduce((a, b) => a + b, 0) /
        analysis.uniqueVideos,
      min: Math.min(...Object.values(videoInteractionCounts)),
      max: Math.max(...Object.values(videoInteractionCounts)),
    };

    return analysis;
  } catch (error) {
    throw new Error(`Error analyzing interaction data: ${error.message}`);
  }
};

module.exports = {
  getInteractionDataServiceImproved,
  getAllUserVideoInteractions,
  analyzeInteractionDataQuality,
};
