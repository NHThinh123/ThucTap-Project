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

const ViewsChart = ({ data, labels, period }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Lượt xem",
        data: data ? data.map((item) => item.views) : [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
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
        text: `Biểu đồ lượt xem (${
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
        title: { display: true, text: "Lượt xem" },
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

export default ViewsChart;
