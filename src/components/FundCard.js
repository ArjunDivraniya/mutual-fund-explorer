// src/components/FundCard.js
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button, 
  IconButton, 
  Stack,
  LinearProgress,
  Tooltip,
  Avatar
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StarIcon from "@mui/icons-material/Star";
import CompareIcon from "@mui/icons-material/Compare";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const MotionCard = motion(Card);

export function FundCard({ scheme, onCompare, isSelected, canCompare }) {
  // Mock data for demonstration
  const mockData = {
    returns: {
      oneYear: 12.5,
      threeYear: 15.2,
      fiveYear: 18.7
    },
    expenseRatio: 1.2,
    aum: 2500, // in crores
    riskLevel: "Moderate",
    rating: 4.2,
    category: "Large Cap",
    nav: 45.67
  };

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
    <MotionCard
      whileHover={{ y: -4 }}
      sx={{ 
        height: "100%", 
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
        }
      }}
    >
      <Link href={`/funds/scheme/${scheme.schemeCode}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header with Fund House */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 32, height: 32 }}>
              <AccountBalanceIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                {scheme.fundHouse || "Mutual Fund"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
              <Typography variant="caption" color="text.secondary">
                {mockData.rating}
              </Typography>
            </Box>
          </Box>

          {/* Fund Name */}
          <Typography 
            variant="h6" 
            fontWeight={600} 
            gutterBottom
            sx={{ 
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {scheme.schemeName}
          </Typography>

          {/* Category and Risk */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              label={mockData.category} 
              size="small" 
              variant="outlined"
              color="primary"
            />
            <Chip 
              label={mockData.riskLevel} 
              size="small" 
              color={getRiskColor(mockData.riskLevel)}
            />
          </Stack>

          {/* Performance Metrics */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Returns (1Y / 3Y / 5Y)
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography 
                  variant="h6" 
                  color={getReturnsColor(mockData.returns.oneYear)}
                  fontWeight={600}
                >
                  {mockData.returns.oneYear > 0 ? "+" : ""}{mockData.returns.oneYear}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  1Y
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography 
                  variant="h6" 
                  color={getReturnsColor(mockData.returns.threeYear)}
                  fontWeight={600}
                >
                  {mockData.returns.threeYear > 0 ? "+" : ""}{mockData.returns.threeYear}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  3Y
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography 
                  variant="h6" 
                  color={getReturnsColor(mockData.returns.fiveYear)}
                  fontWeight={600}
                >
                  {mockData.returns.fiveYear > 0 ? "+" : ""}{mockData.returns.fiveYear}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5Y
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Fund Details */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Expense Ratio
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {mockData.expenseRatio}%
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                AUM
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ₹{mockData.aum} Cr
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                NAV
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ₹{mockData.nav}
              </Typography>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: "auto", pt: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                sx={{ flex: 1 }}
              >
                Invest
              </Button>
              <Tooltip title={isSelected ? "Remove from comparison" : "Add to comparison"}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCompare && onCompare();
                  }}
                  disabled={!canCompare && !isSelected}
                  color={isSelected ? "primary" : "default"}
                  sx={{
                    bgcolor: isSelected ? "primary.main" : "action.hover",
                    color: isSelected ? "white" : "text.secondary",
                    "&:hover": {
                      bgcolor: isSelected ? "primary.dark" : "action.selected",
                    }
                  }}
                >
                  {isSelected ? <CheckCircleIcon /> : <CompareIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* View Details Link */}
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Typography 
              variant="caption" 
              color="primary.main" 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: 0.5,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              View details <ArrowForwardIcon fontSize="inherit" />
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </MotionCard>
  );
}