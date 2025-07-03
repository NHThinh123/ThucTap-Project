import React, { useState, useEffect } from "react";
import { Button, Card, Typography, Row, Col, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import UserListTable from "../features/admin/components/templates/UserListTable";
import AddUserModal from "../features/admin/components/organisms/AddUserModal";

const { Title } = Typography;

const AdminListUserPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 576;
  const isTablet = windowWidth < 768;

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
    <div style={{ padding: "0" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card
            title={
              <Row justify="space-between" align="middle" wrap>
                <Col xs={24} sm={16} md={18} lg={18}>
                  <Title level={3} style={{ margin: 0 }}>
                    Danh sách người dùng
                  </Title>
                </Col>
                <Col xs={24} sm={8} md={6} lg={6}>
                  <div 
                    style={{ 
                      display: "flex", 
                      justifyContent: isMobile ? "center" : "flex-end",
                      marginTop: isMobile ? "12px" : "0"
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenModal}
                      style={{
                        width: isMobile ? "100%" : "auto",
                        minWidth: !isMobile ? "140px" : "auto"
                      }}
                      size={isTablet ? "middle" : "large"}
                    >
                      <span style={{ display: windowWidth < 480 ? "none" : "inline" }}>
                        Thêm người dùng
                      </span>
                      <span style={{ display: windowWidth >= 480 ? "none" : "inline" }}>
                        Thêm
                      </span>
                    </Button>
                  </div>
                </Col>
              </Row>
            }
            style={{ 
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px"
            }}
            bodyStyle={{
              padding: isTablet ? "12px" : "24px",
              overflow: "auto"
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <UserListTable />
            </div>
          </Card>
        </Col>
      </Row>
      
      <AddUserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AdminListUserPage;
