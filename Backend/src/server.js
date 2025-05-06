require("dotenv").config();
const express = require("express");

const connectDB = require("./configs/database");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
