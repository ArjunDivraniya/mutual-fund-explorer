// src/app/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Avatar,
  LinearProgress,
  IconButton,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  CircularProgress
} from "@mui/material";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import WithdrawIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const portfolioData = {
    totalValue: 1250000,
    monthlyGrowth: 8.2,
    totalGrowth: 15.6,
    activeSIPs: 3,
    nextDueDate: "2024-01-15",
    goalsProgress: 65,
  };

  const chartData = [
    { month: 'Jan', value: 1000000 },
    { month: 'Feb', value: 1050000 },
    { month: 'Mar', value: 1100000 },
    { month: 'Apr', value: 1080000 },
    { month: 'May', value: 1150000 },
    { month: 'Jun', value: 1200000 },
    { month: 'Jul', value: 1180000 },
    { month: 'Aug', value: 1220000 },
    { month: 'Sep', value: 1250000 },
  ];

  const activeSIPs = [
    {
      id: 1,
      fundName: "HDFC Top 100 Fund",
      amount: 5000,
      nextDate: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      fundName: "SBI Bluechip Fund",
      amount: 3000,
      nextDate: "2024-01-20",
      status: "active"
    },
    {
      id: 3,
      fundName: "ICICI Prudential Value Fund",
      amount: 2000,
      nextDate: "2024-01-25",
      status: "active"
    }
  ];

  const recommendations = [
    {
      name: "Axis Bluechip Fund",
      category: "Large Cap",
      risk: "Moderate",
      returns: "12.5%",
      rating: 4.5
    },
    {
      name: "Mirae Asset Large Cap Fund",
      category: "Large Cap", 
      risk: "Moderate",
      returns: "11.8%",
      rating: 4.3
    },
    {
      name: "Parag Parikh Flexi Cap Fund",
      category: "Flexi Cap",
      risk: "Moderate",
      returns: "13.2%",
      rating: 4.7
    }
  ];

  const notifications = [
    {
      id: 1,
      message: "Your SIP of ₹5,000 will auto-debit tomorrow",
      type: "info",
      time: "2 hours ago"
    },
    {
      id: 2,
      message: "Portfolio value increased by ₹15,000 this month",
      type: "success",
      time: "1 day ago"
    },
    {
      id: 3,
      message: "New tax-saving funds available for ELSS",
      type: "info",
      time: "3 days ago"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Hi Arjun 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Your portfolio is up <Chip 
            label={`${portfolioData.monthlyGrowth}%`} 
            color="success" 
            size="small" 
            sx={{ ml: 1 }}
          /> this month!
        </Typography>
      </MotionBox>

      {/* Portfolio Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            sx={{ height: 400, p: 3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Portfolio Growth
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="1M" size="small" color="primary" />
                <Chip label="1Y" size="small" variant="outlined" />
                <Chip label="5Y" size="small" variant="outlined" />
              </Box>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
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
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </MotionCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ height: 400, p: 3 }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Total Portfolio Value
            </Typography>
            <Typography variant="h2" color="primary.main" fontWeight={700} sx={{ mb: 2 }}>
              <CountUp
                end={portfolioData.totalValue}
                duration={2}
                separator=","
                prefix="₹"
              />
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography color="success.main" fontWeight={600}>
                +{portfolioData.totalGrowth}% overall
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Start New SIP
              </Button>
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Pause SIP
              </Button>
              <Button
                variant="outlined"
                startIcon={<WithdrawIcon />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Withdraw
              </Button>
            </Stack>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Active SIPs and Goals */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{ p: 3 }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Active SIPs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Next due date: {portfolioData.nextDueDate}
            </Typography>
            <List>
              {activeSIPs.map((sip, index) => (
                <ListItem key={sip.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SavingsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={sip.fundName}
                    secondary={`₹${sip.amount.toLocaleString()} • Due ${sip.nextDate}`}
                  />
                  <Chip 
                    label="Active" 
                    color="success" 
                    size="small"
                    icon={<CheckCircleIcon />}
                  />
                </ListItem>
              ))}
            </List>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{ p: 3 }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Goals Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {portfolioData.goalsProgress}% achieved
            </Typography>
            <Box sx={{ mb: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={portfolioData.goalsProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(37, 99, 235, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              On track to achieve in 3 years
            </Typography>
            <Button variant="outlined" size="small" startIcon={<AddIcon />}>
              Add New Goal
            </Button>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Recommendations and Notifications */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{ p: 3 }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Smart Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Top 3 Tax Saving Funds for you
            </Typography>
            <Grid container spacing={2}>
              {recommendations.map((fund, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon color="warning" sx={{ fontSize: 20, mr: 1 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {fund.rating}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      {fund.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {fund.category}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      {fund.returns} returns
                    </Typography>
                    <Chip 
                      label={fund.risk} 
                      size="small" 
                      color={fund.risk === 'High' ? 'error' : 'success'}
                      sx={{ mt: 1 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            sx={{ p: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                Notifications
              </Typography>
            </Box>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    {notification.type === 'success' ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <WarningIcon color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
}
