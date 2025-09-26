// src/components/SipCalculator.js
"use client";
import { useState } from "react";
import { calculateSipReturns } from "@/utils/api";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Button, Grid, MenuItem, Select, TextField, Typography, Card, CardContent, Stack, Tabs, Tab } from "@mui/material";
import { calculateLumpsumReturns } from "@/utils/api";

export function SipCalculator({ schemeCode }) {
  const [amount, setAmount] = useState(20000);
  const [frequency, setFrequency] = useState("monthly");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState("2025-12-31");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("sip"); // sip | lumpsum

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const amt = parseFloat(amount);
      let response;
      if (mode === "sip") {
        response = await calculateSipReturns(schemeCode, {
          amount: amt,
          frequency,
          from: fromDate,
          to: toDate,
        });
      } else {
        response = await calculateLumpsumReturns(schemeCode, {
          amount: String(amt),
          from: fromDate,
          to: toDate,
        });
      }

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

  const x = results ? results.investments.map((d) => new Date(d.date)) : [];
  const invested = results ? results.investments.map((d) => d.cumulativeInvested) : [];
  const value = results ? results.investments.map((d) => d.currentValue) : [];

  return (
    <Box>
      <Tabs value={mode} onChange={(_, v) => setMode(v)} sx={{ mb: 2 }}>
        <Tab value="sip" label="SIP" />
        <Tab value="lumpsum" label="Lumpsum" />
      </Tabs>
      <Box component="form" onSubmit={handleCalculate}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label={mode === "sip" ? "SIP Amount (₹)" : "Lumpsum Amount (₹)"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          {mode === "sip" && (
            <Grid item xs={12} sm={6}>
              <Select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                fullWidth
                displayEmpty
              >
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Start Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="End Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? "Calculating..." : "Calculate Returns"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Typography color="error" variant="body2" mt={2}>
          {error}
        </Typography>
      )}

      {results && (
        <Stack spacing={2} mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Invested
                  </Typography>
                  <Typography variant="h6">₹{results.totalInvested.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Value
                  </Typography>
                  <Typography variant="h6">₹{results.currentValue.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Absolute Return
                  </Typography>
                  <Typography variant="h6">{results.absoluteReturn.toFixed(2)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Annualized Return
                  </Typography>
                  <Typography variant="h6">{results.annualizedReturn.toFixed(2)}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box sx={{ height: 320 }}>
            {mode === "sip" ? (
              <LineChart
                xAxis={[{ data: x, scaleType: "time" }]}
                series={[
                  { data: value, label: "Investment Value", color: "#4bc0c0" },
                  { data: invested, label: "Total Invested", color: "#ff6384" },
                ]}
                height={320}
                margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
              />
            ) : (
              <LineChart
                xAxis={[{ data: (results.series ?? []).map((d) => new Date(d.date)), scaleType: "time" }]}
                series={[
                  { data: (results.series ?? []).map((d) => d.value), label: "Value", color: "#4bc0c0" },
                  { data: (results.series ?? []).map((d) => d.invested), label: "Invested", color: "#ff6384" },
                ]}
                height={320}
                margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
              />
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}