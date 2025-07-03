import React, { useRef, useState, useEffect } from "react";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchInput = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const { data, isLoading, isError, error } = useUserList({
    page,
    pageSize,
    search: searchText,
  });

  // Xử lý dữ liệu để đảm bảo data là mảng
  const users = Array.isArray(data) ? data : [];

  if (isError) {
    return (
      <div style={{ 
        color: "red", 
        padding: "16px", 
        textAlign: "center",
        fontSize: windowWidth < 576 ? "14px" : "16px"
      }}>
        Lỗi: {error?.message || "Không thể tải danh sách người dùng."}
      </div>
    );
  }

  if (!isLoading && users.length === 0) {
    return (
      <div style={{ 
        padding: "16px", 
        textAlign: "center", 
        color: "#666",
        fontSize: windowWidth < 576 ? "14px" : "16px"
      }}>
        Không có người dùng nào.
      </div>
    );
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

  // Responsive columns configuration
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
          size={isMobile ? 32 : 40}
        />
      ),
      width: isMobile ? "15%" : "10%",
      fixed: isMobile ? false : "left",
    },
    {
      title: "Tên",
      dataIndex: "user_name",
      key: "user_name",
      ...getColumnSearchProps("user_name"),
      width: isMobile ? "35%" : "25%",
      ellipsis: true,
      render: (text) => (
        <div style={{ 
          fontWeight: "500",
          fontSize: isMobile ? "14px" : "16px"
        }}>
          {searchedColumn === "user_name" ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      width: isMobile ? "40%" : "30%",
      ellipsis: true,
      responsive: isMobile ? [] : ["sm"],
      render: (text) => (
        <div style={{ 
          fontSize: isMobile ? "12px" : "14px",
          color: "#666"
        }}>
          {searchedColumn === "email" ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag 
          color={role === "admin" ? "red" : "blue"}
          style={{ fontSize: isMobile ? "11px" : "12px" }}
        >
          {role?.toUpperCase()}
        </Tag>
      ),
      width: isMobile ? "20%" : "15%",
      responsive: isMobile ? [] : ["md"],
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => <UserActions userId={record._id} />,
      width: isMobile ? "15%" : "20%",
      fixed: isMobile ? false : "right",
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        bordered={false}
        scroll={{ 
          x: isMobile ? 800 : 1000,
          y: window.innerHeight > 800 ? 400 : 300 
        }}
        pagination={{
          style: { 
            justifyContent: "center",
            marginTop: "16px"
          },
          current: page,
          pageSize: pageSize,
          total: users.length,
          showSizeChanger: !isMobile,
          showQuickJumper: !isMobile,
          showTotal: (total, range) => 
            isMobile 
              ? `${range[0]}-${range[1]} / ${total}`
              : `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} người dùng`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
          responsive: true,
          size: isMobile ? "small" : "default",
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        rowKey="_id"
        size={isMobile ? "small" : "middle"}
        className="responsive-table"
      />
    </div>
  );
};

export default UserListTable;
