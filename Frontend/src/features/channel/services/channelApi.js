import axios from "../../../services/axios.customize";

const getVideoChannel = ({ userId }) => {
  const URL_API = userId
    ? `/api/video/recommend/${userId}`
    : `/api/video/recommend`;
  return axios.get(URL_API);
};

export { getVideoChannel };
