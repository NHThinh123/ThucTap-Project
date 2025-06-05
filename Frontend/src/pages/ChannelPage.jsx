import { Button, Col, Row, Space, Tabs, Typography } from "antd";
import React from "react";
import MainChannel from "../features/channel/components/templates/MainChannel";
import VideoChannel from "../features/channel/components/templates/VideoChannel";
import ChannelInformation from "../features/channel/components/templates/ChannelInformation";
import { useParams } from "react-router-dom";

const ChannelPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const tabs = [
    {
      key: "1",
      label: "Trang chủ",
      children: <MainChannel channelId={id} />,
    },
    {
      key: "2",
      label: "Video",
      children: <VideoChannel channelId={id} />, // Replace with actual content
    },
    {
      key: "3",
      label: "Danh sách phát",
      children: "Content of Tab Pane 3", // Replace with actual content
    },
  ];
  return (
    <Row>
      <Col span={2}></Col>
      <Col span={20}>
        <ChannelInformation channelId={id} />
        <Row style={{ marginTop: "16px", width: "100%" }}>
          <Col span={24}>
            <Tabs defaultActiveKey="1" items={tabs} />
          </Col>
        </Row>
      </Col>
      <Col span={2}></Col>
    </Row>
  );
};

export default ChannelPage;
