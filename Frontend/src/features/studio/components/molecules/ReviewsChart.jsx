import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReviewsChart = ({ data, labels, period }) => {
  const chartData = {
    labels,
    datasets: [
      {
        type: "bar", // Biểu đồ cột cho số lượng đánh giá
        label: "Số lượng đánh giá",
        data: data ? data.map((item) => item.reviews) : [],
        backgroundColor: "rgba(59, 130, 246, 0.5)", // Màu xanh dương nhạt
        borderColor: "#3b82f6",
        borderWidth: 1,
        yAxisID: "y-reviews",
        barThickness: 20, // Giảm độ rộng của cột (đơn vị: pixel)
      },
      {
        type: "line", // Biểu đồ đường cho đánh giá trung bình
        label: "Đánh giá trung bình",
        data: data ? data.map((item) => item.average_rating) : [],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        fill: false,
        tension: 0.4,
        yAxisID: "y-rating",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Biểu đồ số lượng đánh giá & Đánh giá trung bình (${
          period.charAt(0).toUpperCase() + period.slice(1)
        })`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
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
        title: { display: true, text: "Số lượng đánh giá" },
        beginAtZero: true,
      },
      "y-rating": {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Đánh giá trung bình" },
        beginAtZero: true,
        max: 5, // Rating tối đa là 5
        grid: {
          drawOnChartArea: false, // Không hiển thị lưới để tránh chồng lấn
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", minHeight: "500px" }}>
      <Chart
        type="bar"
        data={chartData}
        options={{ ...options, maintainAspectRatio: false }}
      />
    </div>
  );
};

export default ReviewsChart;
