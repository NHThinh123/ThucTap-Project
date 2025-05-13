import { Card, Col, Row, Spin } from "antd";
import { useChannelVideo } from "../features/channel/hooks/useChannelVideo";

const VideoDetailPage = () => {
  const { data, isLoading, isError } = useChannelVideo();
  const videos = data?.data.videos;

  console.log(data);
  if (isLoading) return <Spin />;
  if (isError) return <p>Lỗi khi tải danh sách video.</p>;
  return (
    <Row gutter={[16, 16]}>
      {videos?.map((video) => (
        <Col key={video._id} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <img
                alt="thumbnail"
                src={video.thumbnail_video}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
          >
            <Card.Meta
              title={video.title}
              description={video.description_video}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default VideoDetailPage;
