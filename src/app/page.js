// src/app/page.js
"use client";
import Link from "next/link";
import { Container, Grid, Card, CardContent, Typography, Button, Stack, Fade } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SavingsIcon from "@mui/icons-material/Savings";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  return (
    <Container sx={{ py: 6 }}>
      <Fade in timeout={500}>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={800}>
            Mutual Fund Explorer
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth={720}>
            Discover, analyze, and simulate investments across mutual funds. Search funds, view NAV trends, and calculate SIP returns.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
            <Button component={Link} href="/funds" variant="contained" size="large" startIcon={<SearchIcon />}>
              Browse Funds
            </Button>
            <Button component={Link} href="/funds" variant="outlined" size="large" startIcon={<ShowChartIcon />}>
              Explore NAV & Returns
            </Button>
          </Stack>
        </Stack>
      </Fade>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Fade in timeout={700}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <SearchIcon color="primary" />
                  <Typography variant="h6">Search & Filter</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Find schemes quickly with search, sorting, and filters. Click a card to view full details.
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in timeout={900}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <ShowChartIcon color="primary" />
                  <Typography variant="h6">NAV History</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Visualize the last year of NAV performance with an interactive chart and quick periods.
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in timeout={1100}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <SavingsIcon color="primary" />
                  <Typography variant="h6">SIP Calculator</Typography>
                </Stack>
                <Typography color="text.secondary">
                  Simulate monthly investments, track units accumulated, and compare invested vs value growth.
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      <Stack spacing={1} sx={{ mt: 5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Routes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          - Funds listing: /funds
        </Typography>
        <Typography variant="body2" color="text.secondary">
          - Scheme details: /funds/scheme/[code]
        </Typography>
        <Typography variant="body2" color="text.secondary">
          - APIs: /api/mf, /api/scheme/[code], /api/scheme/[code]/returns, /api/scheme/[code]/sip
        </Typography>
      </Stack>
    </Container>
  );
}