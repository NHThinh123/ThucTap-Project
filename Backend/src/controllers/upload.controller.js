const {
  uploadImageService,
  uploadVideoService,
} = require("../services/upload.service");

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const data = await uploadImageService(req.file);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }
    const data = await uploadVideoService(req.file, req.app.get("sse"));
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadVideo,
};
