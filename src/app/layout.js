// src/app/layout.js
"use client";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import DashboardIcon from '@mui/icons-material/Dashboard';

const MotionAppBar = motion(AppBar);

export default function RootLayout({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Explore Funds', href: '/funds', icon: <TrendingUpIcon /> },
    { label: 'My SIPs', href: '/sips', icon: <SavingsIcon /> },
  ];

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <MotionAppBar 
              position="sticky"
              sx={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              }}
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <TrendingUpIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        InvestSmart
                      </Typography>
                    </Box>
                  </Link>
                </Box>

                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      component={Link}
                      href={item.href}
                      startIcon={item.icon}
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'rgba(37, 99, 235, 0.1)',
                          color: 'primary.main',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>

                {/* User Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ 
                      bgcolor: 'rgba(37, 99, 235, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.2)',
                      },
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My Account</MenuItem>
                    <MenuItem onClick={handleClose}>Settings</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </Menu>

                  {/* Mobile Menu */}
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls="mobile-menu"
                    aria-haspopup="true"
                    onClick={handleMobileMenu}
                    color="inherit"
                    sx={{ display: { xs: 'block', md: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="mobile-menu"
                    anchorEl={mobileMenuAnchor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(mobileMenuAnchor)}
                    onClose={handleMobileMenuClose}
                  >
                    {navItems.map((item) => (
                      <MenuItem 
                        key={item.label}
                        component={Link}
                        href={item.href}
                        onClick={handleMobileMenuClose}
                      >
                        {item.icon}
                        <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Toolbar>
            </MotionAppBar>
            <main>
              {children}
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}