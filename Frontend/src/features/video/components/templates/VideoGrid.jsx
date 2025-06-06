import { Row, Col } from "antd";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos, xxl, isShow }) => {
  if (!videos || !Array.isArray(videos)) return null;
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
          <VideoCard video={video} isShow={isShow} />
        </Col>
      ))}
    </Row>
  );
};

export default VideoGrid;
