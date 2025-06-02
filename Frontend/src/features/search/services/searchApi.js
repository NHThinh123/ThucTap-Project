import axios from "../../../services/axios.customize";

const searchVideosApi = (queryParams) => {
  const URL_API = `/api/video/search`;
  return axios.get(URL_API, { params: queryParams });
};

const getSearchSuggestionsApi = (queryParams) => {
  const URL_API = `/api/video/suggestions`;
  return axios.get(URL_API, { params: queryParams });
};

export { searchVideosApi, getSearchSuggestionsApi };
