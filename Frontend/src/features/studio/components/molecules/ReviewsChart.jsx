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
        label: "Reviews",
        data: data ? data.map((item) => item.reviews) : [],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.2)",
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
        text: `Reviews Statistics (${
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
              ? "Date"
              : period === "weekly"
              ? "Week"
              : "Month",
        },
      },
      y: {
        title: { display: true, text: "Value" },
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

export default ReviewsChart;
