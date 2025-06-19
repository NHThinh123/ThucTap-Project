import React from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserListTable from "../features/admin/components/templates/UserListTable";

const { Title } = Typography;

const AdminListUserPage = () => {
  return (
    <Card
      title={<Title level={3}>Danh sách người dùng</Title>}
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
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
