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

export { getUserStats };
