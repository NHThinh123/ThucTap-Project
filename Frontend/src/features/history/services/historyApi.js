import axios from "../../../services/axios.customize";

// Lấy toàn bộ lịch sử của 1 user
const getAllHistoriesOfUserApi = (userId) => {
  const URL_API = `/api/history/user/${userId}`;
  return axios.get(URL_API);
};

// Tạo lịch sử mới
const createHistoryApi = (data) => {
  const URL_API = `/api/history`;
  return axios.post(URL_API, data);
};

// Cập nhật thời lượng đã xem
const updateWatchDurationApi = (id, watch_duration) => {
  const URL_API = `/api/history/${id}`;
  return axios.patch(URL_API, { watch_duration });
};

// Xóa một lịch sử
const deleteHistoryApi = (id) => {
  const URL_API = `/api/history/${id}`;
  return axios.delete(URL_API);
};

// Xóa toàn bộ lịch sử của 1 user
const deleteAllHistoriesApi = (userId) => {
  const URL_API = `/api/history/user/${userId}`;
  return axios.delete(URL_API);
};

// Lấy 1 bản ghi lịch sử theo ID
const getHistoryByIdApi = (historyId) => {
  const URL_API = `/api/history/${historyId}`;
  return axios.get(URL_API);
};

export {
  getAllHistoriesOfUserApi,
  createHistoryApi,
  updateWatchDurationApi,
  deleteHistoryApi,
  deleteAllHistoriesApi,
  getHistoryByIdApi,
};
