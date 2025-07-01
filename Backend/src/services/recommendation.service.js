const path = require("path");
const { PythonShell } = require("python-shell");
const { getInteractionDataService } = require("./video.service");
const Video = require("../models/video.model");
const History = require("../models/history.model"); // Thêm model History

const getRecommendationsService = async (userId) => {
  try {
    console.time("Lấy dữ liệu tương tác");
    const interactionData = await getInteractionDataService();
    console.timeEnd("Lấy dữ liệu tương tác");
    console.log(
      `Kích thước dữ liệu tương tác (trước khi lọc): ${interactionData.length}`
    );

    // Lấy lịch sử xem của người dùng
    console.time("Lấy lịch sử người dùng");
    const userHistory = await History.find({ user_id: userId })
      .select("video_id")
      .lean();
    const watchedVideoIds = new Set(
      userHistory.map((h) => h.video_id.toString())
    );
    console.timeEnd("Lấy lịch sử người dùng");
    console.log(
      `Video đã xem của người dùng ${userId}: ${watchedVideoIds.size}`
    );

    // Lấy danh sách video_id hợp lệ từ bộ sưu tập videos
    const validVideoIds = await Video.find().distinct("_id").lean();
    const validVideoIdsSet = new Set(validVideoIds.map((id) => id.toString()));
    console.log(`Video ID hợp lệ trong cơ sở dữ liệu: ${validVideoIds.length}`);

    // Lọc interaction_data để chỉ giữ video_id hợp lệ và loại bỏ video đã xem
    const filteredInteractionData = interactionData.filter(
      (item) =>
        validVideoIdsSet.has(item.video_id) &&
        !watchedVideoIds.has(item.video_id)
    );
    console.log(
      `Kích thước dữ liệu tương tác (sau khi lọc): ${filteredInteractionData.length}`
    );
    console.log(
      `Số video ID duy nhất trong dữ liệu tương tác đã lọc: ${
        [...new Set(filteredInteractionData.map((item) => item.video_id))]
          .length
      }`
    );

    // Lọc allVideoIds để loại bỏ video đã xem
    const unwatchedVideoIds = validVideoIds.filter(
      (id) => !watchedVideoIds.has(id.toString())
    );
    console.log(`Video ID chưa xem: ${unwatchedVideoIds.length}`);

    if (
      !filteredInteractionData ||
      filteredInteractionData.length === 0 ||
      unwatchedVideoIds.length === 0
    ) {
      console.warn("Không có video chưa xem hợp lệ sau khi lọc");
      const popularUnwatchedVideos = await Video.find({
        _id: { $nin: Array.from(watchedVideoIds) },
      })
        .sort({ views: -1 })
        .populate("user_id")
        .lean();
      console.log(
        `Tổng số video chưa xem trong dự phòng: ${popularUnwatchedVideos.length}`
      );
      return {
        message:
          "Không có video chưa xem hợp lệ, trả về video chưa xem phổ biến sắp xếp theo lượt xem",
        data: {
          videos: popularUnwatchedVideos,
          total: popularUnwatchedVideos.length,
          page: 1,
          pages: 1,
        },
      };
    }

    const data = JSON.stringify(filteredInteractionData);
    const options = {
      mode: "text",
      pythonPath: path.join(
        __dirname,
        "..",
        "..",
        "venv",
        "Scripts",
        "python.exe"
      ),
      pythonOptions: ["-u"],
      scriptPath: "./recommendation",
      args: [String(userId), data, JSON.stringify(unwatchedVideoIds)],
    };

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Script Python hết thời gian"));
      }, 60000);

      PythonShell.run("recommend.py", options, (err, results) => {
        clearTimeout(timeout);
        if (err) {
          console.error("Chi tiết lỗi script Python:", err);
          Video.find({ _id: { $nin: Array.from(watchedVideoIds) } })
            .sort({ views: -1 })
            .populate("user_id")
            .lean()
            .then((popularUnwatchedVideos) => {
              console.log(
                `Tổng số video chưa xem trong dự phòng lỗi: ${popularUnwatchedVideos.length}`
              );
              resolve({
                message:
                  "Lỗi trong công cụ đề xuất, trả về video chưa xem sắp xếp theo lượt xem",
                data: {
                  videos: popularUnwatchedVideos,
                  total: popularUnwatchedVideos.length,
                  page: 1,
                  pages: 1,
                },
              });
            })
            .catch((fallbackErr) => {
              reject(new Error(`Lỗi dự phòng: ${fallbackErr.message}`));
            });
          return;
        }
        try {
          if (!results || results.length === 0) {
            throw new Error("Không có kết quả từ script Python");
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
            throw new Error("Script Python không trả về mảng JSON hợp lệ");
          }
          console.log(`Số video ID từ Python: ${parsedResults.length}`);
          console.log(
            `Video ID từ Python: ${JSON.stringify(
              parsedResults.map((rec) => rec.video_id)
            )}`
          );

          // Kiểm tra xem có video đã xem nào trong đề xuất không
          const recommendedVideoIds = parsedResults.map((rec) => rec.video_id);
          const watchedInRecommendations = recommendedVideoIds.filter((id) =>
            watchedVideoIds.has(id)
          );
          if (watchedInRecommendations.length > 0) {
            console.warn(
              `Phát hiện video đã xem trong đề xuất: ${watchedInRecommendations}`
            );
          }

          const videoIds = recommendedVideoIds.filter((id) =>
            validVideoIdsSet.has(id)
          );
          Video.find({ _id: { $in: videoIds } })
            .populate("user_id")
            .lean()
            .then((videos) => {
              console.log(`Tìm thấy video: ${videos.length}`);
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
              console.log(`Video cuối cùng đã sắp xếp: ${sortedVideos.length}`);
              console.log(
                `Đề xuất cuối cùng:`,
                sortedVideos.map((v) => ({
                  video_id: v._id,
                  predicted_rating: v.predicted_rating,
                  is_top_recommended: v.is_top_recommended,
                }))
              );
              resolve({
                message: "Lấy video thành công",
                data: {
                  videos: sortedVideos,
                  total: sortedVideos.length,
                  page: 1,
                  pages: 1,
                },
              });
            })
            .catch((queryErr) => {
              reject(new Error(`Lỗi truy vấn video: ${queryErr.message}`));
            });
        } catch (parseErr) {
          console.error("Lỗi phân tích JSON:", parseErr);
          Video.find({ _id: { $nin: Array.from(watchedVideoIds) } })
            .sort({ views: -1 })
            .populate("user_id")
            .lean()
            .then((popularUnwatchedVideos) => {
              console.log(
                `Tổng số video chưa xem trong dự phòng lỗi phân tích: ${popularUnwatchedVideos.length}`
              );
              resolve({
                message:
                  "Lỗi phân tích kết quả đề xuất, trả về video chưa xem sắp xếp theo lượt xem",
                data: {
                  videos: popularUnwatchedVideos,
                  total: popularUnwatchedVideos.length,
                  page: 1,
                  pages: 1,
                },
              });
            })
            .catch((fallbackErr) => {
              reject(new Error(`Lỗi dự phòng: ${fallbackErr.message}`));
            });
        }
      });
    });

    return result;
  } catch (error) {
    console.error("Lỗi dịch vụ đề xuất:", error);
    const popularUnwatchedVideos = await Video.find({
      _id: { $nin: Array.from(watchedVideoIds) },
    })
      .sort({ views: -1 })
      .populate("user_id")
      .lean();
    console.log(
      `Tổng số video chưa xem trong dự phòng catch: ${popularUnwatchedVideos.length}`
    );
    return {
      message:
        "Lỗi trong dịch vụ đề xuất, trả về video chưa xem sắp xếp theo lượt xem",
      data: {
        videos: popularUnwatchedVideos,
        total: popularUnwatchedVideos.length,
        page: 1,
        pages: 1,
      },
    };
  }
};

module.exports = { getRecommendationsService };
