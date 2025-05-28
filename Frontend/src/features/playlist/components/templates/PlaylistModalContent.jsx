import { useUserPlaylists } from "../../hooks/usePlayList";
import PlaylistList from "../organisms/PlaylistList";
import CreatePlaylistForm from "../organisms/PlayListForm";

const PlaylistModalContent = ({ video_id, user_id }) => {
  if (!video_id) {
    console.error(
      "PlaylistModalContent: video_id is undefined. Please provide a valid video_id."
    );
  }
  if (!user_id) {
    console.error(
      "PlaylistModalContent: user_id is undefined. Please provide a valid user_id."
    );
  }
  const { data: playlists = [], isLoading } = useUserPlaylists(user_id);

  return (
    <div>
      <h3>Select a Playlist</h3>
      <PlaylistList
        playlists={playlists}
        video_id={video_id}
        isLoading={isLoading}
      />
      <CreatePlaylistForm user_id={user_id} video_id={video_id} />
    </div>
  );
};

export default PlaylistModalContent;
