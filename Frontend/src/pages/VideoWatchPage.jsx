import VideoWatch from "../features/watch/components/templates/VideoWatch";
import VideoInformation from "../features/watch/components/templates/VideoInformation";
import VideoSuggest from "../features/watch/components/templates/VideoSuggest";
import VideoComment from "../features/watch/components/templates/VideoComment";
import { Col, Row } from "antd";

const VideoWatchPage = () => {
  return (
    <Row style={{ background: "#fff" }}>
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
