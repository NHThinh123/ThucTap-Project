require("dotenv").config();
const bcrypt = require("bcrypt");

const User = require("../models/User.model");

const getListUserService = async () => {
  let result = await User.find().select("-password");
  return result;
};

const helloUserService = async () => {
  return {
    message: "Hello user!",
  };
};

module.exports = {
  getListUserService,
  helloUserService,
};
