// src/app/page.js
"use client";
import Link from "next/link";
import { Container, Grid, Card, CardContent, Typography, Button, Stack, Box, Chip, Avatar, Divider } from "@mui/material";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SavingsIcon from "@mui/icons-material/Savings";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <MotionBox
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <MotionBox
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            textAlign="center"
            color="white"
          >
            <MotionTypography
              variant="h1"
              variants={itemVariants}
              sx={{
                background: "linear-gradient(45deg, #ffffff, #e0e7ff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              Invest Smart. Achieve Goals Faster.
            </MotionTypography>
            
            <MotionTypography
              variant="h5"
              variants={itemVariants}
              sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: "auto" }}
            >
              All-in-one app for SIPs, Mutual Funds & Tax Saving
            </MotionTypography>

            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  component={Link}
                  href="/funds"
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Start Investing
                </Button>
                <Button
                  component={Link}
                  href="/funds"
                  variant="outlined"
                  size="large"
                  startIcon={<ShowChartIcon />}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Explore Funds
                </Button>
              </Stack>
            </MotionBox>

            {/* Trust Signals */}
            <MotionBox variants={itemVariants}>
              <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
                <Chip
                  icon={<SecurityIcon />}
                  label="SEBI Registered"
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white", backdropFilter: "blur(10px)" }}
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  label="0% Commission on Direct Funds"
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white", backdropFilter: "blur(10px)" }}
                />
                <Chip
                  icon={<PeopleIcon />}
                  label="Trusted by 1,00,000+ users"
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "white", backdropFilter: "blur(10px)" }}
                />
              </Stack>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* How it Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <MotionBox
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          textAlign="center"
          sx={{ mb: 6 }}
        >
          <MotionTypography variant="h2" variants={itemVariants} gutterBottom>
            How it Works
          </MotionTypography>
          <MotionTypography variant="h6" color="text.secondary" variants={itemVariants} sx={{ maxWidth: 600, mx: "auto" }}>
            Get started with investing in just 3 simple steps
          </MotionTypography>
        </MotionBox>

        <Grid container spacing={4}>
          {[
            {
              step: "1",
              title: "Complete KYC",
              description: "Quick and secure KYC process to get you started in minutes",
              icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            },
            {
              step: "2", 
              title: "Start SIP",
              description: "Choose from thousands of funds and start your SIP journey",
              icon: <SavingsIcon sx={{ fontSize: 40 }} />,
            },
            {
              step: "3",
              title: "Track Growth",
              description: "Monitor your portfolio performance and achieve your goals",
              icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionCard
                variants={itemVariants}
                sx={{
                  p: 4,
                  textAlign: "center",
                  height: "100%",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.step}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">
                  {item.description}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            <MotionTypography variant="h2" variants={itemVariants} gutterBottom>
              Why Choose Us
            </MotionTypography>
            <MotionTypography variant="h6" color="text.secondary" variants={itemVariants} sx={{ maxWidth: 600, mx: "auto" }}>
              Everything you need to make informed investment decisions
            </MotionTypography>
          </MotionBox>

          <Grid container spacing={4}>
            {[
              {
                title: "Search & Filter",
                description: "Find schemes quickly with advanced search, sorting, and filters. Click a card to view full details.",
                icon: <SearchIcon sx={{ fontSize: 40 }} />,
                color: "primary.main",
              },
              {
                title: "NAV History",
                description: "Visualize the last year of NAV performance with interactive charts and quick period comparisons.",
                icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
                color: "secondary.main",
              },
              {
                title: "SIP Calculator",
                description: "Simulate monthly investments, track units accumulated, and compare invested vs value growth.",
                icon: <SavingsIcon sx={{ fontSize: 40 }} />,
                color: "warning.main",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  variants={itemVariants}
                  sx={{
                    p: 4,
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      bgcolor: `${feature.color}20`,
                      color: feature.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4} textAlign="center">
            {[
              { number: 100000, suffix: "+", label: "Active Users" },
              { number: 5000, suffix: "+", label: "Funds Available" },
              { number: 15, suffix: "+", label: "Years Experience" },
              { number: 99.9, suffix: "%", label: "Uptime" },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionBox variants={itemVariants}>
                  <Typography variant="h2" color="primary.main" fontWeight="bold">
                    <CountUp
                      end={stat.number}
                      duration={2}
                      decimals={stat.number < 10 ? 1 : 0}
                      suffix={stat.suffix}
                    />
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
}