import { Row, Col } from "antd";
import VideoCard from "./VideoCard";
import { AuthContext } from "../../../../contexts/auth.context";
import useHistory from "../../../history/hooks/useHistory";
import { useContext } from "react";

const VideoGrid = ({ videos, xxl, isShow }) => {
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
    <Row gutter={[20, 30]}>
      {videos.map((video) => (
        <Col
          key={video.id}
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={xxl || 8}
          xxl={xxl || 6}
        >
          <VideoCard
            video={video}
            isShow={isShow}
            watchDuration={getWatchDuration(video._id)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default VideoGrid;
