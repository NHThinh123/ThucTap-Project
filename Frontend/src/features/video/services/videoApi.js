import axios from "../../../services/axios.customize";

const getVideoApi = () => {
  const URL_API = `/api/video`;
  return axios.get(URL_API);
};

const getVideoByIdApi = (id) => {
  const URL_API = `/api/video/${id}`;
  return axios.get(URL_API);
};

const incrementViewApi = ({ user_id, video_id }) => {
  const URL_API = `/api/video/increment-view/${video_id}`;
  return axios.put(URL_API, { user_id, video_id });
};

// Lấy danh sách video theo userId
const getVideosByUserIdApi = (userId) => {
  const URL_API = `/api/video/user/${userId}`;
  return axios.get(URL_API);
};

// Đếm số lượng video của userId
const countVideoOfUserIdApi = (userId) => {
  const URL_API = `/api/video/user/${userId}/count`;
  return axios.get(URL_API);
};

export {
  getVideoApi,
  getVideoByIdApi,
  incrementViewApi,
  getVideosByUserIdApi,
  countVideoOfUserIdApi,
};
