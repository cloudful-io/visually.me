"use client";

import { useMediaQuery, Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from '@/app/components/Profile';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ThemeModeToggle from '@/app/components/ThemeModeToggle';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import Logo from './Logo';

const Header = ({ onToggleSidebar, sidebarCollapsed }: { onToggleSidebar: () => void, sidebarCollapsed: boolean }) => {
  const { user, loading } = useSupabaseAuth();
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up("md"));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onToggleSidebar}
          sx={{ 
            mr: 2,
            display: {
              xs: "none",   // hide on mobile
              md: "flex",   // show on desktop
            },
          }}
        > 
          {sidebarCollapsed ? (
            <MenuIcon/>
          ) : (
            <MenuOpenIcon/>
          )}
        </IconButton>

        {(!mdUp && <Logo showTitle homeUrl="/dashboard" />)}
        <Box flexGrow={1} />
        {/* Profile / Login / Theme Toggle */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 8 }}>
          {!user && !loading && (
            <Button
              variant="contained"
              component={Link}
              href="/authentication/login"
              disableElevation
              color="primary"
            >
              Login
            </Button>
          )}
          {user && <Profile user={user} showDashboardLink={false}/>}
          <ThemeModeToggle />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
