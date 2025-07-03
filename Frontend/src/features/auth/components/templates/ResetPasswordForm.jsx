import { Form, Input, Button, Card, Col, Steps } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckEmailExists, useResetPasswordSimple } from "../../hooks/useResetPassword";

const { Step } = Steps;

const ResetPasswordForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const checkEmailMutation = useCheckEmailExists();
  const resetPasswordMutation = useResetPasswordSimple();

  // Bước 1: Xác minh email
  const onFinishEmailStep = async (values) => {
    setLoading(true);
    try {
      const response = await checkEmailMutation.mutateAsync(values.email);
      if (response.status === "SUCCESS") {
        setVerifiedEmail(values.email);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Check email error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Đặt mật khẩu mới
  const onFinishPasswordStep = async (values) => {
    setLoading(true);
    try {
      await resetPasswordMutation.mutateAsync({
        email: verifiedEmail,
        newPassword: values.newPassword
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmailStep = () => {
    setCurrentStep(0);
    setVerifiedEmail("");
  };

  return (
    <Col 
      xs={24} 
      sm={24} 
      md={12} 
      lg={10} 
      xl={8}
      style={{
        background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "10%",
          width: "85px",
          height: "85px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          margin: "auto",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: "700",
              color: "#c90626",
              marginBottom: "20px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Đặt Lại Mật Khẩu
          </h2>

          <Steps current={currentStep} size="small" style={{ marginBottom: "20px" }}>
            <Step title="Xác minh Email" />
            <Step title="Mật khẩu mới" />
          </Steps>
        </div>

        {currentStep === 0 && (
          <div>
            <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px", textAlign: "center" }}>
              Nhập email để xác minh tài khoản của bạn
            </p>
            
            <Form
              name="email-verification-form"
              layout="vertical"
              onFinish={onFinishEmailStep}
              disabled={loading}
              size="large"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
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
                  loading={loading || checkEmailMutation.isPending}
                  style={{
                    height: "50px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    boxShadow: "0 4px 15px rgba(201, 6, 38, 0.3)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  {loading || checkEmailMutation.isPending ? "Đang xác minh..." : "Xác minh Email"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px", textAlign: "center" }}>
              Nhập mật khẩu mới cho tài khoản: <strong>{verifiedEmail}</strong>
            </p>
            
            <Form
              name="new-password-form"
              layout="vertical"
              onFinish={onFinishPasswordStep}
              disabled={loading}
              size="large"
            >
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/,
                    message: "Mật khẩu phải có chữ Hoa, số, ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Nhập mật khẩu mới"
                  autoComplete="new-password"
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#c90626"}
                  onBlur={(e) => e.target.style.borderColor = "#f0f0f0"}
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmNewPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    transition: "all 0.3s",
                    border: "2px solid #f0f0f0",
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
                  loading={loading || resetPasswordMutation.isPending}
                  style={{
                    height: "50px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    boxShadow: "0 4px 15px rgba(201, 6, 38, 0.3)",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  {loading || resetPasswordMutation.isPending ? "Đang cập nhật..." : "Đặt Lại Mật Khẩu"}
                </Button>
              </Form.Item>

              <Form.Item style={{ marginBottom: "16px" }}>
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={goBackToEmailStep}
                  disabled={loading}
                  style={{
                    height: "50px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "500",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  }}
                >
                  Quay lại bước trước
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        <Form.Item style={{ marginBottom: "24px" }}>
          <Button
            type="default"
            block
            size="large"
            onClick={() => navigate("/login")}
            style={{
              height: "50px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "500",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
          >
            Quay lại đăng nhập
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <p style={{ margin: "10px 0", fontSize: "14px" }}>
            Chưa có tài khoản?{" "}
            <a 
              href="/signup" 
              style={{ 
                color: "#fff", 
                fontWeight: "600",
                textDecoration: "none",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
              Đăng Ký Ngay
            </a>
          </p>
        </div>
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

export default ResetPasswordForm; 