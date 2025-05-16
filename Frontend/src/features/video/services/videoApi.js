import axios from "../../../services/axios.customize";

const getVideoApi = () => {
  const URL_API = `/api/video`;
  return axios.get(URL_API);
};

export { getVideoApi };
