const {
  uploadImageService,
  uploadVideoService,
} = require("../services/upload.service");

function fixUrl(url, req) {
  if (url && url.includes('localhost')) {
    const protocol = req.protocol;
    const host = req.headers.host;
    return url.replace(/http:\/\/localhost:\d+/, `${protocol}://${host}`);
  }
  return url;
}

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const data = await uploadImageService(req.file);
    if (data?.data?.img_url) {
      data.data.img_url = fixUrl(data.data.img_url, req);
    }
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
    if (data?.data?.video_url) {
      data.data.video_url = fixUrl(data.data.video_url, req);
    }
    if (data?.data?.thumbnail) {
      data.data.thumbnail = fixUrl(data.data.thumbnail, req);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadVideo,
};
