import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SubscribersChart = ({ data, labels, period }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Người đăng ký",
        data: data ? data.map((item) => item.subscriptions) : [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Biểu đồ người đăng ký (${
          period === "daily" ? "Ngày" : period === "weekly" ? "Tuần" : "Tháng"
        })`,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text:
            period === "daily"
              ? "Date"
              : period === "weekly"
              ? "Week"
              : "Month",
        },
      },
      y: {
        title: { display: true, text: "Người đăng ký" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", minHeight: "500px" }}>
      <Line
        data={chartData}
        options={{ ...options, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default SubscribersChart;
