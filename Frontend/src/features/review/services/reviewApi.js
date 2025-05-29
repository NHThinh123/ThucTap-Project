import axios from "../../../services/axios.customize";

// Lấy tất cả đánh giá của video
const getVideoReviewsApi = (videoId) => {
  const URL_API = `/api/review/video/${videoId}`;
  return axios.get(URL_API);
};

// Lấy tất cả đánh giá của user
const getUserReviewsApi = (userId) => {
  const URL_API = `/api/review/user/${userId}`;
  return axios.get(URL_API);
};

// Kiểm tra user đã đánh giá video chưa
const getUserReviewForVideoApi = (userId, videoId) => {
  const URL_API = `/api/review/user/${userId}/video/${videoId}`;
  return axios.get(URL_API);
};

// Đếm số lượng đánh giá của video
const getVideoReviewsCountApi = (videoId) => {
  const URL_API = `/api/review/video/${videoId}/count`;
  return axios.get(URL_API);
};

// Lấy điểm trung bình của video
const getVideoAverageRatingApi = (videoId) => {
  const URL_API = `/api/review/video/${videoId}/average`;
  return axios.get(URL_API);
};

// Tạo hoặc cập nhật đánh giá (POST, truyền user_id, video_id, review_rating)
const createOrUpdateReviewApi = (reviewData) => {
  const URL_API = `/api/review`;
  return axios.post(URL_API, reviewData);
};

// Lấy đánh giá theo ID
const getReviewApi = (id) => {
  const URL_API = `/api/review/${id}`;
  return axios.get(URL_API);
};

// Xóa đánh giá theo ID
const deleteReviewApi = (id) => {
  const URL_API = `/api/review/${id}`;
  return axios.delete(URL_API);
};

// Xóa tất cả đánh giá của video
const deleteAllVideoReviewsApi = (videoId) => {
  const URL_API = `/api/review`;
  return axios.delete(URL_API, {
    data: { video_id: videoId },
  });
};

export {
  getVideoReviewsApi,
  getUserReviewsApi,
  getUserReviewForVideoApi,
  getVideoReviewsCountApi,
  getVideoAverageRatingApi,
  createOrUpdateReviewApi,
  getReviewApi,
  deleteReviewApi,
  deleteAllVideoReviewsApi,
};
