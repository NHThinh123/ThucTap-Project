import axios from "../../../services/axios.customize";

const getVideoChannel = ({ userId }) => {
  const URL_API = `/api/video/recommend/${userId}`;
  return axios.get(URL_API);
};

export { getVideoChannel };
