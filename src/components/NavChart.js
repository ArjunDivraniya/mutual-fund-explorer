// src/components/NavChart.js
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export function NavChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.date.toLocaleDateString("en-GB")).reverse(),
    datasets: [
      {
        label: "NAV",
        data: data.map((d) => d.nav).reverse(),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}