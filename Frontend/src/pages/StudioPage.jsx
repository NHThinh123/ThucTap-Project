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
} from "antd";
import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import logo from "../assets/logo/logo.png";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import { CircleUserRound, CircleUserRoundIcon, Upload } from "lucide-react";
import { useModal } from "../contexts/modal.context";
import UploadPage from "./UploadPage";
const { Header, Content, Sider } = Layout;
const StudioPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const [setIsLoggingOut] = useState(false);
  const isUserLoggedIn = auth?.isAuthenticated;

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const nickname = isUserLoggedIn ? auth.user?.nickname : "";
  const user_name = isUserLoggedIn ? auth.user?.name : "";

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
  const { openModal } = useModal();
  const menuItems = [
    {
      key: "overview",
      icon: <AppstoreOutlined />,
      label: <Link to="/studio/overview">Tổng quan</Link>,
    },
    {
      key: "content",
      icon: <HomeOutlined />,
      label: <Link to="/studio">Nội dung</Link>,
    },
    {
      key: "analytics",
      icon: <YoutubeOutlined />,
      label: <Link to="/studio/analytics">Thống kê</Link>,
    },
    {
      key: "edit",
      icon: <UserOutlined />,
      label: <Link to="/studio/edit">Tùy chỉnh kênh</Link>,
    },
    {
      key: "subcribers",
      icon: <YoutubeOutlined />,
      label: <Link to="/studio/subcribers">Người đăng ký</Link>,
    },
    {
      key: "back",
      icon: <ArrowLeftOutlined />,
      label: <Link to="/">Trở về trang chủ</Link>,
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
  const handleUploadClick = () => {
    openModal(<UploadPage />);
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
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                }}
              >
                <img
                  src={logo}
                  style={{ height: "30px", width: "auto", marginRight: "8px" }}
                  alt="logo"
                />
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  CUSC Tube
                </span>
              </div>
            </Col>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Input.Search
                size="large"
                placeholder="Tìm kiếm trên kênh"
                style={{ width: "100%", maxWidth: "600px" }}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} />
                }
              />
            </Col>
            <Col span={2} style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="text"
                icon={<Upload />}
                style={{
                  fontSize: "24px",
                  color: "#000",
                  marginLeft: "16px",
                }}
                onClick={handleUploadClick}
              ></Button>
            </Col>
            <Col
              span={4}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {isUserLoggedIn ? (
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={avatarSrc}
                      icon={!avatarSrc && <CircleUserRound />}
                    />
                    <span>{user_name}</span>
                  </Space>
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  style={{ padding: "0 16px" }}
                  onClick={() => navigate("/login")}
                >
                  <CircleUserRoundIcon style={{ marginRight: "8px" }} />
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
                    Kênh của bạn
                  </div>
                  <div
                    style={{
                      fontSize: "14px",

                      color: "#6a6a6a",
                    }}
                  >
                    {nickname || "Người dùng"}
                  </div>
                </>
              )}
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["content"]}
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
};

export default StudioPage;
