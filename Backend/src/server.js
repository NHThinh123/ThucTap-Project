require("dotenv").config();
const express = require("express");
const configViewEngine = require("./configs/viewEngine");
const connectDB = require("./configs/database");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const userRoute = require("./routes/user.route");
const playlistRoute = require("./routes/playlist.route");
const reviewRoute = require("./routes/review.route");
const userLikeVideoRoute = require("./routes/user_like_video.route");
const userDislikeVideoRoute = require("./routes/user_dislike_video.route");
const commentRoute = require("./routes/comment.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

app.use("/api/user", userRoute);
app.use("/api/playlist", playlistRoute);
app.use("/api/review", reviewRoute);
app.use("/api/user-like-video", userLikeVideoRoute);
app.use("/api/user-dislike-video", userDislikeVideoRoute);
app.use("/api/comment", commentRoute);
(async () => {
  try {
    await connectDB(); // Đợi kết nối database thành công
    console.log("Database connected successfully");

    // Khởi động server HTTP
    const server = app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connecting to DB: ", error);
    process.exit(1);
  }
})();
