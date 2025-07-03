import { Typography, Card, Row, Col, Space } from "antd";
import AllVideoList from "../features/admin/components/templates/AllVideoList";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/auth.context";

const { Title, Text } = Typography;

const AdminOverviewPage = () => {
  const { auth } = useContext(AuthContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 576;
  const isTablet = windowWidth < 768;
  
  if (!auth?.user) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
        <Col xs={22} sm={18} md={14} lg={12}>
          <Card 
            style={{ 
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px"
            }}
          >
            <Text style={{ fontSize: "16px", color: "#666" }}>
              Vui lòng đăng nhập để truy cập trang này.
            </Text>
          </Card>
        </Col>
      </Row>
    );
  }

  // Kiểm tra quyền admin
  if (auth.user.role !== "admin") {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "50vh" }}>
        <Col xs={22} sm={18} md={14} lg={12}>
          <Card 
            style={{ 
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px"
            }}
          >
            <Text style={{ fontSize: "16px", color: "#ff4d4f" }}>
              Bạn không có quyền truy cập trang này.
            </Text>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          {/* Header Section */}
          <Card
            style={{
              marginBottom: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #c90626 0%, #e74c3c 100%)"
            }}
            bodyStyle={{
              padding: isTablet ? "16px" : "24px"
            }}
          >
            <Row align="middle">
              <Col xs={24} sm={24} md={24} lg={24}>
                <Title 
                  level={isMobile ? 4 : 3} 
                  style={{ 
                    margin: 0, 
                    color: "#fff",
                    textAlign: isMobile ? "center" : "left"
                  }}
                >
                  Danh sách tất cả video
                </Title>
                <Text 
                  style={{ 
                    color: "rgba(255,255,255,0.9)",
                    fontSize: isMobile ? "14px" : "16px",
                    display: "block",
                    marginTop: "8px",
                    textAlign: isMobile ? "center" : "left"
                  }}
                >
                  Quản lý và theo dõi tất cả video trên hệ thống
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Video List Section */}
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px"
            }}
            bodyStyle={{
              padding: isTablet ? "12px" : "24px",
              overflow: "auto"
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <AllVideoList />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverviewPage;
