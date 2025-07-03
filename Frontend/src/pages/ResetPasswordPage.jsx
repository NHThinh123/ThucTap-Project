import { Row } from "antd";
import { useState, useEffect } from "react";
import Illustration from "../features/auth/components/organisms/RegisterIllustration";
import ResetPasswordForm from "../features/auth/components/templates/ResetPasswordForm";

const ResetPasswordPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "16px" : "0",
        overflow: "hidden",
      }}
    >
      {isMobile ? (
        // Mobile layout - chỉ hiển thị form
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ResetPasswordForm />
        </div>
      ) : (
        // Desktop layout - hiển thị cả illustration và form
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
      )}
    </div>
  );
};

export default ResetPasswordPage; 