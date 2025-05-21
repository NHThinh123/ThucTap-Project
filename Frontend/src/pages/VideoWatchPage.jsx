import VideoWatch from "../features/watch/components/templates/VideoWatch";
import VideoInformation from "../features/watch/components/templates/VideoInformation";
import VideoComment from "../features/comment/components/templates/VideoComment";
import useVideo from "../features/video/hooks/useVideo";
import { Col, Row } from "antd";
import VideoSuggestGrid from "../features/video/components/templates/VideoSuggestGrid";
import { useParams } from "react-router-dom";
import useVideoById from "../features/video/hooks/useVideoById";

const VideoWatchPage = () => {
  const { videoList } = useVideo();
  const { id } = useParams();
  const { videoData } = useVideoById(id);
  const { video } = videoData;
  return (
    <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
      <Col span={1}></Col>
      <Col span={15} style={{ padding: "0px 8px 0px 24px" }}>
        <VideoWatch video={video} />
        <VideoInformation video={video} />
        <VideoComment />
      </Col>
      <Col span={7}>
        <VideoSuggestGrid videos={videoList} />
      </Col>
      <Col span={1}></Col>
    </Row>
  );
};

export default VideoWatchPage;
