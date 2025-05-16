import VideoWatch from "../features/watch/components/templates/VideoWatch";
import VideoInformation from "../features/watch/components/templates/VideoInformation";
import VideoSuggest from "../features/video/components/templates/VideoSuggest";
import VideoComment from "../features/comment/components/templates/VideoComment";
import { Col, Row } from "antd";

const VideoWatchPage = () => {
  return (
    <Row style={{ background: "#fff" }} gutter={[8, 0]}>
      <Col span={16}>
        <VideoWatch />
        <VideoInformation />
        <VideoComment />
      </Col>
      <Col span={8}>
        <VideoSuggest />
      </Col>
    </Row>
  );
};

export default VideoWatchPage;
