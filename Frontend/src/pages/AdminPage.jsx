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
} from "antd";
import { useContext, useState, useMemo } from "react";
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
import { CircleUserRound } from "lucide-react";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isUserLoggedIn = auth?.isAuthenticated;

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const user_name = isUserLoggedIn ? auth.user?.user_name : "";

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
      icon: <AppstoreOutlined />,
      label: <Link to="/admin">Tổng quan</Link>,
    },
    {
      key: "list",
      icon: <HomeOutlined />,
      label: <Link to="/admin/list">Danh sách</Link>,
    },
    {
      key: "statistics",
      icon: <StockOutlined />,
      label: <Link to="/admin/statistics">Thống kê</Link>,
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
              padding: "0 24px",
            }}
          >
            <Row align="middle" justify="space-between">
              <Col span={6} style={{ display: "flex", alignItems: "center" }}>
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
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
                      height: "30px",
                      width: "auto",
                      marginRight: "8px",
                    }}
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
              ></Col>
              <Col
                span={3}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {isUserLoggedIn ? (
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={avatarSrc}
                      icon={!avatarSrc && <CircleUserRound />}
                    />
                    <span>{user_name}</span>
                  </Space>
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
                      Admin
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6a6a6a",
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
      </Spin>
    </>
  );
};

export default AdminPage;
