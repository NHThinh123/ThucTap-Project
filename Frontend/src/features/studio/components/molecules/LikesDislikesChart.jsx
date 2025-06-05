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

const LikesDislikesChart = ({ data, labels, period }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Thích",
        data: data ? data.map((item) => item.likes) : [],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Không thích",
        data: data ? data.map((item) => item.dislikes) : [],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
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
        text: `Biểu đồ Thích & Không thích (${
          period === "daily" ? "Ngày" : period === "weekly" ? "Tuần" : "Tháng"
        })`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            period === "daily"
              ? "Date"
              : period === "weekly"
              ? "Week"
              : "Month",
        },
      },
      y: {
        title: { display: false, text: "Value" },
        beginAtZero: true, // Bắt đầu trục Y từ 0
        suggestedMin: 5, // Gợi ý giá trị tối thiểu là 5
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

export default LikesDislikesChart;
