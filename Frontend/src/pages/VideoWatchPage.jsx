import VideoWatch from "../features/watch/components/templates/VideoWatch";
import VideoInformation from "../features/watch/components/templates/VideoInformation";
import VideoComment from "../features/comment/components/templates/VideoComment";
import useVideo from "../features/video/hooks/useVideo";
import { Col, Row } from "antd";
import VideoSuggestGrid from "../features/video/components/templates/VideoSuggestGrid";

const VideoWatchPage = () => {
  const { videoData } = useVideo();
  return (
    <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
      <Col span={1}></Col>
      <Col span={15} style={{ padding: "0px 8px 0px 24px" }}>
        <VideoWatch />
        <VideoInformation />
        <VideoComment />
      </Col>
      <Col span={7}>
        <VideoSuggestGrid videos={videoData} />
      </Col>
      <Col span={1}></Col>
    </Row>
  );
};

export default VideoWatchPage;
