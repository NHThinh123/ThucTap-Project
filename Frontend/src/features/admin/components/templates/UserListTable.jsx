import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag, Avatar } from "antd";
import Highlighter from "react-highlight-words";

import { useUserList } from "../../hooks/useUserList";
import UserActions from "./UserAction";

const UserListTable = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);

  const { data, isLoading, isError, error } = useUserList({
    page,
    pageSize,
    search: searchText,
  });

  // Xử lý dữ liệu để đảm bảo data là mảng
  const users = Array.isArray(data) ? data : [];

  if (isError) {
    return (
      <div style={{ color: "red", padding: "16px" }}>
        Lỗi: {error?.message || "Không thể tải danh sách người dùng."}
      </div>
    );
  }

  if (!isLoading && users.length === 0) {
    return <div style={{ padding: "16px" }}>Không có người dùng nào.</div>;
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setPage(1);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar
          src={
            avatar ||
            "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
          }
          size={40}
        />
      ),
      width: "10%",
    },
    {
      title: "Tên",
      dataIndex: "user_name",
      key: "user_name",
      ...getColumnSearchProps("user_name"),
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      width: "20%",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role?.toUpperCase()}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => <UserActions userId={record._id} />,
      width: "15%",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={isLoading}
      pagination={{
        style: { justifyContent: "center" },
        current: page,
        pageSize: pageSize,
        total: users.length,
        onChange: (newPage, newPageSize) => {
          setPage(newPage);
          setPageSize(newPageSize);
        },
      }}
      rowKey="_id"
    />
  );
};

export default UserListTable;
