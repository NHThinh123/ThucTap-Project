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
