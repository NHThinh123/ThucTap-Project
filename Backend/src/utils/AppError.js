class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Xác định lỗi này do lập trình viên kiểm soát
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
