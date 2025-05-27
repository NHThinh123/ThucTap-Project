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

const ReviewsChart = ({ data, labels, period }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Đánh giá",
        data: data ? data.map((item) => item.reviews) : [],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.2)",
        fill: false,
        tension: 0.4,
        yAxisID: "y-reviews", // Gán trục y riêng cho Reviews
      },
      {
        label: "Đánh giá trung bình",
        data: data ? data.map((item) => item.average_rating) : [],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        fill: false,
        tension: 0.4,
        yAxisID: "y-rating", // Gán trục y riêng cho Average Rating
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Biểu đồ đánh giá & Trung bình đánh giá (${
          period.charAt(0).toUpperCase() + period.slice(1)
        })`,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text:
            period === "daily"
              ? "Ngày"
              : period === "weekly"
              ? "Tuần"
              : "Tháng",
        },
      },
      "y-reviews": {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Đánh giá" },
        beginAtZero: true,
      },
      "y-rating": {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Đánh giá trung bình" },
        beginAtZero: true,
        max: 5, // Giả sử rating tối đa là 5
        grid: {
          drawOnChartArea: false, // Không hiển thị lưới của trục này để tránh chồng lấn
        },
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

export default ReviewsChart;
