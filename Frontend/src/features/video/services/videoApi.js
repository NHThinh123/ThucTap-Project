import axios from "../../../services/axios.customize";

const getVideoApi = () => {
  const URL_API = `/api/video`;
  return axios.get(URL_API);
};

const getVideoByIdApi = (id) => {
  const URL_API = `/api/video/${id}`;
  return axios.get(URL_API);
};

export { getVideoApi, getVideoByIdApi };
