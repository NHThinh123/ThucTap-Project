import { Col, Row } from "antd";
import React from "react";
import HorizontalListVideo from "../features/channel/components/organisms/HorizontalListVideo";

const VideoDetailPage = () => {
  return (
    <div>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <div style={{ width: "100%", backgroundColor: "aqua" }}>
            <HorizontalListVideo />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default VideoDetailPage;
