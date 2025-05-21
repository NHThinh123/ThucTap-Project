import React, { useState } from "react";
import { format, parse, subDays } from "date-fns";
import { useUserStats } from "../../hooks/useUserStats";
import { Select, Space, Typography, Spin, Tabs } from "antd";
import SubscribersChart from "../molecules/SubscribersChart";
import ViewsChart from "../molecules/ViewsChart";
import LikesDislikesChart from "../molecules/LikesDislikesChart";
import ReviewsChart from "../molecules/ReviewsChart";

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const StatsChart = ({ userId }) => {
  const [period, setPeriod] = useState("weekly");
  const [timeRange, setTimeRange] = useState("7days");

  // Tính startDate và endDate dựa trên timeRange
  const getDateRange = () => {
    const today = new Date("2025-05-20"); // Ngày hiện tại
    if (timeRange === "7days") {
      return {
        startDate: format(subDays(today, 7), "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      };
    } else if (timeRange === "28days") {
      return {
        startDate: format(subDays(today, 28), "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      };
    } else {
      return {
        startDate: format(subDays(today, 365), "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      }; // 365 ngày qua
    }
  };

  const { startDate, endDate } = getDateRange();

  // Sử dụng custom hook
  const { data, isLoading, error } = useUserStats({
    userId,
    period,
    startDate,
    endDate,
  });

  if (isLoading)
    return <Spin style={{ display: "block", margin: "20px auto" }} />;
  if (error)
    return (
      <Text style={{ color: "red", display: "block", textAlign: "center" }}>
        Error: {error.message}
      </Text>
    );

  // Chuẩn bị labels cho biểu đồ
  const labels = data
    ? data.map((item) => {
        if (period === "daily") {
          return format(new Date(item._id), "yyyy-MM-dd");
        } else if (period === "weekly") {
          return item._id; // YYYY-WW
        } else {
          return format(parse(item._id, "yyyy-MM", new Date()), "yyyy-MM");
        }
      })
    : [];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "24px",

        margin: "0 auto",
      }}
    >
      <Title level={3} style={{ marginBottom: "24px" }}>
        Số liệu phân tích về kênh
      </Title>
      <Space direction="horizontal" style={{ marginBottom: "24px" }}>
        <Text strong>Period:</Text>
        <Select
          value={period}
          onChange={(value) => setPeriod(value)}
          style={{ width: 120 }}
          options={[
            { value: "daily", label: "Theo ngày" },
            { value: "weekly", label: "Theo tuần" },
            { value: "monthly", label: "Theo tháng" },
          ]}
        />
        <Text strong>Time Range:</Text>
        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value)}
          style={{ width: 150 }}
          options={[
            { value: "7days", label: "7 ngày qua" },
            { value: "28days", label: "28 ngày qua" },
            { value: "all", label: "365 ngày qua" },
          ]}
        />
      </Space>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Subscribers" key="1">
          <SubscribersChart data={data} labels={labels} period={period} />
        </TabPane>
        <TabPane tab="Views" key="2">
          <ViewsChart data={data} labels={labels} period={period} />
        </TabPane>
        <TabPane tab="Likes & Dislikes" key="3">
          <LikesDislikesChart data={data} labels={labels} period={period} />
        </TabPane>
        <TabPane tab="Reviews" key="4">
          <ReviewsChart data={data} labels={labels} period={period} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatsChart;
