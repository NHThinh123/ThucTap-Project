import { Col, Row, Tabs } from "antd";

import MainChannel from "../features/channel/components/templates/MainChannel";
import VideoChannel from "../features/channel/components/templates/VideoChannel";
import ChannelInformation from "../features/channel/components/templates/ChannelInformation";
import { useParams } from "react-router-dom";

const ChannelPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const tabs = [
    {
      key: "1",
      label: "Trang chủ",
      children: <MainChannel channelId={id} />,
    },
    {
      key: "2",
      label: "Video",
      children: <VideoChannel channelId={id} />, // Replace with actual content
    },
  ];
  return (
    <Row justify={"center"}>
      <Col sm={24} md={22} lg={20}>
        <ChannelInformation channelId={id} />

        <Row style={{ marginTop: "16px", width: "100%" }}>
          <Col span={24}>
            <Tabs defaultActiveKey="1" items={tabs} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ChannelPage;
