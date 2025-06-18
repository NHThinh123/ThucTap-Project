import React, { useState } from "react";
import { Button, Modal, Space, Form, Input, DatePicker, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import { useFetchUser } from "../../hooks/useFetchUser";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useDeleteUser } from "../../hooks/useDeleteUser";

const UserActions = ({ userId }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();
  const { data: user, isLoading: isUserLoading } = useFetchUser(
    userId,
    isEditModalVisible
  );

  // Điền dữ liệu vào form khi lấy được thông tin người dùng
  if (user && isEditModalVisible && !isUserLoading) {
    form.setFieldsValue({
      user_name: user.user_name,
      nickname: user.nickname,
      email: user.email,
      dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
      role: user.role,
    });
  }

  const handleEdit = () => {
    setIsEditModalVisible(true);
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
            email: values.email,
            nickname: values.nickname,
            dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
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
        type="primary"
        icon={<EditOutlined />}
        onClick={handleEdit}
        size="small"
        style={{
          backgroundColor: "#52c41a",
          borderColor: "#52c41a",
          color: "#fff",
        }}
      >
        Cập nhật
      </Button>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        loading={isDeleting}
        size="small"
        onClick={() => setIsDeleteModalVisible(true)}
      >
        Xóa
      </Button>
      {/* Modal chỉnh sửa */}
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
          <p>Đang tải thông tin...</p>
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
              <Select>
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/* Modal xóa */}
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
