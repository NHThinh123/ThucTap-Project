/* eslint-disable no-unused-vars */

import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { CircleUserRound, ListVideo, Upload } from "lucide-react";
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
  Typography,
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  HomeOutlined,
  YoutubeOutlined,
  UserOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import logo from "./assets/logo/logo.png";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./contexts/auth.context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useModal } from "./contexts/modal.context";
import UploadPage from "./pages/UploadPage";
import SearchBar from "./components/templates/SearchBar";

const { Header, Content, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isUserLoggedIn = auth?.isAuthenticated;
  const isVideoWatchPage = location.pathname.startsWith("/watch/");

  // Định nghĩa menu items
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
      path: "/",
    },
    {
      key: "channel",
      icon: <UserOutlined />,
      label: <Link to="/channel">Channel</Link>,
      path: "/channel",
    },
    {
      key: "playlist",
      icon: <ListVideo size={18} />,
      label: <Link to="/playlist">PlayList</Link>,
    },
    {
      key: "studio",
      icon: <AppstoreOutlined />,
      label: <Link to="/studio">Studio</Link>,
      path: "/studio",
    },
  ];

  // Xác định key được chọn dựa trên đường dẫn hiện tại
  const getSelectedKey = () => {
    // Tìm menu item khớp với đường dẫn hiện tại
    const currentItem = menuItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );
    // Nếu là trang watch, chọn "video" hoặc key phù hợp
    if (isVideoWatchPage) {
      return "video";
    }
    return currentItem ? currentItem.key : "home"; // Mặc định là "home" nếu không khớp
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  // Cập nhật selectedKey khi location.pathname thay đổi
  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [location.pathname]);

  useEffect(() => {
    if (isVideoWatchPage) {
      setDrawerVisible(false);
    }
  }, [location.pathname, isVideoWatchPage]);

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

  const handleUploadClick = () => {
    navigate("/studio");
    openModal(<UploadPage />);
  };

  // Handle logo click to refresh and navigate to homepage
  const handleLogoClick = () => {
    window.location.href = "/";
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
          }}
        >
          <Row align="middle" justify="space-between">
            <Col span={1}>
              <Button
                icon={<MenuOutlined />}
                onClick={toggleMenu}
                style={{
                  border: "none",
                  fontSize: "18px",
                  marginRight: "16px",
                }}
              />
            </Col>
            <Col span={5}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={handleLogoClick}
              >
                <img
                  src={logo}
                  style={{ height: "30px", width: "auto", marginRight: "8px" }}
                  alt="logo"
                />
                <Typography.Text
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  CUSC Tube
                </Typography.Text>
              </div>
            </Col>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <SearchBar />
            </Col>
            <Col span={3} style={{ display: "flex", justifyContent: "end" }}>
              <Button
                color="primary"
                variant="outlined"
                style={{
                  fontSize: "16px",

                  marginLeft: "16px",
                }}
                onClick={handleUploadClick}
              >
                <PlusOutlined /> Đăng tải
              </Button>
            </Col>
            <Col
              span={3}
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
                selectedKeys={[selectedKey]} // Sử dụng selectedKeys động
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
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    CUSC Tube
                  </span>
                </div>
              }
              placement="left"
              onClose={closeDrawer}
              open={drawerVisible}
              width={210}
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
                selectedKeys={[selectedKey]} // Sử dụng selectedKeys động
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
