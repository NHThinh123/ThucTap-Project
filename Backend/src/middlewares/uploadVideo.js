const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/videos")); // Lưu trực tiếp vào thư mục videos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadVideoMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // Giới hạn 5GB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv/;
    const mimetypes =
      /video\/mp4|video\/quicktime|video\/x-msvideo|video\/x-matroska/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = mimetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Lỗi: Định dạng file không được hỗ trợ!"));
  },
});

module.exports = uploadVideoMiddleware;
