const express = require("express");
const router = express.Router();
const path = require("path");
const {
  signup,
  signin,
  getUserById,
  getListUser,
  updateUser,
  uploadAvatar,
  requestPasswordReset,
  resetPassword,
  getEmail,
  deleteUser,
  refreshToken,
  checkEmailExists,
  resetPasswordSimple,
} = require("../controllers/user.controller");
const upload = require("../middlewares/uploadImage");
const { protect, adminOnly } = require("../middlewares/admin");
const { checkUserCredentials } = require("../services/user.service");

//Đăng kí
router.post("/signup", upload.single("avatar"), signup);

//lấy thông tin người dùng qua id
router.get("/id/:id", getUserById);
//cập nhật thông tin người dùng
router.put(
  "/update/:id",
  upload.single("avatar"),
  updateUser,
  (req, res) => {}
);

router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);
//đăng nhập
router.post("/login", signin);
//refresh token
router.post("/refresh-token", refreshToken);
//Gửi yêu cầu đặt lại mật khẩu
router.post("/reset-password-request", requestPasswordReset);

// Kiểm tra email có tồn tại không (cho flow reset password đơn giản)
router.post("/check-email", checkEmailExists);

// Đặt lại mật khẩu đơn giản (không cần token)
router.post("/reset-password-simple", resetPasswordSimple);

router.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/reset-password.html"));
});
//Đặt lại mật khẩu
router.post("/reset-password/:token", resetPassword);
//Lấy email
router.get("/get-email/:token", getEmail);
//Lấy danh sách người dùng
router.get("/admin/list", protect, adminOnly, getListUser);
//Lấy thông tin người dùng qua id
router.get("/admin/get-user/:id", protect, adminOnly, getUserById);
//Tạo người dùng mới
router.post("/admin/create", protect, adminOnly, signup);
//Cập nhật thông tin người dùng
router.put("/admin/update/:id", protect, adminOnly, updateUser);
//Xóa người dùng
router.delete("/admin/delete/:id", protect, adminOnly, deleteUser);

module.exports = router;
