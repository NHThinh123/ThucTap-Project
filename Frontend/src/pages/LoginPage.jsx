import { Row } from "antd";
import Illustration from "../features/auth/components/organisms/RegisterIllustration";
import LoginForm from "../features/auth/components/templates/LoginForm";

const LoginPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
        display: "flex",
        alignItems: "center",
        padding: "0",
        overflow: "hidden",
      }}
    >
      <Row
        style={{
          width: "100%",
          minHeight: "100vh",
          margin: 0,
        }}
        align="middle"
        gutter={0}
      >
        <Illustration />
        <LoginForm />
      </Row>
    </div>
  );
};

export default LoginPage;