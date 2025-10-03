// src/app/funds/page.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { FundCard } from "@/components/FundCard";
import { getSchemes } from "@/utils/api";
import { 
  Container, 
  Grid, 
  TextField, 
  InputAdornment, 
  Typography, 
  CircularProgress, 
  Alert, 
  Chip, 
  Stack, 
  Pagination, 
  Fade, 
  Divider, 
  Tooltip,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Badge
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CompareIcon from "@mui/icons-material/Compare";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function FundSearchPage() {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minReturns, setMinReturns] = useState([0, 30]);
  const pageSize = 12;

  const categories = ["All", "Equity", "Debt", "Hybrid", "Tax Saving", "ELSS"];
  const riskLevels = ["All", "Low", "Moderate", "High"];
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "returns", label: "Best Returns" },
    { value: "expense", label: "Lowest Expense" },
    { value: "popularity", label: "Most Popular" }
  ];

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await getSchemes();
        setSchemes(data);
        setFilteredSchemes(data);
      } catch (err) {
        setError("Failed to load funds. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  useEffect(() => {
    let results = schemes.filter((scheme) =>
      scheme.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (selectedHouse !== "All") {
      results = results.filter((s) => s.fundHouse === selectedHouse);
    }
    
    if (selectedCategory !== "All") {
      results = results.filter((s) => s.category === selectedCategory);
    }
    
    if (selectedRisk !== "All") {
      results = results.filter((s) => s.riskLevel === selectedRisk);
    }

    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.schemeName.localeCompare(b.schemeName);
        case "returns":
          return (b.returns || 0) - (a.returns || 0);
        case "expense":
          return (a.expenseRatio || 0) - (b.expenseRatio || 0);
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        default:
          return 0;
      }
    });

    setFilteredSchemes(results);
    setPage(1);
  }, [searchQuery, selectedHouse, selectedCategory, selectedRisk, sortBy, schemes]);

  const houses = Array.from(new Set(schemes.map((s) => s.fundHouse).filter(Boolean))).sort();
  const paged = filteredSchemes.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredSchemes.length / pageSize) || 1;

  const toggleCompare = (scheme) => {
    if (compareList.find(s => s.schemeCode === scheme.schemeCode)) {
      setCompareList(compareList.filter(s => s.schemeCode !== scheme.schemeCode));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, scheme]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedHouse("All");
    setSelectedCategory("All");
    setSelectedRisk("All");
    setSortBy("name");
    setMinReturns([0, 30]);
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Head>
        <title>Explore Funds - InvestSmart</title>
      </Head>

      {/* Header Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Explore Funds
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover and compare thousands of mutual funds to find the best investment opportunities
        </Typography>
      </MotionBox>

      {/* Search and Filters */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        sx={{ p: 3, mb: 4 }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search Mutual Funds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ flex: 1 }}
              >
                Filters
              </Button>
              {compareList.length > 0 && (
                <Button
                  variant="contained"
                  startIcon={<CompareIcon />}
                  component={Badge}
                  badgeContent={compareList.length}
                  color="secondary"
                >
                  Compare
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    label="Risk Level"
                  >
                    {riskLevels.map((risk) => (
                      <MenuItem key={risk} value={risk}>
                        {risk}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Fund House</InputLabel>
                  <Select
                    value={selectedHouse}
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    label="Fund House"
                  >
                    <MenuItem value="All">All</MenuItem>
                    {houses.slice(0, 10).map((house) => (
                      <MenuItem key={house} value={house}>
                        {house}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </MotionCard>

      {/* Quick Filter Chips */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Chip
            label="All"
            color={selectedHouse === "All" ? "primary" : "default"}
            onClick={() => setSelectedHouse("All")}
            variant={selectedHouse === "All" ? "filled" : "outlined"}
          />
          {houses.slice(0, 8).map((house) => (
            <Chip
              key={house}
              label={house}
              color={selectedHouse === house ? "primary" : "default"}
              onClick={() => setSelectedHouse(house)}
              variant={selectedHouse === house ? "filled" : "outlined"}
              sx={{ maxWidth: 200 }}
            />
          ))}
        </Stack>
      </MotionBox>

      {/* Results Count and Compare Bar */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        sx={{ mb: 3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Showing {paged.length} of {filteredSchemes.length} funds
          </Typography>
          {compareList.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {compareList.length} selected for comparison
              </Typography>
              <Button
                size="small"
                onClick={() => setCompareList([])}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Box>
          )}
        </Box>
      </MotionBox>

      {/* Fund Cards Grid */}
      <Grid container spacing={3}>
        {paged.map((scheme, index) => (
          <Grid item xs={12} sm={6} lg={4} key={scheme.schemeCode}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              sx={{ 
                height: '100%',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <FundCard 
                scheme={scheme} 
                onCompare={() => toggleCompare(scheme)}
                isSelected={compareList.find(s => s.schemeCode === scheme.schemeCode)}
                canCompare={compareList.length < 3}
              />
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      >
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, p) => setPage(p)} 
          color="primary"
          size="large"
        />
      </MotionBox>
    </Container>
  );
}