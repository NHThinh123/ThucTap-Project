import { Form, Input, Button, Card, Row, Col, DatePicker, Spin } from "antd";
import { useSignup } from "../../hooks/useSignup";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const { mutate: signupMutation } = useSignup();
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
    signupMutation(
      {
        email: values.email,
        password: values.password,
        user_name: values.user_name,
        nickname: values.nickname,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        role: "user",
      },
      {
        onSettled: () => setLoading(false),
      }
    );
  };

  // Chặn ngày sinh lớn hơn ngày hiện tại
  const disabledDate = (current) =>
    current && current.isAfter(dayjs().endOf("day"));

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
              top: "10%",
              left: "8%",
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              animation: "float 7s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "70%",
              right: "12%",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              animation: "float 5s ease-in-out infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              left: "20%",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              animation: "float 9s ease-in-out infinite",
            }}
          />
        </>
      )}

      <Card
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "500px",
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
        <div style={{ textAlign: "center", marginBottom: isMobile ? "20px" : "24px" }}>
          <h2
            style={{
              fontSize: isMobile ? "26px" : "clamp(24px, 5vw, 32px)",
              fontWeight: "700",
              color: "#c90626",
              marginBottom: "8px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Đăng Ký
          </h2>
          <p style={{ color: "#666", fontSize: isMobile ? "15px" : "14px" }}>
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>

        <Form
          name="signup-form"
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          size={isMobile ? "middle" : "large"}
        >
          {/* Row 1: Tên hiển thị và Email */}
          <Row gutter={isMobile ? 0 : 16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Tên hiển thị</span>}
                name="user_name"
                rules={[
                  { required: true, message: "Hãy nhập tên" },
                  {
                    pattern: /^[\p{L}\s]+$/u,
                    message: "Tên không hợp lệ",
                  },
                ]}
                style={{ marginBottom: isMobile ? "16px" : "16px" }}
              >
                <Input 
                  size={isMobile ? "large" : "large"} 
                  placeholder="Nguyễn Nhật Duy"
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "12px 14px" : "10px 12px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Hãy nhập email" },
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email không hợp lệ",
                  },
                ]}
                style={{ marginBottom: isMobile ? "16px" : "16px" }}
              >
                <Input 
                  size={isMobile ? "large" : "large"} 
                  placeholder="example@gmail.com"
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "12px 14px" : "10px 12px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Tên Kênh và Ngày sinh */}
          <Row gutter={isMobile ? 0 : 16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Tên Kênh</span>}
                name="nickname"
                rules={[
                  { required: true, message: "Hãy nhập tên kênh" },
                ]}
                style={{ marginBottom: isMobile ? "16px" : "16px" }}
              >
                <Input 
                  size={isMobile ? "large" : "large"} 
                  placeholder="CUSCTube"
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "12px 14px" : "10px 12px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Ngày sinh</span>}
                name="dateOfBirth"
                rules={[{ required: true, message: "Hãy nhập ngày sinh" }]}
                style={{ marginBottom: isMobile ? "16px" : "16px" }}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày sinh"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    padding: isMobile ? "12px 14px" : "10px 12px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  size={isMobile ? "large" : "large"}
                  disabledDate={disabledDate}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Mật khẩu và Xác nhận mật khẩu */}
          <Row gutter={isMobile ? 0 : 16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Mật Khẩu</span>}
                name="password"
                rules={[
                  { required: true, message: "Hãy nhập mật khẩu" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                  {
                    pattern:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/,
                    message: "Mật khẩu phải có chữ Hoa, số, ký tự đặc biệt",
                  },
                ]}
                style={{ marginBottom: isMobile ? "16px" : "16px" }}
              >
                <Input.Password 
                  size={isMobile ? "large" : "large"} 
                  placeholder="Yumzy123@"
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "12px 14px" : "10px 12px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontSize: isMobile ? "15px" : "14px", fontWeight: "500" }}>Xác nhận mật khẩu</span>}
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Hãy xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
                style={{ marginBottom: isMobile ? "20px" : "20px" }}
              >
                <Input.Password 
                  size={isMobile ? "large" : "large"} 
                  placeholder="Nhập lại mật khẩu"
                  style={{
                    borderRadius: "8px",
                    padding: isMobile ? "12px 14px" : "10px 12px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Buttons */}
          <Form.Item style={{ marginBottom: "12px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                height: isMobile ? "52px" : "48px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
                border: "none",
                fontSize: isMobile ? "17px" : "16px",
                fontWeight: "600",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => !isMobile && (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !isMobile && (e.target.style.transform = "translateY(0)")}
            >
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: isMobile ? "16px" : "20px" }}>
            <Button
              type="default"
              block
              size="large"
              onClick={() => navigate("/")}
              style={{
                height: isMobile ? "50px" : "48px",
                borderRadius: "8px",
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
            <p style={{ margin: "0", fontSize: isMobile ? "15px" : "14px" }}>
              Bạn có tài khoản?{" "}
              <a 
                href="/login" 
                style={{ 
                  color: "#000", 
                  fontWeight: "600",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                Đăng Nhập
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
            transform: translateY(-12px);
          }
        }
      `}</style>
    </Col>
  );
};

export default SignupForm;
