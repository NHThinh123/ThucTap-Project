import { Outlet, Link } from "react-router-dom";
import { Layout, Menu } from "antd";

const { Header, Content } = Layout;

function App() {
  const menuItems = [
    { key: "home", label: <Link to="/">Home</Link> },
    { key: "video", label: <Link to="/video">Video</Link> },
    { key: "login", label: <Link to="/login">Login</Link> },
    { key: "signup", label: <Link to="/signup">Signup</Link> },
    { key: "channel", label: <Link to="/channel">Channel</Link> },
  ];

  return (
    <Layout>
      <div
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
        }}
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["home"]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </div>
      <Content
        style={{
          padding: "24px",
          marginTop: "32px",
          minHeight: "calc(100vh - 32px)",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}

export default App;
