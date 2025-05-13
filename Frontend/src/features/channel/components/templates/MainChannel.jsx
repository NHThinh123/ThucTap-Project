import { Col, Divider, Row, Typography } from "antd";
import React from "react";


const { Title, Text } = Typography;

const MainChannel = () => {
  return (
    <>
      <Divider style={{ marginTop: "-16px" }} />
      <Row align={"top"} gutter={16}>
        <Col>
          <img
            src="https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center"
            alt="Channel Thumbnail"
            style={{ width: "450px", height: "250px", borderRadius: "8px" }}
          />
        </Col>
        <Col>
          <Title
            level={3}
            style={{
              marginBottom: "16px",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "500px",
            }}
          >
            Anime Youtube Thumbnails designs
          </Title>
          <Text style={{ fontSize: 16 }}>600 N lượt xem • 3 tháng trước</Text>
          <Text
            style={{
              marginTop: "16px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "500px",
            }}
          >
            Anime Youtube Thumbnails designs, themes, templates and downloadable
            graphic elements on Dribbble. Your resource to discover and connect
            with designers worldwide.
          </Text>
        </Col>
      </Row>

      <Divider />
      <Title level={3}>Dành cho bạn</Title>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <HorizontalListVideo />
        </Col>
      </Row>
      <Divider />
      <Title level={3}>Video mới nhất</Title>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <HorizontalListVideo />
        </Col>
      </Row>
      <Divider />
      <Title level={3}>Video phổ biến</Title>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <HorizontalListVideo />
        </Col>
      </Row>
    </>
  );
};

export default MainChannel;
