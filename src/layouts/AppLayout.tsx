import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardHeader
        menuOpen={mobileOpen}
        onToggleMenu={() => setMobileOpen((open) => !open)}
        showMenuButton={!isDesktop}
      />
      <DashboardSidebar
        open={isDesktop || mobileOpen}
        variant={isDesktop ? 'permanent' : 'temporary'}
        onClose={() => setMobileOpen(false)}
      />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
