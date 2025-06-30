require("dotenv").config({ path: ".env.local" });
const { PythonShell } = require("python-shell");
const { getInteractionDataService } = require("./video.service");
const Video = require("../models/video.model");

const getRecommendationsService = async (userId) => {
  try {
    console.time("Fetch interaction data");
    const interactionData = await getInteractionDataService();
    console.timeEnd("Fetch interaction data");
    console.log(
      `Interaction data size (before filtering): ${interactionData.length}`
    );

    // Lấy danh sách video_id hợp lệ từ collection videos
    const validVideoIds = await Video.find().distinct("_id").lean();
    const validVideoIdsSet = new Set(validVideoIds.map((id) => id.toString()));
    console.log(
      `Valid video IDs in database: ${validVideoIds.length}`,
      validVideoIds.map((id) => id.toString())
    );

    // Lọc interaction_data để chỉ giữ lại các video_id hợp lệ
    const filteredInteractionData = interactionData.filter((item) =>
      validVideoIdsSet.has(item.video_id)
    );
    console.log(
      `Interaction data size (after filtering): ${filteredInteractionData.length}`
    );
    console.log(
      `Unique video IDs in filtered interaction data: ${
        [...new Set(filteredInteractionData.map((item) => item.video_id))]
          .length
      }`
    );

    if (!filteredInteractionData || filteredInteractionData.length === 0) {
      console.warn("No valid interaction data available after filtering");
      const popularVideos = await Video.find()
        .sort({ views: -1 })
        .populate("user_id")
        .lean();
      console.log(`Total videos in fallback: ${popularVideos.length}`);
      return {
        message:
          "No valid interaction data, returning all videos sorted by views",
        data: {
          videos: popularVideos,
          total: popularVideos.length,
          page: 1,
          pages: 1,
        },
      };
    }

    const allVideoIds = validVideoIds; // Sử dụng danh sách validVideoIds
    console.log(`Total video IDs in database: ${allVideoIds.length}`);

    const data = JSON.stringify(filteredInteractionData);
    const options = {
      mode: "text",
      pythonPath: process.env.PYTHON_PATH,
      pythonOptions: ["-u"],
      scriptPath: "./recommendation",
      args: [String(userId), data, JSON.stringify(allVideoIds)],
    };

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Python script timed out"));
      }, 60000); // Tăng timeout lên 60 giây để xử lý dữ liệu lớn hơn

      PythonShell.run("recommend.py", options, (err, results) => {
        clearTimeout(timeout);
        if (err) {
          console.error("Python script error details:", err);
          Video.find()
            .sort({ views: -1 })
            .populate("user_id")
            .lean()
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
            `Video IDs from Python: ${JSON.stringify(
              parsedResults.map((rec) => rec.video_id)
            )}`
          );
          const videoIds = parsedResults.map((rec) => rec.video_id);
          Video.find({ _id: { $in: videoIds } })
            .populate("user_id")
            .lean()
            .then((videos) => {
              console.log(`Found videos: ${videos.length}`);
              const sortedVideos = parsedResults
                .map((rec) => {
                  const video = videos.find(
                    (v) => v._id.toString() === rec.video_id
                  );
                  return video
                    ? {
                        ...video,
                        predicted_rating: rec.predicted_rating,
                        is_top_recommended: rec.is_top_recommended,
                      }
                    : null;
                })
                .filter((v) => v);
              console.log(`Final sorted videos: ${sortedVideos.length}`);
              console.log(
                `Final recommendations:`,
                sortedVideos.map((v) => ({
                  video_id: v._id,
                  predicted_rating: v.predicted_rating,
                  is_top_recommended: v.is_top_recommended,
                }))
              );
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
          Video.find()
            .sort({ views: -1 })
            .populate("user_id")
            .lean()
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
      .populate("user_id")
      .lean();
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
