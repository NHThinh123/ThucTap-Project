import axios from "../../../services/axios.customize";

const getUserPlaylists = (user_id) => {
  const URL_API = `/api/playlists/user/${user_id}`;
  return axios.get(URL_API);
};

const createPlaylist = (data) => {
  const URL_API = `/api/playlist/`;
  return axios.post(URL_API, data);
};
const addVideoToPlaylist = (playlist_id, video_id) => {
  const URL_API = `/api/playlist-video/`;
  return axios.post(URL_API, { playlist_id, video_id });
};

export { getUserPlaylists, createPlaylist, addVideoToPlaylist };
