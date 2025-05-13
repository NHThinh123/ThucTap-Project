import { Row } from "antd";
import Illustration from "../features/auth/components/organisms/RegisterIllustration";
import LoginForm from "../features/auth/components/templates/LoginForm";

const LoginPage = () => {
  return (
    <Row
      style={{
        minHeight: "100vh",
        alignItems: "center",
        //background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
        overflow: "hidden",
      }}
    >
      <Illustration />
      <LoginForm />
    </Row>
  );
};

export default LoginPage;