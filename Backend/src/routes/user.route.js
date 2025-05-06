const express = require("express");
const router = express.Router();
const path = require("path");
const { helloUser } = require("../controllers/user.controller");

router.get("/", helloUser);

module.exports = router;
