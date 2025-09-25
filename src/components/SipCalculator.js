// src/components/SipCalculator.js
"use client";
import { useState } from "react";
import { calculateSipReturns } from "@/utils/api";
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

export function SipCalculator({ schemeCode }) {
  const [amount, setAmount] = useState(5000);
  const [frequency, setFrequency] = useState("monthly");
  const [fromDate, setFromDate] = useState("2020-01-01");
  const [toDate, setToDate] = useState("2023-12-31");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await calculateSipReturns(schemeCode, {
        amount: parseFloat(amount),
        frequency,
        from: fromDate,
        to: toDate,
      });

      if (response.status === "needs_review") {
        setError(response.message);
        setResults(null);
      } else {
        setResults(response);
      }
    } catch (err) {
      setError("An error occurred. Please check your dates and try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = results
    ? {
        labels: results.investments.map((d) => d.date),
        datasets: [
          {
            label: "Investment Value",
            data: results.investments.map((d) => d.currentValue),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            tension: 0.1,
            fill: true,
          },
          {
            label: "Total Invested",
            data: results.investments.map((d) => d.cumulativeInvested),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            tension: 0.1,
          },
        ],
      }
    : {
        labels: [],
        datasets: [],
      };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">SIP Calculator</h2>
      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            SIP Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium">
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="from"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              id="to"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
        >
          {loading ? "Calculating..." : "Calculate Returns"}
        </button>
      </form>

      {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Results</h3>
            <div className="space-y-1">
              <p>
                Total Invested:{" "}
                <span className="font-bold">₹{results.totalInvested.toFixed(2)}</span>
              </p>
              <p>
                Current Value:{" "}
                <span className="font-bold">₹{results.currentValue.toFixed(2)}</span>
              </p>
              <p>
                Absolute Return:{" "}
                <span className="font-bold">
                  {results.absoluteReturn.toFixed(2)}%
                </span>
              </p>
              <p>
                Annualized Return:{" "}
                <span className="font-bold">
                  {results.annualizedReturn.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
          <div className="w-full h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}