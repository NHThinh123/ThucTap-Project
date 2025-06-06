import React from "react";
import { List, Card, Typography, Layout } from "antd";
// import { formatDuration } from "../../../../constants/formatDuration";
// import { formatViews } from "../../../../constants/formatViews";
// import { formatTime } from "../../../../constants/formatTime";
import useVideosByUserId from "../../../video/hooks/useVideosByUserId";
import { Content } from "antd/es/layout/layout";
import VideoGrid from "../../../video/components/templates/VideoGrid";

const { Title, Text } = Typography;

const VideoChannel = ({ channelId }) => {
  const { videoList, isLoading, isError, error } = useVideosByUserId(channelId);

  if (isLoading) {
    return <div>Đang tải video...</div>;
  }

  if (isError) {
    return <div>Lỗi: {error?.message || "Không thể tải video"}</div>;
  }
  return (
    <Layout style={{ background: "#fff" }}>
      <Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
          background: "#fff",
        }}
      >
        <VideoGrid videos={videoList} xxl={6} isShow={false} />
      </Content>
    </Layout>
  );
};

export default VideoChannel;
