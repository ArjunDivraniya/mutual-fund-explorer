// src/app/layout.js
"use client";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AppBar position="sticky">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Mutual Fund Explorer
                </Typography>
                <Link href="/funds" passHref>
                  <Button color="inherit" sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    Funds
                  </Button>
                </Link>
              </Toolbar>
            </AppBar>
            <main className="p-6">
              {children}
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}