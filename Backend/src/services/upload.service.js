const { cloudinary } = require("../configs/cloudinary");
const fs = require("fs");
const retry = require("async-retry");

const uploadImageService = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error("No file uploaded or invalid file");
    }

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: file.path,
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
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
    const totalSize = file.size;

    // Kiểm tra kích thước
    const MAX_SIZE = 200 * 1024 * 1024; // 200MB
    if (totalSize > MAX_SIZE) {
      throw new Error("Video size exceeds 200MB limit");
    }

    let uploadedBytes = 0;

    // Tạo stream từ file
    const fileStream = fs.createReadStream(file.path);

    // Promise để xử lý kết quả từ Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "videos",
          chunk_size: CHUNK_SIZE,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            if (error.http_code === 413) {
              return reject(
                new Error(
                  "Upload failed: File size exceeds Cloudinary limit (100MB for free accounts)"
                )
              );
            }
            return reject(
              new Error(`Cloudinary upload failed: ${error.message}`)
            );
          }
          if (!result || !result.secure_url) {
            return reject(new Error("Cloudinary did not return a valid URL"));
          }
          resolve(result);
        }
      );

      // Theo dõi tiến độ
      fileStream.on("data", (chunk) => {
        uploadedBytes += chunk.length;
        const progress = Math.round((uploadedBytes / totalSize) * 100);
        sse.send({ progress }, "progress");
      });

      fileStream.on("error", (err) => {
        console.error("File stream error:", err);
        reject(new Error(`File stream error: ${err.message}`));
      });

      fileStream.pipe(uploadStream);
    });

    // Thử lại nếu upload thất bại
    const uploadResult = await retry(
      async () => {
        return uploadPromise;
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
      }
    );

    // Kiểm tra uploadResult
    //console.log("Cloudinary upload result:", uploadResult);

    // Xóa file tạm
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    sse.send({ progress: 100 }, "progress");
    return {
      message: "Video uploaded successfully to Cloudinary",
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        filename: uploadResult.original_filename || file.originalname,
        size: totalSize,
        mimetype: file.mimetype || "video/mp4",
        duration: uploadResult.duration || 0,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      },
    };
  } catch (error) {
    // Xóa file tạm nếu có lỗi
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    sse.send({ error: error.message }, "error");
    throw new Error(`Error uploading video: ${error.message}`);
  }
};

module.exports = {
  uploadImageService,
  uploadVideoService,
};
