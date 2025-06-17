import axios from "../../../services/axios.customize";

const getAllHistoriesOfUserApi = (userId) => {
  const URL_API = `/api/history/user/${userId}`;
  return axios.get(URL_API);
};

const createHistoryApi = async (data) => {
  const response = await axios.post(`/api/history`, data);
  return response.data;
};

const updateWatchDurationApi = async ({ id, watch_duration }) => {
  const response = await axios.patch(`/api/history/${id}`, { watch_duration });
  return response.data;
};

const deleteHistoryApi = async (id) => {
  const response = await axios.delete(`/api/history/${id}`);
  return response.data;
};

const deleteAllHistoriesApi = async (userId) => {
  const response = await axios.delete(`/api/history/user/${userId}`);
  return response.data;
};

export {
  getAllHistoriesOfUserApi,
  createHistoryApi,
  updateWatchDurationApi,
  deleteHistoryApi,
  deleteAllHistoriesApi,
};
