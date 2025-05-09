import React from "react";
import { Row, Col } from "antd";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos }) => {
  return (
    <Row gutter={[12, 12]}>
      {videos.map((video) => (
        <Col key={video.id} xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
          <VideoCard video={video} />
        </Col>
      ))}
    </Row>
  );
};

export default VideoGrid;
