import { Form, Input, Button, Card, Row, Col, Spin } from "antd";
import { useLogin } from "../../hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const { mutate: loginMutation } = useLogin();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values) => {
        setLoading(true);
        loginMutation(values, {
            onSettled: () => setLoading(false),
        });
    };

    return (
        

        <Col xs={0} md={10} >
            <Card
                style={{
                    padding: "2rem",
                    borderRadius: "15px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#1a73e8",
                        marginBottom: "10px",
                        //fontFamily: "'Poppins', sans-serif",
                    }}
                >
                    Đăng Nhập
                </h2>


                <Form
                    name="login-form"
                    layout="vertical"
                    onFinish={onFinish}
                    disabled={loading}
                    style={{ marginTop: "20px" }}
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
                            placeholder="yumzy123@gmail.com"
                            autoComplete="email"
                            style={{
                                borderRadius: "8px",
                                transition: "all 0.3s",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật Khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="********"
                            autoComplete="current-password"
                            style={{
                                borderRadius: "8px",
                                transition: "all 0.3s",
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                height: "45px",
                                borderRadius: "8px",
                                background: "#1a73e8",
                                border: "none",
                                transition: "all 0.3s",

                            }}

                        >
                            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                        </Button>
                    </Form.Item>
                    <Button
                        type="default"
                        block
                        size="large"
                        onClick={() => navigate("/")}
                        style={{
                            height: "45px",
                            borderRadius: "8px",
                            marginTop: "10px",

                            transition: "all 0.3s",
                        }}
                    >
                        Quay về trang chủ
                    </Button>

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <p>
                            Bạn chưa có tài khoản?{" "}
                            <a href="/signup" style={{ color: "#1a73e8", fontWeight: "600" }}>
                                Đăng Ký
                            </a>
                        </p>
                        <p>
                            Quên mật khẩu?{" "}
                            <a href="/resetpassword" style={{ color: "#1a73e8", fontWeight: "600" }}>
                                Đặt lại mật khẩu
                            </a>
                        </p>

                    </div>
                </Form>
            </Card>
        </Col>
        //</Row>
    );
};

export default LoginForm;