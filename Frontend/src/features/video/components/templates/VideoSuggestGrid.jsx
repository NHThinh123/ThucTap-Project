import { useContext } from "react";
import useHistory from "../../../history/hooks/useHistory";
import { AuthContext } from "../../../../contexts/auth.context";
import VideoSuggestCard from "./VideoSuggestCard";

const VideoSuggestGrid = ({ videos }) => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading } = useHistory(auth?.user?.id);
  if ((!videos && isLoading) || !Array.isArray(videos)) return null;
  // Hàm tìm watch_duration từ HistoryData theo video.id
  const getWatchDuration = (videoId) => {
    if (!HistoryData?.data?.histories) return 0;

    for (const history of HistoryData.data.histories) {
      for (const vid of history.videos) {
        if (vid.video_id._id === videoId) {
          return vid.watch_duration;
        }
      }
    }
    return 0;
  };
  return (
    <>
      {videos.map((video) => (
        <VideoSuggestCard
          video={video}
          watchDuration={getWatchDuration(video._id)}
        />
      ))}
    </>
  );
};

export default VideoSuggestGrid;
