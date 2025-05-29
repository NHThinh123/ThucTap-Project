import { List, Button } from "antd";
import { useAddVideoToPlaylist } from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";

const PlaylistList = ({ playlists, videoId, isLoading }) => {
  const { mutate: addVideo, isPending } = useAddVideoToPlaylist();
  const { closeModal } = useModal();

  const handleAddToPlaylist = (playlistId) => {
    if (!playlistId || !videoId) {
      console.error("Missing playlistId or videoId", { playlistId, videoId });
      return;
    }
    addVideo({ playlistId, videoId }, { onSuccess: closeModal });
  };

  // Kiểm tra và xử lý dữ liệu an toàn
  if (isLoading) {
    return <List loading={true} />;
  }

  if (!Array.isArray(playlists)) {
    console.error("Playlists is not an array:", playlists);
    return <div>Error loading playlists</div>;
  }

  if (playlists.length === 0) {
    return <div>No playlists found. Create your first playlist below!</div>;
  }

  return (
    <List
      loading={isPending}
      dataSource={playlists}
      renderItem={(playlist) => (
        <List.Item>
          <span>{playlist.title_playlist}</span>
          <Button
            onClick={() => handleAddToPlaylist(playlist._id)}
            disabled={!playlist._id || !videoId}
          >
            Add to Playlist
          </Button>
        </List.Item>
      )}
    />
  );
};

export default PlaylistList;
