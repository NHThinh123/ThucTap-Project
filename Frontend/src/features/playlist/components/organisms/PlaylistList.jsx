import { List, Button } from "antd";
import { useAddVideoToPlaylist } from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";
import { useState } from "react";

const PlaylistList = ({ playlists, videoId, isLoading }) => {
  const { mutate: addVideo, isPending } = useAddVideoToPlaylist();
  const { closeModal } = useModal();
  const [visibleCount, setVisibleCount] = useState(2); // Initially show 2 playlists

  const handleAddToPlaylist = (playlistId) => {
    if (!playlistId || !videoId) {
      console.log("videoId in PlaylistList:", videoId);
      console.error("Missing playlistId or videoId", { playlistId, videoId });
      return;
    }

    // Ensure both IDs are valid strings
    const validPlaylistId = String(playlistId).trim();
    const validVideoId = String(videoId).trim();

    addVideo(
      {
        playlistId: validPlaylistId,
        videoId: validVideoId,
      },
      {
        onSuccess: closeModal,
        onError: (error) => {
          console.error("Add video error:", error);
        },
      }
    );
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Load 5 more playlists
  };

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

  // Slice the playlists array to show only up to visibleCount
  const visiblePlaylists = playlists.slice(0, visibleCount);

  return (
    <div>
      <List
        loading={isPending}
        dataSource={visiblePlaylists}
        renderItem={(playlist) => (
          <List.Item>
            <span>{playlist.title_playlist}</span>
            <Button
              onClick={() => handleAddToPlaylist(playlist._id)}
              disabled={!playlist._id || !videoId}
            >
              Thêm
            </Button>
          </List.Item>
        )}
      />
      {visibleCount < playlists.length && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button onClick={handleLoadMore}>+</Button>
        </div>
      )}
    </div>
  );
};

export default PlaylistList;
