const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ file tạm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `video-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Middleware upload video
const uploadVideoMiddleware = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Giới hạn 200MB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv/;
    const mimetypes =
      /video\/mp4|video\/quicktime|video\/x-msvideo|video\/x-matroska/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }

    // Thông báo lỗi chi tiết hơn
    const errorMessage = `Invalid file format. Only mp4, mov, avi, mkv files are allowed. Received: extension=${path.extname(
      file.originalname
    )}, mimetype=${file.mimetype}`;
    cb(new Error(errorMessage));
  },
});

module.exports = uploadVideoMiddleware;
