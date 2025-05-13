import { Outlet, Link, useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { Layout, Menu, Input, Button, Space, Row, Col, Avatar, Dropdown } from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "./assets/logo/logo.png";
import { useState, useContext } from "react";
import { AuthContext } from "./contexts/auth.context";
import { ToastContainer } from "react-toastify"; // Thêm ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Thêm CSS cho react-toastify

const { Header, Content, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isUserLoggedIn = auth?.isAuthenticated;

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const displayName = isUserLoggedIn ? auth.user?.name : "";
  const userId = isUserLoggedIn ? auth.user?.id : null;

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      if (isUserLoggedIn) {
        setAuth({ isAuthenticated: false, user: {} });
        localStorage.removeItem("authUser");
      }
      setIsLoggingOut(false);
      navigate("/");
    }, 2000);
  };

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
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const userMenu = <Menu items={userMenuItems} />;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Layout style={{ minHeight: "100vh" }}>
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
                <img
                  src={logo}
                  style={{
                    height: "60px",
                    width: "auto",
                  }}
                  alt="logo"
                />
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
              {isUserLoggedIn ? (
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar src={avatarSrc} icon={!avatarSrc && <CircleUserRound />} />
                    <span>{displayName}</span>
                  </Space>
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  style={{ padding: "18px" }}
                  onClick={() => navigate("/login")}
                >
                  <CircleUserRound />
                  Đăng nhập
                </Button>
              )}
            </Col>
          </Row>
        </Header>

        <Layout style={{ marginTop: "64px" }}>
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

          <Content
            style={{
              marginLeft: collapsed ? "80px" : "200px",
              padding: "24px",
              minHeight: "calc(100vh - 64px)",
              transition: "margin-left 0.2s",
              background: "#fff",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;