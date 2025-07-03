/* eslint-disable no-unused-vars */
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { CircleUserRound, ListVideo } from "lucide-react";
import {
  Layout,
  Menu,
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
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  PlusOutlined,
  HistoryOutlined,
  YoutubeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import logo from "./assets/logo/logo.png";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./contexts/auth.context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useModal } from "./contexts/modal.context";
import UploadPage from "./pages/UploadPage";
import SearchBar from "./components/templates/SearchBar";
import useUserSubscriptions from "./features/channel/hooks/useUserSubscriptions";

const { Header, Content, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { auth, setAuth } = useContext(AuthContext);
  const { pathname } = useLocation();
  const location = useLocation();
  const isUserLoggedIn = auth?.isAuthenticated;
  const playlistPathRegex = /^\/playlist\/[^/]+\/[^/]+$/;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [collapsed, setCollapsed] = useState(
    playlistPathRegex.test(pathname) ? true : isUserLoggedIn ? false : true
  );
  const isVideoWatchPage = location.pathname.startsWith("/watch/");
  const { data } = useUserSubscriptions(auth?.user?.id);
  const userSubscriptionsList = data?.data?.channels || [];
  const [showAllChannels, setShowAllChannels] = useState(false);
  const [openKeys, setOpenKeys] = useState(
    playlistPathRegex.test(pathname) ? [] : ["subscriptions"]
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSearchFocused, setSearchFocused] = useState(false);

  // Theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define menu items
  const getMenuItems = () => {
    let subscriptionChildren = userSubscriptionsList.map((channel) => ({
      key: channel.channelId,
      label: isVideoWatchPage ? (
        <Link
          to={`/channel/${channel.channelId}`}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/channel/${channel.channelId}`;
          }}
          style={{ paddingLeft: 0, display: "flex", alignItems: "center" }}
        >
          <Avatar
            src={channel.channelAvatar}
            size="small"
            style={{ marginRight: 8 }}
          />
          <p>{channel.channelNickname}</p>
        </Link>
      ) : (
        <Link
          to={`/channel/${channel.channelId}`}
          style={{ paddingLeft: 0, display: "flex", alignItems: "center" }}
        >
          <Avatar
            src={channel.channelAvatar}
            size="small"
            style={{ marginRight: 8 }}
          />
          <p>{channel.channelNickname}</p>
        </Link>
      ),
    }));

    if (userSubscriptionsList.length > 5 && !showAllChannels) {
      subscriptionChildren = subscriptionChildren.slice(0, 5);
      subscriptionChildren.push({
        key: "showMore",
        label: (
          <p>
            <DownOutlined style={{ marginRight: 8 }} />
            Xem thêm
          </p>
        ),
        onClick: () => setShowAllChannels(true),
      });
    }

    const menuItems = [
      {
        key: "home",
        icon: <HomeOutlined />,
        label: isVideoWatchPage ? (
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
          >
            Trang chủ
          </Link>
        ) : (
          <Link to="/">Trang chủ</Link>
        ),
        path: "/",
      },
    ];

    if (isUserLoggedIn) {
      menuItems.push(
        {
          type: "divider",
        },
        {
          key: "history",
          icon: <HistoryOutlined />,
          label: isVideoWatchPage ? (
            <Link
              to="/history"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/history";
              }}
            >
              Video đã xem
            </Link>
          ) : (
            <Link to="/history">Video đã xem</Link>
          ),
          path: "/history",
        },
        {
          key: "channel",
          icon: <YoutubeOutlined />,
          label: isVideoWatchPage ? (
            <Link
              to={`/channel/${auth.user.id}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/channel/${auth.user.id}`;
              }}
            >
              Kênh của bạn
            </Link>
          ) : (
            <Link to={`/channel/${auth.user.id}`}>Kênh của bạn</Link>
          ),
          path: `/channel/${auth.user.id}`,
        },
        {
          key: "playlist",
          icon: <ListVideo size={18} />,
          label: isVideoWatchPage ? (
            <Link
              to="/playlist"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/playlist";
              }}
            >
              Danh sách phát
            </Link>
          ) : (
            <Link to="/playlist">Danh sách phát</Link>
          ),
          path: "/playlist",
        },
        {
          key: "subscriptions",
          label: "Kênh đăng ký",
          children: subscriptionChildren,
        },
        {
          key: "studio",
          icon: <AppstoreOutlined />,
          label: isVideoWatchPage ? (
            <Link
              to="/studio"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/studio";
              }}
            >
              Quản lý kênh
            </Link>
          ) : (
            <Link to="/studio">Quản lý kênh</Link>
          ),
          path: "/studio",
        }
      );
    }

    return menuItems;
  };

  const menuItems = getMenuItems();

  const getSelectedKey = () => {
    if (isVideoWatchPage) {
      return "video";
    }
    if (playlistPathRegex.test(location.pathname)) {
      return "playlist";
    }
    const currentItem = menuItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );
    return currentItem ? currentItem.key : "home";
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  useEffect(() => {
    setSelectedKey(getSelectedKey());

    if (playlistPathRegex.test(location.pathname)) {
      setCollapsed(true);
      setOpenKeys([]);
    } else {
      setCollapsed(isUserLoggedIn && windowWidth >= 1000 ? false : true);
      setOpenKeys(["subscriptions"]);
    }

    if (isVideoWatchPage || windowWidth < 1000) {
      setDrawerVisible(false);
    }
  }, [location.pathname, isUserLoggedIn, isVideoWatchPage, windowWidth]);

  const avatarSrc = isUserLoggedIn ? auth.user?.avatar : null;
  const displayName = isUserLoggedIn ? auth.user?.user_name : "";

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      if (isUserLoggedIn) {
        setAuth({ isAuthenticated: false, user: {} });
        localStorage.removeItem("authUser");
      }
      setIsLoggingOut(false);
      isVideoWatchPage ? (window.location.href = "/") : navigate("/");
    }, 2000);
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      onClick: () =>
        isVideoWatchPage
          ? (window.location.href = "/profile")
          : navigate("/profile"),
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
    if (isVideoWatchPage || windowWidth < 1000) {
      showDrawer();
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleUploadClick = () => {
    isVideoWatchPage ? (window.location.href = "/studio") : navigate("/studio");
    openModal(<UploadPage navigate={navigate} />);
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
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
            {!isSearchFocused && (
              <Col span={1}>
                <Button
                  icon={<MenuOutlined />}
                  onClick={toggleMenu}
                  style={{
                    border: "none",
                    fontSize: windowWidth < 600 ? "14px" : "18px",
                    marginRight: "16px",
                  }}
                />
              </Col>
            )}
            {!isSearchFocused && windowWidth > 600 && (
              <Col span={windowWidth < 600 ? 2 : 5}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    cursor: "pointer",
                    width: "fit-content",
                    gap: "8px",
                  }}
                  onClick={handleLogoClick}
                >
                  <img
                    src={logo}
                    style={{
                      height: windowWidth < 720 ? 25 : 35,
                      width: "auto",
                    }}
                    alt="logo"
                  />
                  <Typography.Text
                    style={{
                      fontSize: windowWidth < 720 ? 14 : 18,
                      fontWeight: "bold",
                      display: windowWidth < 600 ? "none" : "block",
                    }}
                  >
                    CUSC Tube
                  </Typography.Text>
                </div>
              </Col>
            )}
            <Col
              span={isSearchFocused ? 24 : 12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <SearchBar
                setSearchFocused={setSearchFocused}
                isSearchFocused={isSearchFocused}
              />
            </Col>
            {!isSearchFocused && (
              <Col
                sm={3}
                md={3}
                lg={windowWidth < 1100 ? 2 : 3}
                xl={3}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {isUserLoggedIn && (
                  <Button
                    size={windowWidth < 700 ? "small" : "middle"}
                    color="primary"
                    variant="outlined"
                    style={{
                      fontSize: "16px",
                      marginLeft: "16px",
                    }}
                    onClick={handleUploadClick}
                  >
                    <PlusOutlined />
                    {windowWidth > 1100 && "Đăng tải"}
                  </Button>
                )}
              </Col>
            )}
            {!isSearchFocused && (
              <Col
                sm={2}
                md={2}
                lg={windowWidth < 1100 ? 2 : 3}
                xl={3}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {isUserLoggedIn ? (
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <Space style={{ cursor: "pointer" }}>
                      <Avatar
                        src={avatarSrc}
                        icon={!avatarSrc && <CircleUserRound />}
                      />
                      <span style={{ display: windowWidth < 1100 && "none" }}>
                        {displayName}
                      </span>
                    </Space>
                  </Dropdown>
                ) : (
                  <Button
                    type="primary"
                    style={{ padding: "0 16px" }}
                    onClick={() =>
                      isVideoWatchPage
                        ? (window.location.href = "/login")
                        : navigate("/login")
                    }
                  >
                    <CircleUserRound style={{ marginRight: "8px" }} />
                    Đăng nhập
                  </Button>
                )}
              </Col>
            )}
          </Row>
        </Header>

        <Layout style={{ marginTop: "64px" }}>
          {!(isVideoWatchPage || windowWidth < 1000) && (
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
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                items={menuItems}
                style={{ height: "100%", borderRight: 0 }}
              />
            </Sider>
          )}

          {(isVideoWatchPage || windowWidth < 1000) && (
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
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                items={menuItems}
                style={{ borderRight: 0 }}
              />
            </Drawer>
          )}

          <Content
            style={{
              marginLeft:
                isVideoWatchPage || windowWidth < 1000
                  ? "0px"
                  : collapsed
                  ? "80px"
                  : "200px",
              padding: "8px",
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
