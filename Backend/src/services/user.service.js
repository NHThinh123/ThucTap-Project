require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }
};

//lấy danh sách người dùng
const getListUserService = async () => {
  try {
    const users = await User.find({ deleted: false });
    return users.select("-password");
  } catch (error) {
    throw new Error("Lỗi server: " + error.message);
  }
};
//Tạo người dùng mới
const createUserService = async ({
  user_name,
  email,
  password,
  nickname,
  dateOfBirth,
  role
  
}) => {
  try {
    if (!user_name || !nickname || !email || !password || !dateOfBirth || !role) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_name,
      email,
      nickname,
      password: hashedPassword,
      dateOfBirth,
      role,
      
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Lỗi server: " + error.message);
  }
};
//Xóa người dùng
const deleteUserService = async (id) => {
  try {
    const user = await User.delete({ _id: id });
    if (!user) {
      throw new Error("Không tìm thấy user");
    }
    return { message: "Xóa user thành công" };
  } catch (error) {
    throw new Error("Lỗi server: " + error.message);
  }
};

module.exports = {
  getListUserService,
  checkUserCredentials,
  updateUserService,
  getUserByIdService,
  createUserService,
  deleteUserService,
};
