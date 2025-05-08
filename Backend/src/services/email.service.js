const bcrypt = require("bcrypt");
const transporter = require("../configs/emailConfig");
require("dotenv").config();
const User = require("../models/user.model");


const sendResetPasswordEmail = async (email, resetToken) => {
    const user = await User.findOne({ email });
    const resetLink = `http://localhost:3000/api/user/reset-password/${resetToken}`;


    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Đặt lại mật khẩu Yumzy",
        html: `<h1>Yumzy</h1>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản: <strong>${user.user_name || "bạn"}</strong>. Nhấn vào link bên dưới để tiếp tục:</p>
             <a href="${resetLink}">Đặt lại mật khẩu</a>
             <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
             <p><strong>Đội ngũ Yumzy</strong></p>
             <p>🌍 <a href="https://yumzy.com">yumzy.com</a> | 📧 support@yumzy.com</p>`,
    };

    await transporter.sendMail(mailOptions);
};


module.exports = {
    sendResetPasswordEmail
}