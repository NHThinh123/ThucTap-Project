import { Button, Col, Row, Space, Tabs, Typography } from "antd";
import React from "react";
import MainChannel from "../features/channel/components/templates/MainChannel";

const tabs = [
  {
    key: "1",
    label: "Trang chủ",
    children: <MainChannel />,
  },
  {
    key: "2",
    label: "Video",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Danh sách phát",
    children: "Content of Tab Pane 3",
  },
];
const ChannelPage = () => {
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
      <Row style={{ marginTop: "16px" }}>
        <Tabs defaultActiveKey="1" items={tabs} />
      </Row>
    </>
  );
};

export default ChannelPage;
