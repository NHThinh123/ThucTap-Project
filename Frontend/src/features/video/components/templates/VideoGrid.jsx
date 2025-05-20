import { Row, Col } from "antd";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos }) => {
  return (
    <Row gutter={[20, 30]}>
      {videos.map((video) => (
        <Col key={video.id} xs={24} sm={24} md={8} lg={8} xl={8} xxl={6}>
          <VideoCard video={video} />
        </Col>
      ))}
    </Row>
  );
};

export default VideoGrid;
