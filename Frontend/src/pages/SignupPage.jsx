import { Row } from "antd";
import Illustration from "../features/auth/components/organisms/RegisterIllustration";
import SignupForm from "../features/auth/components/templates/SignupForm";

const SignupPage = () => {
  return (
    <Row
      style={{
        minHeight: "100vh",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Illustration />
      <SignupForm />
    </Row>
  );
};

export default SignupPage;
