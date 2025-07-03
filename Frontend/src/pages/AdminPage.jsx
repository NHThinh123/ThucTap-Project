/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Col,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
  Spin,
  Drawer,
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
  StockOutlined,
} from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import { CircleUserRound, FileVideo, User } from "lucide-react";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isUserLoggedIn = auth?.isAuthenticated;

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const user_name = isUserLoggedIn ? auth.user?.user_name : "";

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const menuItems = [
    {
      key: "overview",
      icon: <FileVideo size={18} />,
      label: <Link to="/admin">Video</Link>,
    },
    {
      key: "list",
      icon: <User size={18} />,
      label: <Link to="/admin/list">Người dùng</Link>,
    },
    {
      key: "back",
      icon: <ArrowLeftOutlined />,
      label: <span onClick={handleLogout}>Đăng xuất</span>,
    },
  ];

  // Xác định key được chọn dựa trên đường dẫn hiện tại
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path === "/admin") return "overview";
    if (path === "/admin/list") return "list";
    if (path === "/admin/statistics") return "statistics";
    if (path === "/") return "back";
    return "overview"; // Mặc định là overview
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Avatar
          src={avatarSrc || <CircleUserRound />}
          size={collapsed && !isMobile ? 40 : 80}
          style={{ marginBottom: "8px" }}
        />
        {(!collapsed || isMobile) && (
          <>
            <div style={{ fontWeight: "bold", fontSize: 16, color: "#c90626" }}>
              Admin Dashboard
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#6a6a6a",
                marginTop: "4px",
              }}
            >
              {user_name || "Người dùng"}
            </div>
          </>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{
          height: "100%",
          borderRight: 0,
          background: "transparent",
        }}
        onClick={() => {
          if (isMobile) {
            setMobileDrawerVisible(false);
          }
        }}
      />
    </>
  );

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
          <Header
            style={{
              position: "fixed",
              zIndex: 1000,
              width: "100%",
              background: "#fff",
              padding: isMobile ? "0 16px" : "0 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row align="middle" justify="space-between">
              <Col xs={8} sm={6} md={6} style={{ display: "flex", alignItems: "center" }}>
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => {
                    if (isMobile) {
                      setMobileDrawerVisible(!mobileDrawerVisible);
                    } else {
                      setCollapsed(!collapsed);
                    }
                  }}
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
                  {!isMobile && (
                    <Typography.Text
                      style={{ fontSize: "18px", fontWeight: "bold", color: "#c90626" }}
                    >
                      CUSC Tube Admin
                    </Typography.Text>
                  )}
                </div>
              </Col>
              <Col xs={0} sm={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                <Typography.Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#666",
                  }}
                >
                  Bảng điều khiển quản trị
                </Typography.Text>
              </Col>
              <Col xs={8} sm={6} md={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                {isUserLoggedIn ? (
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={avatarSrc}
                      icon={!avatarSrc && <CircleUserRound />}
                      size={isMobile ? "small" : "default"}
                    />
                    {!isMobile && <span>{user_name}</span>}
                  </Space>
                ) : (
                  <Button
                    type="primary"
                    style={{ padding: isMobile ? "0 8px" : "0 16px" }}
                    onClick={() => navigate("/login")}
                  >
                    <CircleUserRound style={{ marginRight: isMobile ? "0" : "8px" }} />
                    {!isMobile && "Đăng nhập"}
                  </Button>
                )}
              </Col>
            </Row>
          </Header>

          <Layout style={{ marginTop: "64px" }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
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
                  boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
                }}
              >
                <SidebarContent />
              </Sider>
            )}

            {/* Mobile Drawer */}
            <Drawer
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={logo}
                    style={{ height: "24px", width: "auto", marginRight: "8px" }}
                    alt="logo"
                  />
                  <span style={{ color: "#c90626", fontWeight: "bold" }}>
                    CUSC Tube Admin
                  </span>
                </div>
              }
              placement="left"
              onClose={() => setMobileDrawerVisible(false)}
              open={mobileDrawerVisible}
              width={280}
              style={{ display: isMobile ? "block" : "none" }}
              bodyStyle={{ padding: 0, background: "#fafafa" }}
            >
              <SidebarContent />
            </Drawer>

            <Content
              style={{
                marginLeft: isMobile ? 0 : collapsed ? "80px" : "200px",
                padding: isMobile ? "16px" : "24px",
                minHeight: "calc(100vh - 64px)",
                transition: "margin-left 0.2s",
                background: "#f5f5f5",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: isMobile ? "16px" : "24px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  minHeight: "calc(100vh - 128px)",
                }}
              >
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Spin>
    </>
  );
};

export default AdminPage;
