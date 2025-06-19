import axios from "../../../services/axios.customize";

const getUserStats = ({ userId, period, startDate, endDate }) => {
  const URL_API = `/api/stats/user/${userId}`;

  return axios.get(URL_API, {
    params: {
      period,
      startDate,
      endDate,
    },
  });
};
const getChannelOverview = ({ userId }) => {
  const URL_API = `/api/stats/overview/${userId}`;
  return axios.get(URL_API);
};

const getNewestVideoAnalysis = ({ userId }) => {
  const URL_API = `/api/stats/newest/${userId}`;
  return axios.get(URL_API);
};

const getSubscribers = ({ userId }) => {
  const URL_API = `api/subscriptions/${userId}/subscribers`;
  return axios.get(URL_API);
};

export {
  getUserStats,
  getChannelOverview,
  getNewestVideoAnalysis,
  getSubscribers,
};
