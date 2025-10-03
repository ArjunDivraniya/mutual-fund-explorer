// src/app/goals/page.js
"use client";
import { useState } from "react";
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Stack,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from "@mui/material";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import FlightIcon from "@mui/icons-material/Flight";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CelebrationIcon from "@mui/icons-material/Celebration";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function GoalsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    category: "",
    priority: "Medium"
  });

  // Mock data for goals
  const goals = [
    {
      id: 1,
      name: "Buy a Car",
      targetAmount: 500000,
      currentAmount: 320000,
      targetDate: "2025-12-31",
      category: "Transportation",
      priority: "High",
      icon: <DirectionsCarIcon />,
      color: "#2563eb",
      progress: 64,
      monthlyContribution: 15000,
      projectedCompletion: "2025-10-15"
    },
    {
      id: 2,
      name: "House Down Payment",
      targetAmount: 2000000,
      currentAmount: 850000,
      targetDate: "2026-06-30",
      category: "Housing",
      priority: "High",
      icon: <HomeIcon />,
      color: "#10b981",
      progress: 42.5,
      monthlyContribution: 25000,
      projectedCompletion: "2026-08-20"
    },
    {
      id: 3,
      name: "Child's Education",
      targetAmount: 1000000,
      currentAmount: 180000,
      targetDate: "2030-05-31",
      category: "Education",
      priority: "Medium",
      icon: <SchoolIcon />,
      color: "#f59e0b",
      progress: 18,
      monthlyContribution: 8000,
      projectedCompletion: "2030-03-15"
    },
    {
      id: 4,
      name: "Europe Trip",
      targetAmount: 300000,
      currentAmount: 95000,
      targetDate: "2024-08-15",
      category: "Travel",
      priority: "Low",
      icon: <FlightIcon />,
      color: "#8b5cf6",
      progress: 31.7,
      monthlyContribution: 12000,
      projectedCompletion: "2024-10-20"
    },
    {
      id: 5,
      name: "Retirement Fund",
      targetAmount: 10000000,
      currentAmount: 2500000,
      targetDate: "2040-12-31",
      category: "Retirement",
      priority: "High",
      icon: <AccountBalanceIcon />,
      color: "#ef4444",
      progress: 25,
      monthlyContribution: 35000,
      projectedCompletion: "2038-06-15"
    }
  ];

  const categories = [
    { value: "Transportation", label: "Transportation", icon: <DirectionsCarIcon /> },
    { value: "Housing", label: "Housing", icon: <HomeIcon /> },
    { value: "Education", label: "Education", icon: <SchoolIcon /> },
    { value: "Travel", label: "Travel", icon: <FlightIcon /> },
    { value: "Retirement", label: "Retirement", icon: <AccountBalanceIcon /> },
    { value: "Emergency", label: "Emergency Fund", icon: <AccountBalanceIcon /> },
    { value: "Other", label: "Other", icon: <StarIcon /> }
  ];

  const priorityColors = {
    High: "error",
    Medium: "warning", 
    Low: "success"
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "success";
    if (progress >= 75) return "primary";
    if (progress >= 50) return "warning";
    return "error";
  };

  const handleAddGoal = () => {
    setOpenDialog(true);
    setActiveStep(0);
    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
      category: "",
      priority: "Medium"
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSave = () => {
    // Here you would save the goal to your backend
    console.log("Saving goal:", newGoal);
    setOpenDialog(false);
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100;

  const chartData = goals.map(goal => ({
    name: goal.name,
    value: goal.currentAmount,
    target: goal.targetAmount,
    color: goal.color
  }));

  const steps = [
    "Goal Details",
    "Target Amount",
    "Timeline",
    "Review"
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Financial Goals
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track your progress towards achieving your financial dreams
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddGoal}
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Add New Goal
          </Button>
        </Box>

        {/* Overall Progress */}
        <Card sx={{ p: 3, mb: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Overall Progress
              </Typography>
              <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
                <CountUp
                  end={overallProgress}
                  duration={2}
                  decimals={1}
                  suffix="%"
                />
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ₹<CountUp
                  end={totalCurrentAmount}
                  duration={2}
                  separator=","
                /> of ₹<CountUp
                  end={totalTargetAmount}
                  duration={2}
                  separator=","
                />
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={overallProgress}
                  size={120}
                  thickness={4}
                  sx={{ color: "white" }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight={700}>
                    {overallProgress.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </MotionBox>

      {/* Goals Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {goals.map((goal, index) => (
          <Grid item xs={12} sm={6} lg={4} key={goal.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              sx={{ 
                height: "100%",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Goal Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: goal.color, mr: 2, width: 48, height: 48 }}>
                    {goal.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {goal.name}
                    </Typography>
                    <Chip 
                      label={goal.priority} 
                      color={priorityColors[goal.priority]}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Progress */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {goal.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={goal.progress} 
                    color={getProgressColor(goal.progress)}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: `${goal.color}20`,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: goal.color,
                      }
                    }}
                  />
                </Box>

                {/* Amounts */}
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Amount
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{goal.currentAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Target Amount
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{goal.targetAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

                {/* Timeline */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Contribution: ₹{goal.monthlyContribution.toLocaleString()}
                  </Typography>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small" fullWidth>
                    Adjust Goal
                  </Button>
                  <Button variant="contained" size="small" fullWidth>
                    Add Money
                  </Button>
                </Stack>

                {/* Completion Celebration */}
                {goal.progress >= 100 && (
                  <Box sx={{ 
                    position: "absolute", 
                    top: 0, 
                    right: 0, 
                    bgcolor: "success.main", 
                    color: "white", 
                    p: 1, 
                    borderRadius: "0 16px 0 16px"
                  }}>
                    <CelebrationIcon />
                  </Box>
                )}
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Section */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        sx={{ mb: 4 }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Goals Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Goals Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Monthly Contributions
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={goals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Monthly Contribution']} />
                    <Bar dataKey="monthlyContribution" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Add Goal Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Add New Financial Goal
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goal Name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Buy a House, Car, Vacation"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {category.icon}
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Amount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="1000000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Amount"
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  placeholder="50000"
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Your Goal
              </Typography>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography><strong>Goal:</strong> {newGoal.name}</Typography>
                  <Typography><strong>Category:</strong> {newGoal.category}</Typography>
                  <Typography><strong>Priority:</strong> {newGoal.priority}</Typography>
                  <Typography><strong>Target Amount:</strong> ₹{newGoal.targetAmount?.toLocaleString()}</Typography>
                  <Typography><strong>Current Amount:</strong> ₹{newGoal.currentAmount?.toLocaleString()}</Typography>
                  <Typography><strong>Target Date:</strong> {newGoal.targetDate}</Typography>
                </Stack>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          ) : (
            <Button variant="contained" onClick={handleSave}>Create Goal</Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
