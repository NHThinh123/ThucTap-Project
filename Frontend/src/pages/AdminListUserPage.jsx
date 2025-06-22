import React, { useState } from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import UserListTable from "../features/admin/components/templates/UserListTable";
import AddUserModal from "../features/admin/components/organisms/AddUserModal";

const { Title } = Typography;

const AdminListUserPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries(["users"]);
  };

  return (
    <Card
      title={<Title level={3}>Danh sách người dùng</Title>}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          Thêm người dùng
        </Button>
      }
      style={{ margin: "16px" }}
    >
      <UserListTable />
      <AddUserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </Card>
  );
};

export default AdminListUserPage;
