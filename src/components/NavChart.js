// src/components/NavChart.js
"use client";
import { LineChart } from "@mui/x-charts/LineChart";

export function NavChart({ data }) {
  const x = data.map((d) => d.date).reverse();
  const y = data.map((d) => d.nav).reverse();

  return (
    <LineChart
      xAxis={[{ data: x, scaleType: "time" }]}
      series={[{ data: y, label: "NAV", color: "#3b82f6" }]}
      height={320}
      margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
    />
  );
}