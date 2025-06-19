const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500; // Sử dụng status từ AppError nếu có
  const message = err.message || "Lỗi máy chủ nội bộ";
  res.status(status).json({
    message,
  });
};
module.exports = errorHandler;
