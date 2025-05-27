import axios from "../../../services/axios.customize";

const dislikeVideoApi = ({ user_id, video_id }) => {
  const URL_API = `/api/user-dislike-video/dislike`;
  return axios.put(URL_API, { user_id, video_id });
};

const undislikeVideoApi = ({ user_id, video_id }) => {
  const URL_API = `/api/user-dislike-video/undislike`;
  return axios.put(URL_API, { user_id, video_id });
};

const getUserDislikedVideosApi = (video_id) => {
  const URL_API = `/api/user-dislike-video/user/${video_id}`;
  return axios.get(URL_API);
};

const getVideoDislikesApi = (user_id) => {
  const URL_API = `/api/user-dislike-video/video/${user_id}`;
  return axios.get(URL_API);
};

const countDislikeVideoApi = (video_id) => {
  const URL_API = `/api/user-dislike-video/count/${video_id}`;
  return axios.get(URL_API);
};

const getUserDislikeStatusApi = (data) => {
  const URL_API = `/api/user-dislike-video/status`;
  return axios.post(URL_API, data);
};

export {
  dislikeVideoApi,
  undislikeVideoApi,
  getUserDislikedVideosApi,
  getVideoDislikesApi,
  countDislikeVideoApi,
  getUserDislikeStatusApi,
};
