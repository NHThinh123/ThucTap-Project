import {
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Typography,
  Spin,
  Alert,
} from "antd";
import {
  ChartNoAxesColumn,
  CircleArrowDown,
  CircleArrowUp,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { useNewestVideoAnalysis } from "../../hooks/useNewestVideoAnalysis";
import { formatViews } from "../../../../constants/formatViews";

const NewestVideoAnalysis = ({ userId }) => {
  const { data, isLoading, error } = useNewestVideoAnalysis({ userId });

  if (isLoading) return <Spin />;
  if (error) return <Alert message={error.message} type="error" />;
  if (!data?.data?.video)
    return (
      <BoxCustom>
        <Typography.Title level={5}>
          Hiệu suất video mới nhất của bạn
        </Typography.Title>
        <Divider style={{ marginTop: 5 }} />
        <Typography.Text type="secondary">
          Bạn chưa đăng tải video nào.
        </Typography.Text>
      </BoxCustom>
    );

  const { video, stats } = data.data;
  // Lấy trends từ tuần hiện tại (index cuối cùng)
  const latestTrends = stats?.length > 1 ? stats[stats.length - 1].trends : {};

  // Hàm hiển thị trend với icon
  const renderTrend = (value, isPositiveGood = true) => {
    if (!value) return <Typography.Text>0</Typography.Text>;
    const isPositive = value >= 0;
    const color = isPositive === isPositiveGood ? "#22bb33" : "#bb2124";
    const Icon = isPositive ? CircleArrowUp : CircleArrowDown;
    return (
      <Typography.Text>
        {Math.abs(value)}{" "}
        <Icon size={16} color={color} style={{ marginBottom: -2 }} />
      </Typography.Text>
    );
  };

  return (
    <BoxCustom>
      <Typography.Title level={5}>
        Hiệu suất video mới nhất của bạn
      </Typography.Title>
      <Divider style={{ marginTop: 5 }} />
      <img
        alt={video.title}
        src={video.thumbnail}
        style={{
          width: "100%",
          aspectRatio: "5/3",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
      <h4
        style={{
          marginTop: "8px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {video.title}
      </h4>
      <Row style={{ marginTop: 8 }} align={"middle"}>
        <Col span={6}>
          <Space>
            <ChartNoAxesColumn
              strokeWidth={1.5}
              size={20}
              style={{ marginTop: 2 }}
            />
            <p>{formatViews(video.totalViews)}</p>
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <ThumbsUp strokeWidth={1.5} size={20} style={{ marginTop: 2 }} />
            <p>{video.totalLikes}</p>
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <ThumbsDown strokeWidth={1.5} size={20} style={{ marginTop: 2 }} />
            <p>{video.totalDislikes}</p>
          </Space>
        </Col>
      </Row>
      <Divider style={{ marginTop: 5, marginBottom: 5 }} />
      <Typography.Text type="secondary">Trong tuần này</Typography.Text>
      <Col span={24} style={{ padding: "0px ", marginTop: 8 }}>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt xem:</Typography.Text>
          {renderTrend(latestTrends.views || 0)}
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt thích:</Typography.Text>
          {renderTrend(latestTrends.likes || 0)}
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt không thích:</Typography.Text>
          {renderTrend(latestTrends.dislikes || 0, false)}
        </Flex>
      </Col>
    </BoxCustom>
  );
};

export default NewestVideoAnalysis;
