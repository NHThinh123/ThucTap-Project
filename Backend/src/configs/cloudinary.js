require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Initialize cloudinary configuration
configureCloudinary();

module.exports = { configureCloudinary, cloudinary };

