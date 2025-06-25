// pages/HomePage.jsx
import React, { useEffect, useContext } from "react";
import { Layout, Spin } from "antd";
import VideoGrid from "../features/video/components/templates/VideoGrid";
import { useChannelVideo } from "../features/channel/hooks/useChannelVideo";
import { AuthContext } from "../contexts/auth.context";

const { Content } = Layout;

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.isAuthenticated ? auth.user?.id : null;
  const { data, isLoading, isError } = useChannelVideo(userId);
  const videoList = data?.data?.videos || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("Video data:", data);
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
