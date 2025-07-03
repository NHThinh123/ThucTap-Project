/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
  Drawer,
  Spin,
} from "antd";
import { useContext, useState, useMemo, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import logo from "../assets/logo/logo.png";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  MenuOutlined,
  PlusOutlined,
  StockOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import { CircleUserRound, CircleUserRoundIcon } from "lucide-react";
import { useModal } from "../contexts/modal.context";
import UploadPage from "./UploadPage";

const { Header, Content, Sider } = Layout;

const StudioPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 576);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Sửa lỗi cú pháp
  const isUserLoggedIn = auth?.isAuthenticated;

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const nickname = isUserLoggedIn ? auth.user?.nickname : "";
  const user_name = isUserLoggedIn ? auth.user?.name : "";

  // Xử lý resize để cập nhật trạng thái responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
      setCollapsed(window.innerWidth <= 576);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      if (isUserLoggedIn) {
        setAuth({ isAuthenticated: false, user: {} });
        localStorage.removeItem("authUser");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      setIsLoggingOut(false);
      navigate("/");
    }, 2000);
  };

  const { openModal } = useModal();

  // Menu items cho Sider
  const menuItems = [
    {
      key: "overview",
      icon: <AppstoreOutlined />,
      label: <Link to="/studio">Tổng quan</Link>,
    },
    {
      key: "content",
      icon: <HomeOutlined />,
      label: <Link to="/studio/content">Nội dung</Link>,
    },
    {
      key: "analytics",
      icon: <StockOutlined />,
      label: <Link to="/studio/analytics">Thống kê</Link>,
    },
    {
      key: "subscribers",
      icon: <YoutubeOutlined />,
      label: <Link to="/studio/subscribers">Người đăng ký</Link>,
    },
    {
      key: "back",
      icon: <ArrowLeftOutlined />,
      label: <Link to="/">Trở về trang chủ</Link>,
    },
  ];

  // Menu items cho Dropdown user
  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
    { 
      key: "logout", 
      label: isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất", 
      onClick: handleLogout,
      disabled: isLoggingOut
    },
  ];

  const userMenu = <Menu items={userMenuItems} />;

  // Xử lý nút đăng tải
  const handleUploadClick = () => {
    openModal(<UploadPage navigate={navigate} />);
  };

  // Xử lý click logo để reload về homepage
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  // Tính toán selectedKey dựa trên route
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path === "/studio") return "overview";
    if (path === "/studio/content") return "content";
    if (path === "/studio/analytics") return "analytics";
    if (path === "/studio/subscribers") return "subscribers";
    if (path === "/") return "back";
    return "overview";
  }, [location.pathname]);

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
      <Spin
        spinning={isLoggingOut}
        tip="Đang đăng xuất..."
        size="large"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000,
          background: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Layout style={{ minHeight: "100vh" }}>
          {/* Header */}
          <Header
            style={{
              position: "fixed",
              zIndex: 1000,
              width: "100%",
              background: "#fff",
              padding: isMobile ? "0 8px" : "0 24px",
            }}
          >
            <Row align="middle" justify="space-between">
              <Col
                xs={8}
                sm={6}
                md={6}
                lg={6}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    border: "none",
                    fontSize: isMobile ? "16px" : "18px",
                    marginRight: isMobile ? "8px" : "16px",
                  }}
                />
                <div
                  onClick={handleLogoClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={logo}
                    style={{
                      height: isMobile ? "24px" : "30px",
                      width: "auto",
                      marginRight: "8px",
                    }}
                    alt="logo"
                  />
                  <Typography.Text
                    style={{
                      fontSize: isMobile ? "16px" : "18px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                    ellipsis
                  >
                    CUSC Tube
                  </Typography.Text>
                </div>
              </Col>
              <Col
                xs={0}
                sm={12}
                md={12}
                lg={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {/* Không gian cho tìm kiếm, ẩn trên mobile */}
              </Col>
              <Col
                xs={8}
                sm={3}
                md={3}
                lg={3}
                style={{ display: "flex", justifyContent: "end" }}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    padding: isMobile ? "0 8px" : "0 16px",
                  }}
                  onClick={handleUploadClick}
                >
                  <PlusOutlined />
                  <span style={{ display: isMobile ? "none" : "inline" }}>
                    Đăng tải
                  </span>
                </Button>
              </Col>
              <Col
                xs={3}
                sm={3}
                md={3}
                lg={3}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {isUserLoggedIn ? (
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <Space style={{ cursor: "pointer" }}>
                      <Avatar
                        src={avatarSrc}
                        icon={!avatarSrc && <CircleUserRound />}
                        size={isMobile ? 24 : 32}
                      />
                      <Typography.Text
                        style={{ display: isMobile ? "none" : "inline" }}
                        ellipsis
                      >
                        {user_name}
                      </Typography.Text>
                    </Space>
                  </Dropdown>
                ) : (
                  <Button
                    type="primary"
                    style={{
                      padding: isMobile ? "0 8px" : "0 16px",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    <CircleUserRoundIcon
                      style={{ marginRight: isMobile ? "4px" : "8px" }}
                      size={isMobile ? 16 : 20}
                    />
                    <span style={{ display: isMobile ? "none" : "inline" }}>
                      Đăng nhập
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
          </Header>

          {/* Layout chính */}
          <Layout style={{ marginTop: "64px" }}>
            {/* Sider hoặc Drawer */}
            {isMobile ? (
              <Drawer
                placement="left"
                onClose={() => setCollapsed(true)}
                open={!collapsed}
                width={200}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ padding: "16px", textAlign: "center" }}>
                  <Avatar
                    src={avatarSrc || <CircleUserRound />}
                    size={100}
                    style={{ marginBottom: "8px" }}
                  />
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>
                    Kênh của bạn
                  </div>
                  <div style={{ fontSize: "14px", color: "#6a6a6a" }}>
                    {nickname || "Người dùng"}
                  </div>
                </div>
                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  items={menuItems}
                  style={{ height: "100%", borderRight: 0 }}
                />
              </Drawer>
            ) : (
              <Sider
                collapsed={collapsed}
                style={{
                  position: "fixed",
                  height: "calc(100vh - 64px)",
                  left: 0,
                  top: "64px",
                  overflow: "auto",
                  background: "#fff",
                  scrollbarWidth: "none",
                  borderRight: "1px solid #e8e8e8",
                }}
              >
                <div style={{ padding: "16px", textAlign: "center" }}>
                  <Avatar
                    src={avatarSrc || <CircleUserRound />}
                    size={collapsed ? 40 : 100}
                    style={{ marginBottom: "8px" }}
                  />
                  {!collapsed && (
                    <>
                      <div style={{ fontWeight: "bold", fontSize: 16 }}>
                        Kênh của bạn
                      </div>
                      <div style={{ fontSize: "14px", color: "#6a6a6a" }}>
                        {nickname || "Người dùng"}
                      </div>
                    </>
                  )}
                </div>
                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  items={menuItems}
                  style={{ height: "100%", borderRight: 0 }}
                />
              </Sider>
            )}

            {/* Content */}
            <Content
              style={{
                marginLeft: isMobile ? 0 : collapsed ? "80px" : "200px",
                padding: isMobile ? "8px" : "24px",
                minHeight: "calc(100vh - 64px)",
                transition: "margin-left 0.2s",
                background: "#fff",
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Spin>
    </>
  );
};

export default StudioPage;
