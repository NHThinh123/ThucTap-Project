import { useUserPlaylists } from "../../hooks/usePlayList";
import PlaylistList from "../organisms/PlaylistList";
import CreatePlaylistForm from "../organisms/PlayListForm";

const PlaylistModalContent = ({ video_id, user_id }) => {
  if (!video_id) {
    console.error(
      "PlaylistModalContent: video_id không được xác định. Vui lòng cung cấp video_id hợp lệ."
    );
  }
  if (!user_id) {
    console.error(
      "PlaylistModalContent: user_id không được xác định. Vui lòng cung cấp user_id hợp lệ."
    );
  }

  const { data: playlists, isLoading } = useUserPlaylists(user_id);
  const safePlaylist = Array.isArray(playlists) ? playlists : [];

  return (
    <div>
      <h3>Danh sách phát</h3>
      <PlaylistList
        playlists={safePlaylist}
        videoId={video_id}
        isLoading={isLoading}
        // Truyền video_id và user_id để sử dụng trong CreatePlaylistForm
        onCreatePlaylist={(video_id, user_id)}
      />
    </div>
  );
};

export default PlaylistModalContent;
