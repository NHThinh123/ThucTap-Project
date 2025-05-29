import axios from "../../../services/axios.customize";

// Đăng ký theo dõi channel
const subscribeApi = (userId, channelId) => {
  const URL_API = `/api/subscribe`;
  return axios.post(URL_API, { userId, channelId });
};

// Hủy đăng ký channel
const unsubscribeApi = (userId, channelId) => {
  const URL_API = `/api/unsubscribe`;
  return axios.post(URL_API, { userId, channelId });
};

// Lấy số lượng người đăng ký của channel
const getSubscriptionCountApi = (userId) => {
  const URL_API = `/api/subscriptions/${userId}/count`;
  return axios.get(URL_API);
};

// Lấy danh sách người đăng ký của channel
const getSubscribersApi = (userId) => {
  const URL_API = `/api/subscriptions/${userId}/subscribers`;
  return axios.get(URL_API);
};

// Lấy danh sách channel mà người dùng đã đăng ký
const getUserSubscriptionsApi = (userId) => {
  const URL_API = `/api/subscriptions/${userId}/getUserSubscriptions`;
  return axios.get(URL_API);
};

// Kiểm tra trạng thái đăng ký của người dùng với channel
const checkSubscriptionApi = (userId, channelId) => {
  const URL_API = `/api/subscriptions/check-subscription`;
  return axios.get(URL_API, {
    params: { user_id: userId, channel_id: channelId },
  });
};

// Lấy thông tin chi tiết của channel
const getChannelInfoApi = (channelId) => {
  const URL_API = `/api/subscriptions/channel-info/${channelId}`;
  return axios.get(URL_API);
};

export {
  subscribeApi,
  unsubscribeApi,
  getSubscriptionCountApi,
  getSubscribersApi,
  getUserSubscriptionsApi,
  checkSubscriptionApi,
  getChannelInfoApi,
};
