import axios from "../../../services/axios.customize";

const getVideoChannel = (userId) => {
  if (!userId) {
    const URL_API = `/api/video/search`;
    return axios.get(URL_API, { params: { limit: 20, sort: "-views" } });
  }
  const URL_API = `/api/video/recommend/${userId}`;
  return axios.get(URL_API);
};

export { getVideoChannel };
