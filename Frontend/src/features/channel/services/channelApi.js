import axios from "../../../services/axios.customize";

const getVideoChannel = (params) => {
  const URL_API = `/api/video/recommend/68215cf0f305a48f952f8265`;
  return axios.get(URL_API, { params });
};

export { getVideoChannel };
