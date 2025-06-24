import VideoWatch from "../features/watch/components/templates/VideoWatch";
import VideoInformation from "../features/watch/components/templates/VideoInformation";
import VideoComment from "../features/comment/components/templates/VideoComment";
import { useChannelVideo } from "../features/channel/hooks/useChannelVideo";
import { Col, Row, Spin } from "antd";
import VideoSuggestGrid from "../features/video/components/templates/VideoSuggestGrid";
import { useParams } from "react-router-dom";
import useVideoById from "../features/video/hooks/useVideoById";

const VideoWatchPage = () => {
  const { data, isLoading, isError } = useChannelVideo();
  const videoList = data?.data.videos;
  const { id } = useParams();
  const { videoData, isLoading: isLoadingVideoById } = useVideoById(id);
  const { video } = videoData;

  // Lọc bỏ video hiện tại khỏi danh sách gợi ý
  const filteredVideoList = videoList?.filter((video) => video._id !== id);

  if (isLoading) return <Spin />;
  if (isError) return <p>Lỗi khi tải danh sách video.</p>;
  return (
    <Row style={{ background: "#fff", padding: 0 }} gutter={[0, 0]}>
      <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1}></Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={16}
        xl={15}
        xxl={15}
        style={{ padding: "0px 8px 0px 24px" }}
      >
        <VideoWatch video={video} isLoading={isLoadingVideoById} />
        <VideoInformation video={video} isLoading={isLoadingVideoById} />
        <VideoComment video={video} isLoading={isLoadingVideoById} />
      </Col>
      <Col xs={24} sm={22} md={19} lg={8} xl={7} xxl={7}>
        <VideoSuggestGrid videos={filteredVideoList} />
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1}></Col>
    </Row>
  );
};

export default VideoWatchPage;
