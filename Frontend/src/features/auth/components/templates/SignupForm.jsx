import { Form, Input, Button, Card, Row, Col, DatePicker, Spin } from "antd";
import { useSignup } from "../../hooks/useSignup";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const { mutate: signupMutation } = useSignup();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    // <Row justify="center" align="middle" style={{ minHeight: "100vh", position: "relative" }}>

    //     {loading && (
    //         <div
    //             style={{
    //                 position: "absolute",
    //                 top: 0,
    //                 left: 0,
    //                 width: "100%",
    //                 height: "100%",
    //                 backgroundColor: "rgba(0, 0, 0, 0.3)",
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //                 zIndex: 1000,
    //             }}
    //         >
    //             <Spin size="large" />
    //         </div>
    //     )}

    <Col xs={0} md={10}>
      <Card
        style={{
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}
        >
          Đăng Ký
        </h2>
        <p style={{ textAlign: "center", color: "#666" }}>Điền vào thông tin</p>

        <Form
          name="signup-form"
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            label="Tên hiển thị"
            name="user_name"
            rules={[
              { required: true, message: "Hãy nhập tên" },
              {
                pattern: /^[\p{L}\s]+$/u,
                message: "Tên đăng nhập không hợp lệ",
              },
            ]}
          >
            <Input size="large" placeholder="Nguyễn Nhật Duy" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Hãy nhập email" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input size="large" placeholder="example@gmail.com" />
          </Form.Item>
          <Form.Item
            label="Tên Kênh"
            name="nickname"
            rules={[
              { required: true, message: "Hãy nhập tên kênh của bạn" },
              {
                message: "Tên kênh không hợp lệ",
              },
            ]}
          >
            <Input size="large" placeholder="Truetube" />
          </Form.Item>

          <Form.Item
            label="Mật Khẩu"
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
          >
            <Input.Password size="large" placeholder="Yumzy123@" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
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
          >
            <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: "Hãy nhập ngày sinh" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Chọn ngày sinh"
              style={{ width: "100%" }}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ height: "35px" }}
            >
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </Form.Item>
          <Button
            type="default"
            block
            size="large"
            onClick={() => navigate("/")}
            style={{ marginTop: "0px", height: "35px" }}
          >
            Quay về trang chủ
          </Button>

          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Bạn có tài khoản?{" "}
            <a href="/login" style={{ color: "#c90626", fontWeight: "bold" }}>
              Đăng Nhập
            </a>
          </p>
        </Form>
      </Card>
    </Col>
    //</Row>
  );
};

export default SignupForm;
