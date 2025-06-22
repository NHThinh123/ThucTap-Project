import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Space,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { useFetchUser } from "../../hooks/useFetchUser";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useDeleteUser } from "../../hooks/useDeleteUser";

const UserActions = ({ userId }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();
  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
    error,
  } = useFetchUser(userId, isEditModalVisible);

  // Debug dữ liệu API
  useEffect(() => {}, [userData, isUserLoading, isError, error]);

  // Điền dữ liệu vào form khi nhận được user data
  useEffect(() => {
    if (userData && !isUserLoading && isEditModalVisible) {
      const user = userData.user || userData;
      form.setFieldsValue({
        user_name: user.user_name || "",
        nickname: user.nickname || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        role: user.role,
      });
    }
  }, [userData, isUserLoading, isEditModalVisible, form]);

  const handleEdit = () => {
    setIsEditModalVisible(true);
    form.resetFields();
  };

  const handleDelete = () => {
    deleteUser(userId);
    setIsDeleteModalVisible(false);
  };

  const handleEditSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        updateUser({
          userId,
          data: {
            user_name: values.user_name,
            nickname: values.nickname,
            email: values.email,
            dateOfBirth: values.dateOfBirth
              ? values.dateOfBirth.format("YYYY-MM-DD")
              : null,
            role: values.role,
          },
        });
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <Space>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={handleEdit}
        size="small"
        style={{
          marginRight: 8,
          color: "#000",
        }}
      ></Button>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        loading={isDeleting}
        size="small"
        onClick={() => setIsDeleteModalVisible(true)}
        style={{
          color: "#000",
          marginLeft: 8,
        }}
      ></Button>
      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ loading: isUpdating }}
        destroyOnClose
      >
        {isUserLoading ? (
          <Spin tip="Đang tải thông tin..." />
        ) : isError ? (
          <p style={{ color: "red" }}>
            Lỗi: {error?.message || "Không thể tải thông tin người dùng."}
          </p>
        ) : (
          <Form form={form} layout="vertical" preserve={false}>
            <Form.Item
              name="user_name"
              label="Tên"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nickname"
              label="Tên Kênh"
              rules={[{ required: true, message: "Vui lòng nhập biệt danh!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, disabled: isDeleting }}
      >
        <p>Bạn có chắc muốn xóa người dùng này?</p>
      </Modal>
    </Space>
  );
};

export default UserActions;
