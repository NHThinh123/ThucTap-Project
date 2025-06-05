import { Typography } from "antd";

import VideoList from "../features/studio/components/templates/VideoList";

const StudioContentPage = () => {
  return (
    <>
      <Typography.Title level={3} style={{ margin: "20px 0" }}>
        Nội dung của kênh
      </Typography.Title>
      <VideoList />
    </>
  );
};

export default StudioContentPage;
