const path = require("path");

const validateImage = (req, res, next) => {
  const filetypes = /jpeg|jpg|png/ | /image\/jpeg|image\/jpg|image\/png/;
  const extname = filetypes.test(
    path.extname(req.file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(req.file.mimetype);

  if (extname && mimetype) {
    return next();
  }
  next(new Error("Only images (jpeg, jpg, png) are allowed"));
};

const validateVideoData = (req, res, next) => {
  const { video } = req.body;
  if (!video) {
    return res.status(400).json({ message: "No video data provided" });
  }
  next();
};

module.exports = { validateImage, validateVideoData };
