/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Col,
  Divider,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useContext, useState, useEffect } from "react";

import NewestVideoAnalysis from "../features/studio/components/templates/NewestVideoAnalysis";
import OverviewAnalysis from "../features/studio/components/templates/OverviewAnalysis";
import VideoPublish from "../features/studio/components/templates/VideoPublish";
import SubscriberList from "../features/studio/components/templates/SubscriberList";
import { AuthContext } from "../contexts/auth.context";

const StudioOverviewPage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const userId = auth.user?.id; // Thêm kiểm tra an toàn
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  // Xử lý resize để cập nhật trạng thái responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Typography.Title
        level={isMobile ? 4 : 3}
        style={{ marginBottom: isMobile ? 8 : 16 }}
      >
        Tổng quan của kênh
      </Typography.Title>
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <OverviewAnalysis userId={userId} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <NewestVideoAnalysis userId={userId} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <SubscriberList />
          <Divider style={{ margin: isMobile ? "8px 0" : "16px 0" }} />
          <VideoPublish userId={userId} />
        </Col>
      </Row>
    </>
  );
};

export default StudioOverviewPage;
