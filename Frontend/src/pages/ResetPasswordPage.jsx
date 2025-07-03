import { Row } from "antd";
import Illustration from "../features/auth/components/organisms/RegisterIllustration";
import ResetPasswordForm from "../features/auth/components/templates/ResetPasswordForm";

const ResetPasswordPage = () => {
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
        <ResetPasswordForm />
      </Row>
    </div>
  );
};

export default ResetPasswordPage; 