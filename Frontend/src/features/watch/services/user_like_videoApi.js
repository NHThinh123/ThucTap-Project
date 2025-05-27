import axios from "../../../services/axios.customize";

const likeVideoApi = ({ user_id, video_id }) => {
  const URL_API = `/api/user-like-video/like`;
  return axios.put(URL_API, { user_id, video_id });
};

const unlikeVideoApi = ({ user_id, video_id }) => {
  const URL_API = `/api/user-like-video/unlike`;
  return axios.put(URL_API, { user_id, video_id });
};

const getUserLikedVideosApi = (video_id) => {
  const URL_API = `/api/user-like-video/user/${video_id}`;
  return axios.get(URL_API);
};

const getVideoLikesApi = (user_id) => {
  const URL_API = `/api/user-like-video/video/${user_id}`;
  return axios.get(URL_API);
};

const countLikeVideoApi = (video_id) => {
  const URL_API = `/api/user-like-video/count/${video_id}`;
  return axios.get(URL_API);
};

const getUserLikeStatusApi = (data) => {
  const URL_API = `/api/user-like-video/status`;
  return axios.post(URL_API, data);
};

export {
  likeVideoApi,
  unlikeVideoApi,
  getUserLikedVideosApi,
  getVideoLikesApi,
  countLikeVideoApi,
  getUserLikeStatusApi,
};
