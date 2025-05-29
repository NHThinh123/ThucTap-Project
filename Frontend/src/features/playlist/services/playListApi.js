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

const addVideoToPlaylist = async ({ playlistId, video_id }) => {
  const URL_API = `/api/playlist-video/`;
  const response = await axios.post(URL_API, {
    playlist_id: playlistId,
    video_id,
  });

  return response.data;
};

export { getUserPlaylists, createPlaylist, addVideoToPlaylist };
