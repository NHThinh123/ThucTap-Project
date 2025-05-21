import React from "react";
import { Layout } from "antd";
import VideoGrid from "../features/video/components/templates/VideoGrid";
import useVideo from "../features/video/hooks/useVideo";
// import { mockVideos } from "../data/mockVideos";

const { Content } = Layout;

const HomePage = () => {
  const { videoList, loading } = useVideo();
  if (loading) return <p>Loading...</p>;
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
