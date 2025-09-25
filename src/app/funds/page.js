// src/app/funds/page.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { FundCard } from "@/components/FundCard";
import { getSchemes } from "@/utils/api";
import { Container, Grid, TextField, InputAdornment, Typography, CircularProgress, Alert, Chip, Stack, Pagination, Fade, Divider, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function FundSearchPage() {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 30;

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
    setFilteredSchemes(results);
    setPage(1);
  }, [searchQuery, selectedHouse, schemes]);

  const houses = Array.from(new Set(schemes.map((s) => s.fundHouse).filter(Boolean))).sort();
  const paged = filteredSchemes.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredSchemes.length / pageSize) || 1;

  if (loading) {
    return (
      <Container sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <CircularProgress />
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
    <Container sx={{ py: 4 }}>
      <Head>
        <title>Mutual Fund Explorer</title>
      </Head>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Mutual Fund Explorer
      </Typography>

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
        sx={{ mb: 3 }}
      />

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
        <Tooltip title="Show all fund houses">
          <Chip
            label="All"
            color={selectedHouse === "All" ? "primary" : "default"}
            onClick={() => setSelectedHouse("All")}
          />
        </Tooltip>
        {houses.slice(0, 12).map((house) => (
          <Chip
            key={house}
            label={house}
            color={selectedHouse === house ? "primary" : "default"}
            onClick={() => setSelectedHouse(house)}
            sx={{ maxWidth: 220 }}
          />
        ))}
      </Stack>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {paged.map((scheme) => (
          <Fade in key={scheme.schemeCode}>
            <Grid item xs={12} sm={6} md={4}>
              <FundCard scheme={scheme} />
            </Grid>
          </Fade>
        ))}
      </Grid>

      <Stack alignItems="center" mt={3}>
        <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        <Typography variant="caption" color="text.secondary" mt={1}>
          Showing {paged.length} of {filteredSchemes.length} schemes
        </Typography>
      </Stack>
    </Container>
  );
}