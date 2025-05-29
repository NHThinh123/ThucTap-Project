import React, { useEffect } from "react";
import { Layout, Spin } from "antd";
import VideoGrid from "../features/video/components/templates/VideoGrid";
import { useChannelVideo } from "../features/channel/hooks/useChannelVideo";

const { Content } = Layout;

const HomePage = () => {
  const { data, isLoading, isError } = useChannelVideo();
  const videoList = data?.data.videos;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only on mount

  console.log(data);
  if (isLoading) return <Spin />;
  if (isError) return <p>Lỗi khi tải danh sách video.</p>;

  return (
    <Layout style={{ background: "#fff" }}>
      <Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
          background: "#fff",
        }}
      >
        <VideoGrid videos={videoList} />
      </Content>
    </Layout>
  );
};

export default HomePage;
