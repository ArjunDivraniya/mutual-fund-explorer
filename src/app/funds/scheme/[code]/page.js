// src/app/funds/scheme/[code]/page.js
"use client";
import { useEffect, useState } from "react";
import { getSchemeData, getSchemeReturns } from "@/utils/api";
import { NavChart } from "@/components/NavChart";
import { SipCalculator } from "@/components/SipCalculator";
import Link from "next/link";
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Stack, 
  CircularProgress, 
  Breadcrumbs, 
  Tabs, 
  Tab, 
  ToggleButtonGroup, 
  ToggleButton,
  Box,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Rating,
  Alert,
  IconButton,
  Tooltip,
  Badge
} from "@mui/material";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StarIcon from "@mui/icons-material/Star";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CompareIcon from "@mui/icons-material/Compare";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function SchemeDetailPage({ params }) {
  const { code } = params;
  const [scheme, setScheme] = useState(null);
  const [returnsData, setReturnsData] = useState(null);
  const [loadingReturns, setLoadingReturns] = useState(false);
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState("1y");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock data for enhanced UI
  const mockFundData = {
    rating: 4.2,
    riskLevel: "Moderate",
    category: "Large Cap",
    expenseRatio: 1.2,
    aum: 2500, // in crores
    nav: 45.67,
    fundManager: "John Doe",
    experience: "8 years",
    benchmark: "Nifty 100",
    minInvestment: 500,
    exitLoad: "1% for redemption within 1 year",
    consistencyScore: 85,
    volatility: 12.5,
    sharpeRatio: 1.8,
    alpha: 2.3,
    beta: 0.95,
    returns: {
      oneYear: 12.5,
      threeYear: 15.2,
      fiveYear: 18.7,
      sinceInception: 16.8
    }
  };

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
        <CircularProgress size={60} />
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low": return "success";
      case "Moderate": return "warning";
      case "High": return "error";
      default: return "default";
    }
  };

  const getReturnsColor = (returns) => {
    return returns > 0 ? "success.main" : "error.main";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Button component={Link} href="/funds" variant="text" color="primary">
            Explore Funds
          </Button>
          <Typography color="text.primary">{scheme.meta.scheme_name}</Typography>
        </Breadcrumbs>
      </MotionBox>

      {/* Fund Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", mr: 2, width: 48, height: 48 }}>
                <AccountBalanceIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {scheme.meta.scheme_name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {scheme.meta.fund_house} • {mockFundData.category}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip 
                label={mockFundData.riskLevel} 
                color={getRiskColor(mockFundData.riskLevel)}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
              />
              <Chip 
                label={`${mockFundData.rating} ⭐`}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
              />
              <Chip 
                label={`${mockFundData.consistencyScore}% Consistent`}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white" }}
              />
            </Stack>

            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
              A well-diversified large-cap equity fund that invests in companies with strong fundamentals and growth potential.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <IconButton 
                onClick={() => setIsBookmarked(!isBookmarked)}
                sx={{ color: "white", bgcolor: "rgba(255, 255, 255, 0.2)" }}
              >
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              <IconButton sx={{ color: "white", bgcolor: "rgba(255, 255, 255, 0.2)" }}>
                <ShareIcon />
              </IconButton>
              <IconButton sx={{ color: "white", bgcolor: "rgba(255, 255, 255, 0.2)" }}>
                <CompareIcon />
              </IconButton>
            </Stack>
            
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h2" fontWeight={700} sx={{ mb: 1 }}>
                <CountUp
                  end={mockFundData.returns.oneYear}
                  duration={2}
                  suffix="%"
                />
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                1 Year Returns
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </MotionCard>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Performance Chart */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ mb: 4 }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight={600}>
                  Performance Chart
                </Typography>
                <ToggleButtonGroup 
                  size="small" 
                  exclusive 
                  value={period} 
                  onChange={(_, v) => v && setPeriod(v)}
                  sx={{ bgcolor: "action.hover" }}
                >
                  <ToggleButton value="1m">1M</ToggleButton>
                  <ToggleButton value="3m">3M</ToggleButton>
                  <ToggleButton value="6m">6M</ToggleButton>
                  <ToggleButton value="1y">1Y</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={navData}>
                    <defs>
                      <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis stroke="#666" />
                    <RechartsTooltip 
                      formatter={(value) => [`₹${value.toFixed(2)}`, 'NAV']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="nav" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorNav)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Fund Details Tabs */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{ mb: 4 }}
          >
            <CardContent>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" />
                <Tab icon={<TimelineIcon />} iconPosition="start" label="Performance" />
                <Tab icon={<StarIcon />} iconPosition="start" label="Analysis" />
              </Tabs>
              
              {tab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Fund House</Typography>
                    <Typography variant="h6">{scheme.meta.fund_house}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Category</Typography>
                    <Typography variant="h6">{scheme.meta.scheme_category}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Fund Manager</Typography>
                    <Typography variant="h6">{mockFundData.fundManager}</Typography>
                    <Typography variant="body2" color="text.secondary">{mockFundData.experience} experience</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Benchmark</Typography>
                    <Typography variant="h6">{mockFundData.benchmark}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Minimum Investment</Typography>
                    <Typography variant="h6">₹{mockFundData.minInvestment}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Exit Load</Typography>
                    <Typography variant="h6">{mockFundData.exitLoad}</Typography>
                  </Grid>
                </Grid>
              )}
              
              {tab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Returns Comparison
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell align="right">Fund Returns</TableCell>
                        <TableCell align="right">Benchmark</TableCell>
                        <TableCell align="right">Excess Returns</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { period: "1 Year", fund: mockFundData.returns.oneYear, benchmark: 10.5, excess: mockFundData.returns.oneYear - 10.5 },
                        { period: "3 Years", fund: mockFundData.returns.threeYear, benchmark: 12.8, excess: mockFundData.returns.threeYear - 12.8 },
                        { period: "5 Years", fund: mockFundData.returns.fiveYear, benchmark: 14.2, excess: mockFundData.returns.fiveYear - 14.2 },
                        { period: "Since Inception", fund: mockFundData.returns.sinceInception, benchmark: 15.1, excess: mockFundData.returns.sinceInception - 15.1 },
                      ].map((row) => (
                        <TableRow key={row.period}>
                          <TableCell>{row.period}</TableCell>
                          <TableCell align="right">
                            <Typography color={getReturnsColor(row.fund)} fontWeight={600}>
                              {row.fund > 0 ? "+" : ""}{row.fund}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{row.benchmark}%</TableCell>
                          <TableCell align="right">
                            <Typography color={getReturnsColor(row.excess)} fontWeight={600}>
                              {row.excess > 0 ? "+" : ""}{row.excess}%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
              
              {tab === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                      <Typography variant="h4" color="primary.main" fontWeight={700}>
                        {mockFundData.sharpeRatio}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sharpe Ratio
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                      <Typography variant="h4" color="success.main" fontWeight={700}>
                        {mockFundData.alpha}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Alpha
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                      <Typography variant="h4" color="warning.main" fontWeight={700}>
                        {mockFundData.beta}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Beta
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                      <Typography variant="h4" color="error.main" fontWeight={700}>
                        {mockFundData.volatility}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Volatility
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Investment CTA */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{ mb: 4 }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Start Investing
              </Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" size="large" fullWidth sx={{ py: 1.5 }}>
                  Start SIP
                </Button>
                <Button variant="outlined" size="large" fullWidth sx={{ py: 1.5 }}>
                  Lumpsum Investment
                </Button>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Fund Details
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">NAV</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{mockFundData.nav}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Expense Ratio</Typography>
                  <Typography variant="body2" fontWeight={600}>{mockFundData.expenseRatio}%</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">AUM</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{mockFundData.aum} Cr</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Risk Level</Typography>
                  <Chip label={mockFundData.riskLevel} color={getRiskColor(mockFundData.riskLevel)} size="small" />
                </Box>
              </Stack>
            </CardContent>
          </MotionCard>

          {/* SIP Calculator */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{ mb: 4 }}
          >
            <CardContent>
              <SipCalculator schemeCode={scheme.meta.scheme_code} />
            </CardContent>
          </MotionCard>

          {/* Risk Warning */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CardContent>
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="body2">
                  Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing.
                </Typography>
              </Alert>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
}