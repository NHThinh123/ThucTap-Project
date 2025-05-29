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
import React from "react";
import BoxCustom from "../components/atoms/BoxCustom";
import { ChartNoAxesColumn, ThumbsDown, ThumbsUp } from "lucide-react";

import NewestVideoAnalysis from "../features/studio/components/templates/NewestVideoAnalysis";
import OverviewAnalysis from "../features/studio/components/templates/OverviewAnalysis";
import VideoPublish from "../features/studio/components/templates/VideoPublish";
import SubcriberList from "../features/studio/components/templates/SubcriberList";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

const StudioOverviewPage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const userId = auth.user.id; // Thay thế bằng userId thực tế
  return (
    <>
      <Typography.Title level={3}>Tổng quan của kênh</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <OverviewAnalysis userId={userId} />
          <VideoPublish />
        </Col>
        <Col span={8}>
          <NewestVideoAnalysis userId={userId} />
        </Col>
        <Col span={8}>
          <SubcriberList />
        </Col>
      </Row>
    </>
  );
};

export default StudioOverviewPage;
