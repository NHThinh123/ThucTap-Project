const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", 
    allowed_formats: ["jpg", "png", "jpeg"], 
    transformation: [
      { width: 500, height: 500, crop: "limit" }, 
      { quality: "auto:best" }, 
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
