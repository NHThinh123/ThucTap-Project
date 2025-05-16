import { Tabs, Typography } from "antd";
import React from "react";
import VideoList from "../features/studio/components/templates/VideoList";

const StudioContentPage = () => {
  const items = [
    {
      key: "video",
      label: "Video",
      children: <VideoList />,
    },
    {
      key: "playlist",
      label: "Danh sách phát",
      children: "Content of Tab Pane 2",
    },
  ];
  return (
    <>
      <Typography.Title level={3} style={{ margin: "20px 0" }}>
        Nội dung của kênh
      </Typography.Title>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
};

export default StudioContentPage;
