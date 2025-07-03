const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const retry = require("async-retry");

const VIDEO_STORAGE_PATH = path.join(__dirname, "../public/videos");
const THUMBNAIL_STORAGE_PATH = path.join(__dirname, "../public/thumbnails");
const BASE_URL = process.env.BASE_URL || "http://localhost:3003";

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
    if (!file || !file.path) {
      throw new Error("No file uploaded or invalid file");
    }

    const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > MAX_SIZE) {
      throw new Error("Video size exceeds 5GB limit");
    }

    const inputPath = file.path;
    const outputFilename = `${Date.now()}-compressed-${file.originalname}`;
    const outputPath = path.join(VIDEO_STORAGE_PATH, outputFilename);
    const thumbnailFilename = `${Date.now()}-thumb.jpg`;
    const thumbnailPath = path.join(THUMBNAIL_STORAGE_PATH, thumbnailFilename);
    const videoUrl = `${BASE_URL}/videos/${outputFilename}`;
    const thumbnailUrl = `${BASE_URL}/thumbnails/${thumbnailFilename}`;

    let uploadedBytes = 0;
    const totalSize = file.size;

    // Hàm nén video
    const compressVideo = () =>
      new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .output(outputPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions([
            "-crf 28",
            "-preset veryfast",
            "-movflags +faststart",
            "-threads 0",
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
                  count: 1,
                  folder: THUMBNAIL_STORAGE_PATH,
                  filename: thumbnailFilename,
                  size: "320x180",
                  timestamps: ["10%"],
                })
                .on("end", () => res())
                .on("error", (err) => rej(err));
            });

            // Lấy metadata của video đã nén
            const metadata = await new Promise((res, rej) => {
              ffmpeg.ffprobe(outputPath, (err, data) => {
                if (err) return rej(err);
                res(data);
              });
            });

            // Xóa file gốc sau khi nén
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
            reject(new Error(`Video compression failed: ${err.message}`));
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
      message: "Video compressed and uploaded successfully",
      data: uploadResult,
    };
  } catch (error) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    sse.send({ error: error.message }, "error");
    throw new Error(`Error processing video: ${error.message}`);
  }
};

module.exports = {
  uploadImageService,
  uploadVideoService,
};
