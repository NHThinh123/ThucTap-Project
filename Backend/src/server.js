require("dotenv").config();
require("./cron");
const express = require("express");
const configViewEngine = require("./configs/viewEngine");
const connectDB = require("./configs/database");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const SSE = require("express-sse");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

const userRoute = require("./routes/user.route");
const uploadRoute = require("./routes/upload.route");
const videoRoute = require("./routes/video.route");
const playlistRoute = require("./routes/playlist.route");
const reviewRoute = require("./routes/review.route");
const userLikeVideoRoute = require("./routes/user_like_video.route");
const userDislikeVideoRoute = require("./routes/user_dislike_video.route");
const commentRoute = require("./routes/comment.route");
const subscriptionRoutes = require("./routes/subscription.route");
const playlistVideoRoute = require("./routes/playlist_video.route");
const historyRoute = require("./routes/history.route");
const statsRoutes = require("./routes/stats.route");

const sse = new SSE();
app.use(cors());
app.use(express.json({ limit: "5gb" })); // Hỗ trợ JSON payload lớn
app.use(express.urlencoded({ extended: true, limit: "5gb" })); // Hỗ trợ form data lớn

// Phục vụ file tĩnh (video và thumbnail)
app.use("/videos", express.static(path.join(__dirname, "public/videos")));
app.use(
  "/thumbnails",
  express.static(path.join(__dirname, "public/thumbnails"))
);

configViewEngine(app);

// SSE endpoint
app.get("/api/upload/progress", sse.init);
app.set("sse", sse);

// Routes
app.use("/api/users", userRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/video", videoRoute);
app.use("/api", subscriptionRoutes);
app.use("/api/playlist", playlistRoute);
app.use("/api/review", reviewRoute);
app.use("/api/user-like-video", userLikeVideoRoute);
app.use("/api/user-dislike-video", userDislikeVideoRoute);
app.use("/api/comment", commentRoute);
app.use("/api/playlist-video", playlistVideoRoute);
app.use("/api/history", historyRoute);
app.use("/api/stats", statsRoutes);

// Middleware xử lý lỗi
app.use(errorHandler);

(async () => {
  try {
    await connectDB();
    console.log("Kết nối cơ sở dữ liệu thành công");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Backend Nodejs App đang chạy trên cổng ${port}`);
    });
  } catch (error) {
    console.log(">>> Lỗi kết nối cơ sở dữ liệu: ", error);
    process.exit(1);
  }
})();
