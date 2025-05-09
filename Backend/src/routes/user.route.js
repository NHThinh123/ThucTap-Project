const express = require("express");
const router = express.Router();
const path = require('path');
const { signup, signin, getUserById, getListUser, updateUser, uploadAvatar, requestPasswordReset, resetPassword, getEmail } = require("../controllers/user.controller");
const upload = require("../middlewares/uploadImage");

//Đăng kí
router.post("/signup", upload.single('avatar'), signup);

//lấy thông tin người dùng qua id
router.get('/id/:id', getUserById);
//cập nhật thông tin người dùng
router.put('/update/:id', upload.single('avatar'), updateUser, (req, res) => {
});

router.post("/upload-avatar", upload.single('avatar'), uploadAvatar);
//đăng nhập
router.post("/login", signin);
//Gửi yêu cầu đặt lại mật khẩu
router.post("/reset-password-request", requestPasswordReset);

router.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/reset-password.html"));
});
//Đặt lại mật khẩu
router.post("/reset-password/:token", resetPassword);
//Lấy email
router.get("/get-email/:token", getEmail);

module.exports = router;
