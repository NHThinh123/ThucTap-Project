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

export { getVideoApi, getVideoByIdApi, incrementViewApi };
