import axios from "../../../services/axios.customize";

const getUserPlaylists = async (user_id) => {
  const URL_API = `/api/playlist/user/${user_id}`;
  const response = await axios.get(URL_API);
  return response?.data?.playlists || [];
};

const createPlaylist = async (data) => {
  const URL_API = `/api/playlist/`;
  const response = await axios.post(URL_API, data);
  return response?.data?.playlists;
};

const addVideoToPlaylist = async ({ playlistId, videoId }) => {
  const URL_API = `/api/playlist-video/`;
  const response = await axios.post(URL_API, {
    playlist_id: playlistId,
    video_id: videoId,
  });
  return response.data;
};

const getVideosInPlaylist = async (playlistId) => {
  const URL_API = `/api/playlist-video/${playlistId}`;
  const response = await axios.get(URL_API);
  return response?.data?.videos || [];
};

const deletePlaylist = async ({ playlistId, userId }) => {
  const URL_API = `/api/playlist/${playlistId}?userId=${userId}`;
  const response = await axios.delete(URL_API);
  return response.data;
};

const removeVideoFromPlaylist = async ({ playlistId, videoId }) => {
  const URL_API = `/api/playlist-video/`;
  const response = await axios.delete(URL_API, {
    data: {
      playlist_id: playlistId,
      video_id: videoId,
    },
  });
  return response.data;
};

const getVideoByIdApi = async (id) => {
  const URL_API = `/api/video/${id}`;
  const response = await axios.get(URL_API);
  return response?.video || {};
};

export {
  getUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  getVideosInPlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
  getVideoByIdApi,
};
