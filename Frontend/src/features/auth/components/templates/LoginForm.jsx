import { Form, Input, Button, Card, Row, Col, Spin } from "antd";
import { useLogin } from "../../hooks/useLogin";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { mutate: loginMutation } = useLogin();
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const onFinish = (values) => {
    setLoading(true);
    loginMutation(values, {
      onSettled: () => setLoading(false),
    });
  };

  return (
    <Col 
      xs={24} 
      sm={24} 
      md={12} 
      lg={10} 
      xl={8}
      style={{
        background: isMobile ? "transparent" : "linear-gradient(135deg, #e74c3c 0%, #e74c3c 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "0" : "20px",
        minHeight: isMobile ? "auto" : "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements - chỉ hiện trên desktop */}
      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              top: "15%",
              right: "10%",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "15%",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />
        </>
      )}

      <Card
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "450px",
          padding: isMobile ? "1.5rem" : "2rem",
          borderRadius: isMobile ? "20px" : "15px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          margin: "auto",
          zIndex: 2,
          boxShadow: isMobile ? "0 10px 40px rgba(0, 0, 0, 0.2)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: isMobile ? "24px" : "30px" }}>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "clamp(24px, 5vw, 32px)",
              fontWeight: "700",
              color: "#c90626",
              marginBottom: "10px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Đăng Nhập
          </h2>
          <p style={{ color: "#666", fontSize: isMobile ? "15px" : "14px" }}>
            Chào mừng bạn quay trở lại!
          </p>
        </div>

        <Form
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          size={isMobile ? "middle" : "large"}
        >
          <Form.Item
            label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              size={isMobile ? "large" : "large"}
              placeholder="yumzy123@gmail.com"
              autoComplete="email"
              style={{
                borderRadius: "10px",
                padding: isMobile ? "14px 16px" : "12px 16px",
                transition: "all 0.3s",
                border: "2px solid #f0f0f0",
                fontSize: isMobile ? "16px" : "14px",
              }}
              onFocus={(e) => e.target.style.borderColor = "#c90626"}
              onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Mật Khẩu</span>}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              size={isMobile ? "large" : "large"}
              placeholder="********"
              autoComplete="current-password"
              style={{
                borderRadius: "10px",
                padding: isMobile ? "14px 16px" : "12px 16px",
                transition: "all 0.3s",
                border: "2px solid #f0f0f0",
                fontSize: isMobile ? "16px" : "14px",
              }}
              onFocus={(e) => e.target.style.borderColor = "#c90626"}
              onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "16px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                height: isMobile ? "54px" : "50px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
                border: "none",
                fontSize: isMobile ? "17px" : "16px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(201, 6, 38, 0.3)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => !isMobile && (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !isMobile && (e.target.style.transform = "translateY(0)")}
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: isMobile ? "20px" : "24px" }}>
            <Button
              type="default"
              block
              size="large"
              onClick={() => navigate("/")}
              style={{
                height: isMobile ? "52px" : "50px",
                borderRadius: "10px",
                fontSize: isMobile ? "16px" : "16px",
                fontWeight: "500",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#000",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }
              }}
            >
              Quay về trang chủ
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "10px 0", fontSize: isMobile ? "15px" : "14px" }}>
              Bạn chưa có tài khoản?{" "}
              <a 
                href="/signup" 
                style={{ 
                  color: "#000", 
                  fontWeight: "600",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                Đăng Ký
              </a>
            </p>
            <p style={{ margin: "10px 0", fontSize: isMobile ? "15px" : "14px" }}>
              Quên mật khẩu?{" "}
              <a
                href="/resetpassword"
                style={{ 
                  color: "#000", 
                  fontWeight: "600",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                Đặt lại mật khẩu
              </a>
            </p>
          </div>
        </Form>
      </Card>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </Col>
  );
};

export default LoginForm;
