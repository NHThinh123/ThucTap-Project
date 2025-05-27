const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const retry = require("async-retry");

// Định nghĩa thư mục lưu trữ video và thumbnail
const VIDEO_STORAGE_PATH = path.join(__dirname, "../public/videos");
const THUMBNAIL_STORAGE_PATH = path.join(__dirname, "../public/thumbnails");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // URL cơ sở của server, cấu hình trong .env

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(VIDEO_STORAGE_PATH)) {
  fs.mkdirSync(VIDEO_STORAGE_PATH, { recursive: true });
}
if (!fs.existsSync(THUMBNAIL_STORAGE_PATH)) {
  fs.mkdirSync(THUMBNAIL_STORAGE_PATH, { recursive: true });
}

const uploadImageService = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error("No file uploaded or invalid file");
    }

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        img_url: file.path,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        public_id: file.filename.split(".")[0],
      },
    };
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

const uploadVideoService = async (file, sse) => {
  try {
    // Kiểm tra file hợp lệ
    if (!file || !file.path) {
      throw new Error(
        "Không có file video được tải lên hoặc file không hợp lệ"
      );
    }

    // Giới hạn kích thước file: 5GB
    const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > MAX_SIZE) {
      throw new Error("Kích thước video vượt quá giới hạn 5GB");
    }

    const inputPath = file.path;
    const outputFilename = `${Date.now()}-${file.originalname}`;
    const outputPath = path.join(VIDEO_STORAGE_PATH, outputFilename);
    const thumbnailFilename = `${Date.now()}-thumb.jpg`;
    const thumbnailPath = path.join(THUMBNAIL_STORAGE_PATH, thumbnailFilename);
    const videoUrl = `${BASE_URL}/videos/${outputFilename}`; // URL tuyệt đối cho video
    const thumbnailUrl = `${BASE_URL}/thumbnails/${thumbnailFilename}`; // URL tuyệt đối cho thumbnail

    let uploadedBytes = 0;
    const totalSize = file.size;

    // Hàm nén video và tạo thumbnail
    const compressVideo = () =>
      new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .output(outputPath)
          .videoCodec("libx264") // Codec H.264 để nén
          .audioCodec("aac") // Codec AAC cho âm thanh
          .outputOptions([
            "-crf 28", // Mức nén
            "-preset fast", // Tốc độ nén nhanh
            "-movflags +faststart", // Tối ưu cho phát trực tuyến
          ])
          .on("progress", (progress) => {
            if (progress.bytesWritten) {
              uploadedBytes = progress.bytesWritten;
              const percentage = Math.round((uploadedBytes / totalSize) * 100);
              sse.send({ progress: percentage }, "progress");
            }
          })
          .on("end", async () => {
            // Tạo thumbnail
            await new Promise((res, rej) => {
              ffmpeg(inputPath)
                .screenshots({
                  count: 1, // Lấy 1 khung hình
                  folder: THUMBNAIL_STORAGE_PATH,
                  filename: thumbnailFilename,
                  size: "320x180", // Kích thước thumbnail
                  timestamps: ["10%"], // Lấy khung hình tại 10% thời lượng video
                })
                .on("end", () => res())
                .on("error", (err) => rej(err));
            });

            // Lấy metadata của video
            const metadata = await new Promise((res, rej) => {
              ffmpeg.ffprobe(outputPath, (err, data) => {
                if (err) return rej(err);
                res(data);
              });
            });

            // Xóa file tạm
            if (fs.existsSync(inputPath)) {
              fs.unlinkSync(inputPath);
            }

            resolve({
              video_url: videoUrl,
              thumbnail: thumbnailUrl,
              public_id: outputFilename,
              filename: file.originalname,
              size: fs.statSync(outputPath).size,
              mimetype: file.mimetype || "video/mp4",
              duration: metadata.format.duration || 0,
              width: metadata.streams[0].width,
              height: metadata.streams[0].height,
              format: metadata.format.format_name,
            });
          })
          .on("error", (err) => {
            if (fs.existsSync(inputPath)) {
              fs.unlinkSync(inputPath);
            }
            reject(new Error(`Nén video thất bại: ${err.message}`));
          })
          .run();
      });

    // Thử lại nếu nén thất bại
    const uploadResult = await retry(async () => compressVideo(), {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 5000,
    });

    sse.send({ progress: 100 }, "progress");

    return {
      message: "Video được nén và lưu cục bộ thành công",
      data: uploadResult,
    };
  } catch (error) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    sse.send({ error: error.message }, "error");
    throw new Error(`Lỗi khi xử lý video: ${error.message}`);
  }
};
module.exports = {
  uploadImageService,
  uploadVideoService,
};
