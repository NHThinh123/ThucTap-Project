require("dotenv").config({ path: ".env.local" });
const { PythonShell } = require("python-shell");
const { getInteractionDataServiceImproved, getAllUserVideoInteractions } = require("./video_improved.service");
const Video = require("../models/video.model");

const getRecommendationsService = async (userId) => {
  try {
    console.time("Fetch interaction data");
    const interactionData = await getInteractionDataServiceImproved();
    console.timeEnd("Fetch interaction data");
    console.log(`Interaction data size: ${interactionData.length}`);
    console.log(
      `Unique video IDs in interaction data: ${
        [...new Set(interactionData.map((item) => item.video_id))].length
      }`
    );

    if (!interactionData || interactionData.length === 0) {
      console.warn("No interaction data available");
      const popularVideos = await Video.find()
        .sort({ views: -1 })
        .populate("user_id");
      console.log(`Total videos in fallback: ${popularVideos.length}`);
      return {
        message: "No interaction data, returning all videos sorted by views (unwatched only)",
        data: {
          videos: popularVideos,
          total: popularVideos.length,
          page: 1,
          pages: 1,
        },
      };
    }

    const allVideoIds = await Video.find().distinct("_id");
    console.log(`Total video IDs in database: ${allVideoIds.length}`);

    // Lấy danh sách video đã xem trước khi gọi Python
    const actualWatchedVideos = await getAllUserVideoInteractions(userId);
    console.log(`Actual watched videos from DB: ${actualWatchedVideos.length}`);

    const data = JSON.stringify(interactionData);
    const options = {
      mode: "text",
      pythonPath: process.env.PYTHON_PATH,
      pythonOptions: ["-u"],
      scriptPath: "./recommendation",
      args: [userId, data, JSON.stringify(allVideoIds)],
    };

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Python script timed out"));
      }, 30000);

      PythonShell.run("recommend_improved.py", options, (err, results) => {
        clearTimeout(timeout);
        if (err) {
          console.error("Python script error:", err);
          Video.find()
            .sort({ views: -1 })
            .populate("user_id")
            .then((popularVideos) => {
              console.log(
                `Total videos in error fallback: ${popularVideos.length}`
              );
              resolve({
                message:
                  "Error in recommendation engine, returning all videos sorted by views",
                data: {
                  videos: popularVideos,
                  total: popularVideos.length,
                  page: 1,
                  pages: 1,
                },
              });
            })
            .catch((fallbackErr) => {
              reject(new Error(`Fallback error: ${fallbackErr.message}`));
            });
          return;
        }
        try {
          if (!results || results.length === 0) {
            throw new Error("No results returned from Python script");
          }
          let parsedResults = null;
          for (const result of results) {
            try {
              parsedResults = JSON.parse(result);
              if (Array.isArray(parsedResults)) {
                break;
              }
            } catch (e) {
              continue;
            }
          }
          if (!parsedResults || !Array.isArray(parsedResults)) {
            throw new Error("Python script did not return a valid JSON array");
          }
          console.log(
            `Number of video IDs from Python: ${parsedResults.length}`
          );
          console.log(
            `Video recommendations from Python: ${parsedResults.length} total`
          );
          
          // Fetch TẤT CẢ videos từ database  
          Video.find({})
            .populate("user_id")
            .then((allVideos) => {
              console.log(`Found all videos: ${allVideos.length}`);
              
              // Tạo map cho quick lookup của recommendation data
              const recommendationMap = new Map();
              parsedResults.forEach((rec) => {
                recommendationMap.set(rec.video_id, rec);
              });
              
              // CHỈ lấy video chưa xem từ recommendations
              const unwatchedVideoIds = parsedResults
                .filter(rec => !rec.is_watched) // Chỉ lấy video chưa xem
                .map(rec => rec.video_id);
              
              console.log(`Unwatched video recommendations: ${unwatchedVideoIds.length} videos`);
              
              // Kết hợp video data với recommendation data (chỉ video chưa xem)
              const videosWithRecommendations = allVideos
                .filter(video => {
                  const videoId = video._id.toString();
                  const recommendation = recommendationMap.get(videoId);
                  const isWatchedInDB = actualWatchedVideos.includes(videoId);
                  
                  // Chỉ giữ video có trong recommendations VÀ THỰC SỰ chưa xem
                  return recommendation && !recommendation.is_watched && !isWatchedInDB;
                })
                .map((video) => {
                  const videoId = video._id.toString();
                  const recommendation = recommendationMap.get(videoId);
                  
                  return {
                    ...video.toObject(),
                    predicted_rating: recommendation.predicted_rating,
                    is_top_recommended: recommendation.is_top_recommended,
                    is_watched: false, // Tất cả đều chưa xem
                    popularity_score: recommendation.popularity_score
                  };
                });
              
              // Sắp xếp theo thứ tự từ Python recommendations (đã được sắp xếp)
              const videoOrder = parsedResults.map(rec => rec.video_id);
              const sortedVideos = videosWithRecommendations.sort((a, b) => {
                const indexA = videoOrder.indexOf(a._id.toString());
                const indexB = videoOrder.indexOf(b._id.toString());
                return indexA - indexB;
              });
              
              console.log(`Final sorted videos: ${sortedVideos.length}`);
              console.log(`🎯 PERSONALIZED RESULTS for User ${userId}:`);
              console.log(`Top 5 videos:`, sortedVideos.slice(0, 5).map(v => ({
                video_id: v._id,
                title: v.title,
                predicted_rating: v.predicted_rating,
                is_top_recommended: v.is_top_recommended,
                popularity_score: v.popularity_score || 0
              })));
              
              // Log personalization metrics
              const topRecommended = sortedVideos.filter(v => v.is_top_recommended);
              const aiPredicted = sortedVideos.filter(v => v.predicted_rating > 0);
              console.log(`📊 Personalization metrics for User ${userId}:`);
              console.log(`  - Top recommended: ${topRecommended.length}`);
              console.log(`  - AI predicted: ${aiPredicted.length}`);
              console.log(`  - Watched videos excluded: ${actualWatchedVideos.length}`);
              
              resolve({
                message: "Unwatched videos retrieved successfully with AI recommendations",
                data: {
                  videos: sortedVideos,
                  total: sortedVideos.length,
                  page: 1,
                  pages: 1,
                },
              });
            })
            .catch((queryErr) => {
              reject(new Error(`Video query error: ${queryErr.message}`));
            });
        } catch (parseErr) {
          console.error("JSON parse error:", parseErr);
          Video.find()
            .sort({ views: -1 })
            .populate("user_id")
            .then((popularVideos) => {
              console.log(
                `Total videos in parse error fallback: ${popularVideos.length}`
              );
              resolve({
                message:
                  "Error parsing recommendation results, returning all videos sorted by views",
                data: {
                  videos: popularVideos,
                  total: popularVideos.length,
                  page: 1,
                  pages: 1,
                },
              });
            })
            .catch((fallbackErr) => {
              reject(new Error(`Fallback error: ${fallbackErr.message}`));
            });
        }
      });
    });

    return result;
  } catch (error) {
    console.error("Recommendation service error:", error);
    const popularVideos = await Video.find()
      .sort({ views: -1 })
      .populate("user_id");
    console.log(`Total videos in catch fallback: ${popularVideos.length}`);
    return {
      message:
        "Error in recommendation service, returning all videos sorted by views",
      data: {
        videos: popularVideos,
        total: popularVideos.length,
        page: 1,
        pages: 1,
      },
    };
  }
};

module.exports = { getRecommendationsService };
