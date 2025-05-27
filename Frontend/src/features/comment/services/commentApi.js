import axios from "../../../services/axios.customize";

const getVideoCommentsApi = (videoId) => {
  const URL_API = `/api/comment`;
  return axios.get(URL_API, {
    params: { video_id: videoId },
  });
};

// Tạo comment hoặc reply (POST, truyền user_id, video_id, comment_content, parent_comment_id)
const createCommentApi = (commentData) => {
  const URL_API = `/api/comment`;
  return axios.post(URL_API, commentData);
};

const getCommentApi = (id) => {
  const URL_API = `/api/comment/${id}`;
  return axios.get(URL_API);
};

const updateCommentApi = (id, commentData) => {
  const URL_API = `/api/comment/${id}`;
  return axios.patch(URL_API, commentData);
};

const deleteCommentApi = (id, user_id) => {
  const URL_API = `/api/comment/${id}`;
  // Truyền user_id vào body để backend xác thực quyền xóa
  return axios.delete(URL_API, { data: { user_id } });
};

export {
  getVideoCommentsApi,
  createCommentApi,
  getCommentApi,
  updateCommentApi,
  deleteCommentApi,
};
