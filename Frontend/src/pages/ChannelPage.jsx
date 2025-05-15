import { Button, Col, Row, Space, Tabs, Typography } from "antd";
import React from "react";
import MainChannel from "../features/channel/components/templates/MainChannel";
import VideoChannel from "../features/channel/components/templates/VideoChannel";

const ChannelPage = () => {
  const tabs = [
    {
      key: "1",
      label: "Trang chủ",
      children: <MainChannel />,
    },
    {
      key: "2",
      label: "Video",
      children: <VideoChannel />, // Replace with actual content
    },
    {
      key: "3",
      label: "Danh sách phát",
      children: "Content of Tab Pane 3", // Replace with actual content
    },
  ];
  return (
    <>
      <Row align={"middle"} gutter={16}>
        <Col>
          <div>
            <img
              src="https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg"
              alt="Avatar"
              style={{ width: "150px", borderRadius: "50%" }}
            />
          </div>
        </Col>
        <Col>
          <div>
            <Typography.Title level={1} style={{ margin: 0 }}>
              KAFF Gaming
            </Typography.Title>
            <Typography.Text>50 N Người đăng ký • 352 video</Typography.Text>
            <br />
            <Space style={{ marginTop: "16px" }}>
              <Button>Tùy chỉnh kênh</Button>
              <Button>Quản lý video</Button>
            </Space>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: "16px", width: "100%" }}>
        <Col span={24}>
          <Tabs defaultActiveKey="1" items={tabs} />
        </Col>
      </Row>
    </>
  );
};

export default ChannelPage;
