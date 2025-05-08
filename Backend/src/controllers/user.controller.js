const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require('path');
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { sendResetPasswordEmail } = require("../services/email.service");
const moment = require('moment');

const cloudinary = require("../config/cloudinary");
const {
  getListUserService,
  checkUserCredentials,
  updateUserService,
  getUserByIdService
} = require("../services/user.service");
const User = require("../models/user.model");
const ResetToken = require("../models/userResetpassword.model");

const getListUser = async (req, res, next) => {
  try {
    const data = await getListUserService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({
      message: "Thông tin người dùng",
      user: {
        id: user._id,
        user_name: user.name,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
      }
    });
  } catch (error) {
    next(error);
  }
};

//cập nhật thông tin người dùng
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_name, dateOfBirth, email, oldPassword, newPassword } = req.body;
    let updateData = {};
    console.log("req.body:", req.body);
    // Tìm user trước khi cập nhật
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    // Nếu có tên mới, thêm vào dữ liệu cập nhật
    if (user_name) {
      updateData.user_name = user_name;
    }

    // Nếu có dateOfBirth, kiểm tra hợp lệ rồi thêm vào dữ liệu cập nhật
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({ error: "Ngày sinh không hợp lệ!" });
      }
      updateData.dateOfBirth = dob;
    }
    //Nếu có email mới, kiểm tra hợp lệ rồi thêm vào dữ liệu và cập nhật
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email không hợp lệ!" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ error: "Email đã tồn tại!" });
      }
      updateData.email = email;
    }
    //Nếu có mật khẩu mới kiểm tra mật khẩu mới và cập nhật
    if (newPassword) {
      // Yêu cầu mật khẩu cũ nếu thay đổi mật khẩu
      if (!oldPassword) {
        return res.status(400).json({ error: "Vui lòng cung cấp mật khẩu cũ!" });
      }

      // So sánh mật khẩu cũ với mật khẩu trong DB
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Mật khẩu cũ không đúng!" });
      }

      // Kiểm tra định dạng mật khẩu mới bằng regex
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          error: "Mật khẩu mới phải dài ít nhất 8 ký tự, chứa ít nhất 1 chữ cái in hoa, 1 số và 1 ký tự đặc biệt trong @$!%*?&#!"
        });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Nếu có file ảnh mới => upload lên Cloudinary
    if (req.file) {
      updateData.avatar = req.file.path;

      // Nếu user có avatar cũ => Xóa ảnh cũ trên Cloudinary
      if (user.avatar && user.avatar.includes("cloudinary.com")) {
        try {
          const publicId = user.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Lỗi khi xóa ảnh cũ trên Cloudinary:", err);
        }
      }
    }

    // Cập nhật thông tin user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Chạy validator để kiểm tra dữ liệu hợp lệ
    });

    // Kiểm tra nếu cập nhật thất bại
    if (!updatedUser) {
      return res.status(500).json({ error: "Cập nhật thông tin thất bại!" });
    }

    // Trả về thông tin user sau khi cập nhật
    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: {
        id: updatedUser._id,
        user_name: updatedUser.user_name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        dateOfBirth: updatedUser.dateOfBirth,

      },
    });
  } catch (error) {
    console.error("Lỗi server khi cập nhật user:", error);
    res.status(500).json({ error: "Lỗi server. Vui lòng thử lại!" });
  }
};



//singup
const signup = async (req, res) => {
  try {
    let { user_name, email, password, nickname, dateOfBirth, role } = req.body;
    user_name = user_name.trim().replace(/\s+/g, ' ');
    email = email.trim();
    nickname = nickname.trim();
    dateOfBirth = dateOfBirth.trim();
    password = password.trim();
    role = role.trim();

    if (!user_name || !nickname || !email || !password || !dateOfBirth || !role) {
      return res.status(400).json({ message: "Dữ liệu trống" });
    }

    if (!/^[\p{L}\s]+$/u.test(user_name)) {
      return res.status(400).json({ status: "FAILED", message: "Tên đăng kí không hợp lệ." });
    }
    if (!/^[\p{L}\s]+$/u.test(nickname)) {
      return res.status(400).json({ status: "FAILED", message: "Tên kênh không hợp lệ." });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ status: "FAILED", message: "Email không hợp lệ" });
    }

    if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ status: "FAILED", message: "Ngày - Tháng - Năm không hợp lệ" });
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/.test(password)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Mật khẩu phải có chữ Hoa, chữ thường, số, ký tự đặc biệt và có độ dài lớn hơn 8 ký tự!"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Xử lý upload ảnh lên Cloudinary
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const newUser = new User({
      user_name,
      email,
      nickname,
      password: hashedPassword,
      dateOfBirth,
      role,
      avatar: avatarUrl
    });

    await newUser.save();

    res.status(201).json({
      status: "PENDING",
      message: "Tài khoản đã được tạo. Vui lòng kiểm tra email xác thực!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        dateOfBirth: newUser.dateOfBirth,
      }
    });

  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({
      status: "FAILED",
      message: "Lỗi server khi đăng ký người dùng"
    });
  }
};

//singin
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Thông tin đăng nhập trống"
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: "Email không tồn tại"
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        status: "FAILED",
        message: "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "FAILED",
        message: "Mật khẩu không hợp lệ"
      });
    }

    // Tạo JWT access token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Access token hết hạn sau 1 giờ
    );

    // Tạo refresh token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET, // Sử dụng secret key riêng cho refresh token
      { expiresIn: "7d" } // Refresh token hết hạn sau 7 ngày
    );

    // Lưu refresh token vào database
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      message: "Đã xảy ra lỗi khi kiểm tra người dùng hiện tại"
    });
  }
};

// Endpoint để làm mới access token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      status: "FAILED",
      message: "Refresh token không được cung cấp"
    });
  }

  try {
    // Tìm user với refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({
        status: "FAILED",
        message: "Refresh token không hợp lệ"
      });
    }

    // Xác minh refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: "FAILED",
          message: "Refresh token không hợp lệ hoặc đã hết hạn"
        });
      }

      // Tạo access token mới
      const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        status: "SUCCESS",
        message: "Access token đã được làm mới",
        accessToken: accessToken
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      message: "Đã xảy ra lỗi khi làm mới token"
    });
  }
};
// upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên" });
    }

    console.log("File đã upload:", req.file.path);
    res.json({ secure_url: req.file.path }); // Trả về URL ảnh sau khi upload lên Cloudinary
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    res.status(500).json({ message: "Lỗi upload ảnh", error });
  }
}
//Gửi yêu cầu đặt lại mật khẩu
const requestPasswordReset = async (req, res) => {
  console.log("Request body received:", req.body);
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email không được để trống!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Email không tồn tại!" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút

  await ResetToken.create({ userId: user._id, token: resetToken, expiresAt });

  await sendResetPasswordEmail(user.email, resetToken);

  res.status(200).json({ message: "Link đặt lại mật khẩu đã được gửi qua email!" });
};
//Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Mật khẩu không được để trống!" });
    }

    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken || !resetToken.userId || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu của user
    const updatedUser = await User.findByIdAndUpdate(
      resetToken.userId,
      { password: hashedPassword },
      { new: true } // Trả về user đã được cập nhật
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Không tìm thấy người dùng, đặt lại mật khẩu thất bại!" });
    }

    // Xóa token đặt lại mật khẩu sau khi sử dụng
    await ResetToken.findOneAndDelete({ token });

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập lại." });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu" });
  }
};
//Lấy email
const getEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Tìm token trong bảng ResetToken
    const resetRequest = await ResetToken.findOne({ token });

    if (!resetRequest) {
      return res.status(404).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Dùng userId để tìm user trong bảng Users
    const user = await User.findById(resetRequest.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Trả về email của người dùng
    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
  }
};


module.exports = {
  getListUser,
  updateUser,
  signup,
  signin,
  getUserById,
  uploadAvatar,
  requestPasswordReset,
  resetPassword,
  getEmail
};