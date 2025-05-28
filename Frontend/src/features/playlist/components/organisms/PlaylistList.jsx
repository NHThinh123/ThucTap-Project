import { List, Button } from "antd";
import { useAddVideoToPlaylist } from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";

const PlaylistList = ({ playlists, videoId }) => {
  const { mutate: addVideo, isPending } = useAddVideoToPlaylist();
  const { closeModal } = useModal();

  const handleAddToPlaylist = (playlistId) => {
    addVideo({ playlistId, videoId }, { onSuccess: closeModal });
  };

  return (
    <List
      loading={isPending}
      dataSource={playlists}
      renderItem={(playlist) => (
        <List.Item>
          <span>{playlist.title_playlist}</span>
          <Button onClick={() => handleAddToPlaylist(playlist._id)}>
            Add to Playlist
          </Button>
        </List.Item>
      )}
    />
  );
};

export default PlaylistList;
