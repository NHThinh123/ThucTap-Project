import {
  Button,
  Col,
  Divider,
  Flex,
  List,
  Row,
  Typography,
  Spin,
  Alert,
} from "antd";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { useChannelOverview } from "../../hooks/useChannelOverview";

const OverviewAnalysis = ({ userId }) => {
  const { data, isLoading, error } = useChannelOverview({ userId });

  if (isLoading) return <Spin />;
  if (error) return <Alert message={error.message} type="error" />;

  const { subscriberCount, stats, topVideos } = data || {};
  // Lấy trends từ tuần hiện tại (index cuối cùng)
  const latestTrends = stats?.length > 1 ? stats[stats.length - 1].trends : {};
  console.log("latestTrends", latestTrends);
  // Hàm định dạng số
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  // Hàm hiển thị trend với icon
  const renderTrend = (value, isPositiveGood = true) => {
    if (!value) return <Typography.Text>0</Typography.Text>;
    const isPositive = value >= 0;
    const color = isPositive === isPositiveGood ? "#22bb33" : "#bb2124";
    const Icon = isPositive ? CircleArrowUp : CircleArrowDown;
    return (
      <Typography.Text>
        <Icon size={16} color={color} style={{ marginBottom: -2 }} />{" "}
        {Math.abs(value)}
      </Typography.Text>
    );
  };

  return (
    <BoxCustom>
      <Typography.Title level={5}>Số liệu phân tích về kênh</Typography.Title>
      <Divider style={{ marginTop: 5 }} />
      <p>Số người đăng ký hiện tại</p>
      <Typography.Title level={2} style={{ marginBottom: 8 }}>
        {formatNumber(subscriberCount || 0)}
      </Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        <Typography.Text
          type="secondary"
          style={{
            color: latestTrends?.subscriptions >= 0 ? "#22bb33" : "#bb2124",
            fontSize: 14,
          }}
        >
          {latestTrends?.subscriptions >= 0 ? "Tăng" : "Giảm"}{" "}
          {Math.abs(latestTrends?.subscriptions || 0)}{" "}
        </Typography.Text>
        so với tuần trước
      </Typography.Text>
      <Divider style={{ marginTop: 5 }} />
      <Typography.Title level={5} style={{ margin: 0 }}>
        Tóm tắt
      </Typography.Title>
      <Typography.Text type="secondary">Trong tuần này</Typography.Text>
      <Col span={24} style={{ padding: "0px ", marginTop: 8 }}>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt xem:</Typography.Text>
          {renderTrend(latestTrends?.views || 0)}
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt thích:</Typography.Text>
          {renderTrend(latestTrends?.likes || 0)}
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt không thích:</Typography.Text>
          {renderTrend(latestTrends?.dislikes || 0, false)}
        </Flex>
      </Col>
      <Divider style={{ marginTop: 5 }} />
      <Typography.Title level={5}>Video hàng đầu của bạn</Typography.Title>
      <Typography.Text type="secondary">
        7 ngày qua • Số lượt xem
      </Typography.Text>
      <List
        style={{ marginTop: 8 }}
        split={false}
        dataSource={topVideos || []}
        grid={{
          gutter: 4,
          column: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ padding: 0 }}>
            <Row style={{ width: "100%" }}>
              <Col span={20}>
                <p
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                  }}
                >
                  {item.title}
                </p>
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Typography.Text type="secondary">
                  {formatNumber(item.views)}
                </Typography.Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </BoxCustom>
  );
};

export default OverviewAnalysis;
