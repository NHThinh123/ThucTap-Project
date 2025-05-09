import React from "react";
import { Layout } from "antd";
import VideoGrid from "../components/VideoGrid";
import { mockVideos } from "../data/mockVideos";

const { Content } = Layout;

const HomePage = () => {
  return (
    <Layout style={{ background: "#fff" }}>
      <Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
          background: "#fff",
        }}
      >
        <VideoGrid videos={mockVideos} />
      </Content>
    </Layout>
  );
};

export default HomePage;
