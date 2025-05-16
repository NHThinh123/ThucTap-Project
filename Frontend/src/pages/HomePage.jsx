import React from "react";
import { Layout } from "antd";
import VideoGrid from "../features/video/components/templates/VideoGrid";
import useVideo from "../features/video/hooks/useVideo";
// import { mockVideos } from "../data/mockVideos";

const { Content } = Layout;

const HomePage = () => {
  const { videoData, loading } = useVideo();
  console.log("HomePage videos:", videoData);
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
        <VideoGrid videos={videoData} />
      </Content>
    </Layout>
  );
};

export default HomePage;
