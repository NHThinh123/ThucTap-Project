/* eslint-disable no-unused-vars */
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Space,
  Row,
  Col,
  Avatar,
  Dropdown,
  Drawer,
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import logo from "./assets/logo/logo.png";
import { useState, useContext } from "react";
import { AuthContext } from "./contexts/auth.context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Header, Content, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const [setIsLoggingOut] = useState(false);
  const isUserLoggedIn = auth?.isAuthenticated;
  const isVideoWatchPage = location.pathname === "/watch";

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const displayName = isUserLoggedIn ? auth.user?.name : "";

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
    {
      key: "watch",
      icon: <YoutubeOutlined />,
      label: (
        <Link to="/watch" onClick={() => setDrawerVisible(false)}>
          Watch
        </Link>
      ),
    },
    {
      key: "search",
      icon: <SearchOutlined />,
      label: <Link to="/search">Search</Link>,
    },
    {
      key: "studio",
      icon: <AppstoreOutlined />,
      label: <Link to="/studio">Studio</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
    { key: "logout", label: "Đăng xuất", onClick: handleLogout },
  ];

  const userMenu = <Menu items={userMenuItems} />;

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const toggleMenu = () => {
    if (isVideoWatchPage) {
      showDrawer();
    } else {
      setCollapsed(!collapsed);
    }
  };

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
            //boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col span={6} style={{ display: "flex", alignItems: "center" }}>
              <Button
                icon={<MenuOutlined />}
                onClick={toggleMenu}
                style={{
                  border: "none",
                  fontSize: "18px",
                  marginRight: "16px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",

                  flex: 1,
                }}
              >
                <img
                  src={logo}
                  style={{ height: "30px", width: "auto", marginRight: "8px" }}
                  alt="logo"
                />
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  TrueTube
                </span>
              </div>
            </Col>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Input.Search
                size="large"
                placeholder="Search..."
                style={{ width: "100%", maxWidth: "600px" }}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} />
                }
              />
            </Col>
            <Col
              span={6}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {isUserLoggedIn ? (
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={avatarSrc}
                      icon={!avatarSrc && <CircleUserRound />}
                    />
                    <span>{displayName}</span>
                  </Space>
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  style={{ padding: "0 16px" }}
                  onClick={() => navigate("/login")}
                >
                  <CircleUserRound style={{ marginRight: "8px" }} />
                  Đăng nhập
                </Button>
              )}
            </Col>
          </Row>
        </Header>

        <Layout style={{ marginTop: "64px" }}>
          {!isVideoWatchPage && (
            <Sider
              collapsed={collapsed}
              width={200}
              style={{
                position: "fixed",
                height: "calc(100vh - 64px)",
                left: 0,
                top: "64px",
                overflow: "auto",
                background: "#fff",
              }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["home"]}
                items={menuItems}
                style={{ height: "100%", borderRight: 0 }}
              />
            </Sider>
          )}

          {isVideoWatchPage && (
            <Drawer
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <img
                    src={logo}
                    style={{
                      height: "30px",
                      width: "auto",
                      marginRight: "8px",
                    }}
                    alt="logo"
                  />
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    TrueTube
                  </span>
                </div>
              }
              placement="left"
              onClose={closeDrawer}
              open={drawerVisible}
              width={200}
              bodyStyle={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                padding: 0,
                overflow: "auto",
              }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["watch"]}
                items={menuItems}
                style={{ borderRight: 0 }}
              />
            </Drawer>
          )}

          <Content
            style={{
              marginLeft: isVideoWatchPage
                ? "0px"
                : collapsed
                ? "80px"
                : "200px",
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
