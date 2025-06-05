require("dotenv").config({ path: ".env.local" });
const { PythonShell } = require("python-shell");
const { getInteractionDataService } = require("./video.service");
const Video = require("../models/video.model");

const getRecommendationsService = async (userId) => {
  try {
    console.time("Fetch interaction data");
    const interactionData = await getInteractionDataService();
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
        message: "No interaction data, returning all videos sorted by views",
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

      PythonShell.run("recommend.py", options, (err, results) => {
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
            `Video IDs from Python: ${JSON.stringify(
              parsedResults.map((rec) => rec.video_id)
            )}`
          );
          const videoIds = parsedResults.map((rec) => rec.video_id);
          Video.find({ _id: { $in: videoIds } })
            .populate("user_id")
            .then((videos) => {
              console.log(`Found videos: ${videos.length}`);
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
                .filter((v) => v);
              console.log(`Final sorted videos: ${sortedVideos.length}`);
              console.log(
                sortedVideos.map((v) => ({
                  video_id: v._id,
                  predicted_rating: v.predicted_rating,
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
