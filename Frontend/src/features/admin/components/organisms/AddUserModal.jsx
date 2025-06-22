import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Spin,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import useCreateUser from "../../hooks/useCreateUser";
import dayjs from "dayjs";
import "animate.css";

const { Option } = Select;

const AddUserModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const { mutate: createUserMutation, isPending } = useCreateUser(
    form,
    onSuccess,
    onClose
  );

  const handleSubmit = (values) => {
    const formattedValues = {
      user_name: values.user_name || "",
      email: values.email || "",
      password: values.password || "",
      nickname: values.nickname || "",
      dateOfBirth: values.dateOfBirth
        ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
        : null,
      role: values.role || "user",
    };
    createUserMutation(formattedValues);
  };

  const handleCancel = () => {
    if (isDirty) {
      Modal.confirm({
        title: "Xác nhận đóng",
        content: "Dữ liệu chưa được lưu. Bạn có chắc muốn đóng không?",
        okText: "Đóng",
        cancelText: "Hủy",
        onOk: () => {
          form.resetFields();
          setIsDirty(false);
          onClose();
        },
      });
    } else {
      form.resetFields();
      onClose();
    }
  };

  const handleFormChange = () => {
    if (!isDirty) setIsDirty(true);
  };

  return (
    <Modal
      title={
        <h2 style={{ margin: 0, color: "#1a1a1a", textAlign: "center" }}>
          Thêm người dùng mới
        </h2>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      style={{ top: 20 }}
      bodyStyle={{
        padding: "24px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Spin spinning={isPending}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          <Form.Item
            name="user_name"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Nhập tên đăng nhập"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              placeholder="Nhập email"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              placeholder="Nhập mật khẩu"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>

          <Form.Item
            name="nickname"
            label={
              <Tooltip title="Tên hiển thị trên hệ thống">
                <span>Tên kênh</span>
              </Tooltip>
            }
            rules={[{ required: true, message: "Vui lòng nhập tên kênh!" }]}
          >
            <Input
              prefix={<VideoCameraOutlined style={{ color: "#1890ff" }} />}
              placeholder="Nhập tên kênh"
              style={{ borderRadius: "4px" }}
            />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%", borderRadius: "4px" }}
              placeholder="Chọn ngày sinh"
              prefix={<CalendarOutlined />}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              showSearch
              optionFilterProp="children"
              style={{ borderRadius: "4px" }}
              suffixIcon={<TeamOutlined style={{ color: "#1890ff" }} />}
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginTop: "24px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              style={{
                borderRadius: "4px",
                padding: "0 24px",
                height: "40px",
                background: "#c90626",
                borderColor: "#c90626",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#e61735")}
              onMouseLeave={(e) => (e.target.style.background = "#c90626")}
            >
              Tạo
            </Button>
            <Button
              style={{
                marginLeft: 8,
                borderRadius: "4px",
                padding: "0 24px",
                height: "40px",
                transition: "all 0.3s",
              }}
              onClick={handleCancel}
              onMouseEnter={(e) => (e.target.style.borderColor = "#ff4d4f")}
              onMouseLeave={(e) => (e.target.style.borderColor = "#d9d9d9")}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddUserModal;
