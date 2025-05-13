import { Outlet, Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { Layout, Menu, Input, Button, Space, Row, Col } from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    {
      key: "video",
      icon: <YoutubeOutlined />,
      label: <Link to="/video">Video</Link>,
    },
    {
      key: "channel",
      icon: <UserOutlined />,
      label: <Link to="/channel">Channel</Link>,
    },
    {
      key: "watch",
      icon: <YoutubeOutlined />,
      label: <Link to="/watch">Watch</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header cố định */}
      <Header
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          background: "#fff",
          padding: "0 24px",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col span={6}>
            <Space>
              <Button
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ border: "none", fontSize: "18px" }}
              />
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginRight: "24px",
                }}
              >
                Logo
              </div>
            </Space>
          </Col>
          <Col span={14} style={{ display: "flex", justifyContent: "center" }}>
            <Input.Search
              size="large"
              placeholder="Search..."
              style={{ width: "100%", maxWidth: "600px" }}
              enterButton
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" style={{ padding: "18px" }}>
              <CircleUserRound />
              Đăng nhập
            </Button>
          </Col>
        </Row>
      </Header>

      {/* Sidebar và Content */}
      <Layout style={{ marginTop: "64px" }}>
        {/* Sidebar cố định */}
        <Sider
          collapsed={collapsed}
          width={200}
          style={{
            position: "fixed",
            height: "calc(100vh - 64px)",
            left: 0,
            top: "64px",
            overflow: "auto",
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["home"]}
            items={menuItems}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Sider>

        {/* Nội dung chính */}
        <Content
          style={{
            marginLeft: collapsed ? "80px" : "200px",
            padding: "24px",

            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
