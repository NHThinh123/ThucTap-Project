require("dotenv").config();
const express = require("express");
const configViewEngine = require("./configs/viewEngine");
const connectDB = require("./configs/database");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const userRoute = require("./routes/user.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

app.use("/api/user", userRoute);

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
