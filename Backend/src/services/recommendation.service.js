require("dotenv").config({ path: ".env.local" });
const { PythonShell } = require("python-shell");
const { getInteractionDataService } = require("./video.service");
const Video = require("../models/video.model");

const getRecommendationsService = async (userId) => {
  try {
    // Lấy dữ liệu tương tác
    console.time("Fetch interaction data");
    const interactionData = await getInteractionDataService();
    console.timeEnd("Fetch interaction data");
    console.log(`Interaction data size: ${interactionData.length}`);

    if (!interactionData || interactionData.length === 0) {
      console.warn("No interaction data available");
      const popularVideos = await Video.find()
        .sort({ views: -1 }) // Sắp xếp theo lượt xem giảm dần
        .populate("user_id", "user_name email");
      return {
        message: "No interaction data, returning all videos sorted by views",
        data: {
          videos: popularVideos,
          total: popularVideos.length,
          page: 1,
          pages: 1,
        },
      };
    }

    // Chuẩn bị dữ liệu để gửi sang Python
    const data = JSON.stringify(interactionData);
    const options = {
      mode: "text",
      pythonPath: process.env.PYTHON_PATH,
      pythonOptions: ["-u"],
      scriptPath: "./recommendation",
      args: [userId, data],
    };

    // Chạy Python script với timeout
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Python script timed out"));
      }, 30000);

      PythonShell.run("recommend.py", options, (err, results) => {
        clearTimeout(timeout);
        if (err) {
          console.error("Python script error:", err);
          // Fallback: Trả về tất cả video phổ biến
          Video.find()
            .sort({ views: -1 }) // Sắp xếp theo lượt xem giảm dần
            .populate("user_id", "user_name email")
            .then((popularVideos) => {
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
          // Kiểm tra results hợp lệ
          if (!results || results.length === 0) {
            throw new Error("No results returned from Python script");
          }
          // Tìm dòng JSON hợp lệ
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
          // Truy vấn chi tiết tất cả video
          const videoIds = parsedResults.map((rec) => rec.video_id);
          Video.find({ _id: { $in: videoIds } })
            .populate("user_id", "user_name email")
            .then((videos) => {
              // Sắp xếp video theo thứ tự gợi ý
              const sortedVideos = parsedResults
                .map((rec) => {
                  const video = videos.find(
                    (v) => v._id.toString() === rec.video_id
                  );
                  return video
                    ? {
                        ...video.toObject(),
                        predicted_rating: rec.predicted_rating,
                      }
                    : null;
                })
                .filter((v) => v)
                .sort((a, b) => b.predicted_rating - a.predicted_rating); // Sắp xếp theo predicted_rating giảm dần
              resolve({
                message: "Videos retrieved successfully",
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
          // Fallback: Trả về tất cả video phổ biến
          Video.find()
            .sort({ views: -1 }) // Sắp xếp theo lượt xem giảm dần
            .populate("user_id", "user_name email")
            .then((popularVideos) => {
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
      .sort({ views: -1 }) // Sắp xếp theo lượt xem giảm dần
      .populate("user_id", "user_name email");
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
