const path = require("path");
const { PythonShell } = require("python-shell");
const { getInteractionDataService } = require("./video.service");
const Video = require("../models/video.model");
const History = require("../models/history.model");

const getRecommendationsService = async (userId) => {
  try {
    console.time("Lấy dữ liệu tương tác");
    const interactionData = await getInteractionDataService();
    console.timeEnd("Lấy dữ liệu tương tác");
    console.log(
      `Kích thước dữ liệu tương tác (trước khi lọc): ${interactionData.length}`
    );

    // Lấy lịch sử xem và duration của video
    console.time("Lấy lịch sử và duration");
    const userHistory = await History.find({ user_id: userId })
      .select("video_id watch_duration")
      .lean();
    const videos = await Video.find({}).select("_id duration").lean();
    const videoDurationMap = new Map(
      videos.map((v) => [v._id.toString(), v.duration])
    );

    // Xác định video xem trên 70%
    const watchedOver70VideoIds = new Set(
      userHistory
        .filter((h) => {
          const duration = videoDurationMap.get(h.video_id.toString()) || 1;
          return h.watch_duration / duration >= 0.7;
        })
        .map((h) => h.video_id.toString())
    );
    console.timeEnd("Lấy lịch sử và duration");
    console.log(
      `Video xem trên 70% của người dùng ${userId}: ${watchedOver70VideoIds.size}`
    );

    // Lấy danh sách video_id hợp lệ
    const validVideoIds = await Video.find().distinct("_id").lean();
    const validVideoIdsSet = new Set(validVideoIds.map((id) => id.toString()));
    console.log(`Video ID hợp lệ trong cơ sở dữ liệu: ${validVideoIds.length}`);

    // Lọc interaction_data để chỉ giữ video_id hợp lệ
    const filteredInteractionData = interactionData.filter((item) =>
      validVideoIdsSet.has(item.video_id)
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

    // Tạo danh sách video để đề xuất (bao gồm tất cả video, kể cả xem trên 70%)
    const allVideoIds = validVideoIds.map((id) => id.toString());
    console.log(`Tổng số video ID: ${allVideoIds.length}`);

    if (!filteredInteractionData || filteredInteractionData.length === 0) {
      console.warn("Không có dữ liệu tương tác hợp lệ sau khi lọc");
      const videos = await Video.find()
        .sort({ views: -1 })
        .populate("user_id")
        .lean();
      const sortedVideos = videos
        .map((video) => ({
          ...video,
          predicted_rating: watchedOver70VideoIds.has(video._id.toString())
            ? 0
            : video.views / 1000, // Giảm rating cho video xem trên 70%
          is_top_recommended: false,
        }))
        .sort((a, b) => {
          const aWatched = watchedOver70VideoIds.has(a._id.toString());
          const bWatched = watchedOver70VideoIds.has(b._id.toString());
          if (aWatched && !bWatched) return 1; // Đẩy video xem trên 70% xuống dưới
          if (!aWatched && bWatched) return -1;
          return b.predicted_rating - a.predicted_rating; // Sắp xếp theo rating
        });
      console.log(`Tổng số video trong dự phòng: ${sortedVideos.length}`);
      return {
        message:
          "Không có dữ liệu tương tác hợp lệ, trả về tất cả video sắp xếp theo lượt xem",
        data: {
          videos: sortedVideos,
          total: sortedVideos.length,
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
      args: [String(userId), data, JSON.stringify(allVideoIds)],
    };

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Script Python hết thời gian"));
      }, 60000);

      PythonShell.run("recommend.py", options, (err, results) => {
        clearTimeout(timeout);
        if (err) {
          console.error("Chi tiết lỗi script Python:", err);
          Video.find()
            .sort({ views: -1 })
            .populate("user_id")
            .lean()
            .then((videos) => {
              const sortedVideos = videos
                .map((video) => ({
                  ...video,
                  predicted_rating: watchedOver70VideoIds.has(
                    video._id.toString()
                  )
                    ? 0
                    : video.views / 1000,
                  is_top_recommended: false,
                }))
                .sort((a, b) => {
                  const aWatched = watchedOver70VideoIds.has(a._id.toString());
                  const bWatched = watchedOver70VideoIds.has(b._id.toString());
                  if (aWatched && !bWatched) return 1;
                  if (!aWatched && bWatched) return -1;
                  return b.predicted_rating - a.predicted_rating;
                });
              console.log(
                `Tổng số video trong dự phòng lỗi: ${sortedVideos.length}`
              );
              resolve({
                message:
                  "Lỗi trong công cụ đề xuất, trả về tất cả video sắp xếp theo lượt xem",
                data: {
                  videos: sortedVideos,
                  total: sortedVideos.length,
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

          const videoIds = parsedResults
            .map((rec) => rec.video_id)
            .filter((id) => validVideoIdsSet.has(id));
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
                        predicted_rating: watchedOver70VideoIds.has(
                          video._id.toString()
                        )
                          ? Math.min(rec.predicted_rating, 0.5) // Giảm rating cho video xem trên 70%
                          : rec.predicted_rating,
                        is_top_recommended: rec.is_top_recommended,
                      }
                    : null;
                })
                .filter((v) => v)
                .sort((a, b) => {
                  const aWatched = watchedOver70VideoIds.has(a._id.toString());
                  const bWatched = watchedOver70VideoIds.has(b._id.toString());
                  if (aWatched && !bWatched) return 1; // Đẩy video xem trên 70% xuống dưới
                  if (!aWatched && bWatched) return -1;
                  return b.predicted_rating - a.predicted_rating; // Sắp xếp theo rating
                });

              // Đảm bảo chỉ top 5 video không xem trên 70% được đánh dấu is_top_recommended
              let topCount = 0;
              for (let video of sortedVideos) {
                video.is_top_recommended =
                  !watchedOver70VideoIds.has(video._id.toString()) &&
                  topCount < 5;
                if (video.is_top_recommended) topCount++;
              }

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
          Video.find()
            .sort({ views: -1 })
            .populate("user_id")
            .lean()
            .then((videos) => {
              const sortedVideos = videos
                .map((video) => ({
                  ...video,
                  predicted_rating: watchedOver70VideoIds.has(
                    video._id.toString()
                  )
                    ? 0
                    : video.views / 1000,
                  is_top_recommended: false,
                }))
                .sort((a, b) => {
                  const aWatched = watchedOver70VideoIds.has(a._id.toString());
                  const bWatched = watchedOver70VideoIds.has(b._id.toString());
                  if (aWatched && !bWatched) return 1;
                  if (!aWatched && bWatched) return -1;
                  return b.predicted_rating - a.predicted_rating;
                });
              console.log(
                `Tổng số video trong dự phòng lỗi phân tích: ${sortedVideos.length}`
              );
              resolve({
                message:
                  "Lỗi phân tích kết quả đề xuất, trả về tất cả video sắp xếp theo lượt xem",
                data: {
                  videos: sortedVideos,
                  total: sortedVideos.length,
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
    const videos = await Video.find()
      .sort({ views: -1 })
      .populate("user_id")
      .lean();
    const sortedVideos = videos
      .map((video) => ({
        ...video,
        predicted_rating: watchedOver70VideoIds.has(video._id.toString())
          ? 0
          : video.views / 1000,
        is_top_recommended: false,
      }))
      .sort((a, b) => {
        const aWatched = watchedOver70VideoIds.has(a._id.toString());
        const bWatched = watchedOver70VideoIds.has(b._id.toString());
        if (aWatched && !bWatched) return 1;
        if (!aWatched && bWatched) return -1;
        return b.predicted_rating - a.predicted_rating;
      });
    console.log(`Tổng số video trong dự phòng catch: ${sortedVideos.length}`);
    return {
      message:
        "Lỗi trong dịch vụ đề xuất, trả về tất cả video sắp xếp theo lượt xem",
      data: {
        videos: sortedVideos,
        total: sortedVideos.length,
        page: 1,
        pages: 1,
      },
    };
  }
};

module.exports = { getRecommendationsService };
