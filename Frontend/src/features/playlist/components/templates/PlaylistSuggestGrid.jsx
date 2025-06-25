import { useContext } from "react";
import VideoSuggestCard from "../../../video/components/templates/VideoSuggestCard";
import { AuthContext } from "../../../../contexts/auth.context";
import useHistory from "../../../history/hooks/useHistory";
import PlayListSuggestCard from "../organisms/PlayListSuggestCard";

const PlaylistSuggestGrid = ({ videos, playlist_id }) => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading } = useHistory(auth?.user?.id);
  if ((!videos && isLoading) || !Array.isArray(videos)) return null;
  // Hàm tìm watch_duration từ HistoryData theo video.id
  const getWatchDuration = (videoId) => {
    if (!HistoryData?.data?.histories) return 0;

    for (const history of HistoryData.data.histories) {
      for (const vid of history.videos) {
        if (vid?.video_id?._id === videoId) {
          return vid.watch_duration;
        }
      }
    }
    return 0;
  };
  return (
    <div
      style={{
        padding: "8px",
        border: "1px solid #8c8c8c",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Danh sách phát</h2>
      {videos.map((video) => (
        <PlayListSuggestCard
          video={video}
          watchDuration={getWatchDuration(video._id)}
          playlist_id={playlist_id}
        />
      ))}
    </div>
  );
};

export default PlaylistSuggestGrid;
