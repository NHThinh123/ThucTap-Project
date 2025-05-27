const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickname: { type: String },
    dateOfBirth: { type: Date },
    role: { type: String, required: true, enum: ["user", "admin"] },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg",
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

// Thêm plugin xóa mềm
userSchema.plugin(mongooseDelete, {
  deletedAt: true, // Tự động thêm trường `deletedAt`
  overrideMethods: "all", // Ghi đè các phương thức mặc định (find, findOne, count...)
});

const User = mongoose.model("User", userSchema);

module.exports = User;
