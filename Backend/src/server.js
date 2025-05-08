require("dotenv").config();
const express = require("express");
const configViewEngine = require("./configs/viewEngine");
const connectDB = require("./configs/database");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const SSE = require("express-sse");

const app = express();
const port = process.env.PORT || 5000;

const userRoute = require("./routes/user.route");
const uploadRoute = require("./routes/upload.route");
const videoRoute = require("./routes/video.route"); // Thêm route mới
const playlistRoute = require("./routes/playlist.route");
const reviewRoute = require("./routes/review.route");
const userLikeVideoRoute = require("./routes/user_like_video.route");
const userDislikeVideoRoute = require("./routes/user_dislike_video.route");
const commentRoute = require("./routes/comment.route");

const sse = new SSE();
app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
configViewEngine(app);

// SSE endpoint
app.get("/api/upload/progress", sse.init);
app.set("sse", sse);

// Routes
app.use("/api/users", userRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/video", videoRoute); // Thêm route mới

// Middleware xử lý lỗi
app.use(errorHandler);

app.use("/api/playlist", playlistRoute);
app.use("/api/review", reviewRoute);
app.use("/api/user-like-video", userLikeVideoRoute);
app.use("/api/user-dislike-video", userDislikeVideoRoute);
app.use("/api/comment", commentRoute);
(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const server = app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connecting to DB: ", error);
    process.exit(1);
  }
})();
