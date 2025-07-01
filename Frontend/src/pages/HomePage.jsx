import React, { useEffect } from "react";
import { Layout, Spin, Typography, Button } from "antd";
import VideoGrid from "../features/video/components/templates/VideoGrid";
import { useChannelVideo } from "../features/channel/hooks/useChannelVideo";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

const { Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const { data, isLoading, isError, refetch } = useChannelVideo();
  const videoList = data?.data?.videos || [];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only on mount

  console.log("Dữ liệu API:", data);
  console.log("Danh sách video:", videoList);

  if (isLoading)
    return <Spin style={{ display: "block", margin: "50px auto" }} />;
  if (isError || !videoList?.length) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "red" }}>
          {data?.message || "Không có video nào để hiển thị."}
        </p>
        <Button onClick={refetch}>Làm mới</Button>
      </div>
    );
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
        {!auth.isAuthenticated}
        <VideoGrid videos={videoList} />
      </Content>
    </Layout>
  );
};

export default HomePage;
