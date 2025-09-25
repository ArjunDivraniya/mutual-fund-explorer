// src/app/funds/scheme/[code]/page.js
"use client";
import { useEffect, useState } from "react";
import { getSchemeData, getSchemeReturns } from "@/utils/api";
import { NavChart } from "@/components/NavChart";
import { SipCalculator } from "@/components/SipCalculator";
import Link from "next/link";
import { Container, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Stack, CircularProgress, Breadcrumbs, Tabs, Tab, ToggleButtonGroup, ToggleButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoIcon from "@mui/icons-material/Info";

export default function SchemeDetailPage({ params }) {
  const { code } = params;
  const [scheme, setScheme] = useState(null);
  const [returnsData, setReturnsData] = useState(null);
  const [loadingReturns, setLoadingReturns] = useState(false);
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState("1y");

  useEffect(() => {
    if (code) {
      const fetchScheme = async () => {
        const data = await getSchemeData(code);
        setScheme(data);
      };
      fetchScheme();
    }
  }, [code]);

  useEffect(() => {
    const fetchReturns = async () => {
      setLoadingReturns(true);
      try {
        const [r1m, r3m, r6m, r1y] = await Promise.all([
          getSchemeReturns(code, { period: "1m" }),
          getSchemeReturns(code, { period: "3m" }),
          getSchemeReturns(code, { period: "6m" }),
          getSchemeReturns(code, { period: "1y" }),
        ]);
        setReturnsData({ r1m, r3m, r6m, r1y });
      } finally {
        setLoadingReturns(false);
      }
    };
    if (code) fetchReturns();
  }, [code]);

  if (!scheme) {
    return (
      <Container sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Ensure scheme.data exists before trying to slice it
  const navData = scheme.data
    ? scheme.data
        .map((d) => ({
          date: new Date(d.date),
          nav: parseFloat(d.nav),
        }))
        .slice(0, period === "1m" ? 30 : period === "3m" ? 90 : period === "6m" ? 180 : 365)
    : [];

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
        <Button component={Link} href="/funds" variant="text">Funds</Button>
        <Typography color="text.primary">{scheme.meta.scheme_name}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        {scheme.meta.scheme_name}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" />
                <Tab icon={<TimelineIcon />} iconPosition="start" label="Performance" />
              </Tabs>
              {tab === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Fund House</Typography>
                    <Typography variant="body1">{scheme.meta.fund_house}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Scheme Type</Typography>
                    <Typography variant="body1">{scheme.meta.scheme_type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{scheme.meta.scheme_category}</Typography>
                  </Grid>
                </Grid>
              )}
              {tab === 1 && (
                <>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Period:</Typography>
                    <ToggleButtonGroup size="small" exclusive value={period} onChange={(_, v) => v && setPeriod(v)}>
                      <ToggleButton value="1m">1M</ToggleButton>
                      <ToggleButton value="3m">3M</ToggleButton>
                      <ToggleButton value="6m">6M</ToggleButton>
                      <ToggleButton value="1y">1Y</ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                  <div style={{ width: "100%", height: 320 }}>
                    <NavChart data={navData} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Returns
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell align="right">Simple Return %</TableCell>
                    <TableCell align="right">Annualized Return %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingReturns ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="body2" color="text.secondary">Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    [
                      { key: "r1m", label: "1 Month" },
                      { key: "r3m", label: "3 Months" },
                      { key: "r6m", label: "6 Months" },
                      { key: "r1y", label: "1 Year" },
                    ].map((row) => (
                      <TableRow key={row.key}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell align="right">
                          {returnsData?.[row.key]?.simpleReturn?.toFixed(2) ?? "-"}
                        </TableCell>
                        <TableCell align="right">
                          {returnsData?.[row.key]?.annualizedReturn?.toFixed(2) ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SipCalculator schemeCode={scheme.meta.scheme_code} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}