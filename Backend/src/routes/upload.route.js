const express = require("express");
const router = express.Router();
const uploadImageMiddleware = require("../middlewares/uploadImage");
const uploadVideoMiddleware = require("../middlewares/uploadVideo");
const {
  validateImage,
  validateVideoData,
} = require("../middlewares/fileValidator");
const {
  uploadImage,
  uploadVideo,
} = require("../controllers/upload.controller");

router.post("/image", uploadImageMiddleware.single("image"), uploadImage);
router.post("/video", uploadVideoMiddleware.single("video"), uploadVideo);

module.exports = router;
