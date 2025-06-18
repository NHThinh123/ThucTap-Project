import React from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import UserListTable from "../features/admin/components/templates/UserListTable";

const { Title } = Typography;

const AdminListUserPage = () => {
  const navigate = useNavigate();

  return (
    <Card
      title={<Title level={3}>Danh sách người dùng</Title>}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/users/create")}
        >
          Thêm người dùng
        </Button>
      }
      style={{ margin: "16px" }}
    >
      <UserListTable />
    </Card>
  );
};

export default AdminListUserPage;
