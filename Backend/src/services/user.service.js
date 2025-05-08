require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require('../models/user.model');


const getListUserService = async () => {
  let result = await User.find().select("-password");
  return result;
};


//câp nhật thông tin người dùng
const updateUserService = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
//lấy thông tin người dùng theo id
const getUserByIdService = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Kiểm tra thông tin đăng nhập
const checkUserCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid password');
  }

  return user;
};
module.exports = { getListUserService, checkUserCredentials, updateUserService, getUserByIdService };
