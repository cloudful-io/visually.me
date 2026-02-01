"use client";
import React, {useEffect} from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { usePathname } from "next/navigation";
import { Box, AppBar, Toolbar, Stack, IconButton, Button, Drawer } from '@mui/material';
import { Sidebar as MUI_Sidebar, Menu, MenuItem } from "react-mui-sidebar";
import { IconMenu, IconX, IconInfoCircle, IconEdit, IconStars} from '@tabler/icons-react';
import Link from 'next/link';
import ThemeModeToggle from '@/app/components/ThemeModeToggle';
import Profile from '@/app/components/Profile';
import Logo from '../../../(DashboardLayout)/layout/header/Logo';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Header = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, loading } = useSupabaseAuth();
  const theme = useTheme();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const pages = ['About', 'Blog', 'Features'];

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

  // Scrollbar styling
  const scrollbarStyles = {
    '&::-webkit-scrollbar': { width: '7px' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#eff2f7',
      borderRadius: '15px',
    },
  };

  // Drawer content
  const drawer = (
    <Box sx={{ width: 360, height: '100vh' }} role="presentation">
      <MUI_Sidebar
        width="100%"
        showProfile={false}
        themeColor={theme.palette.primary.main}
        themeSecondaryColor={theme.palette.secondary.main}
        textColor={theme.palette.text.primary}
      >
        {/* Header with logo and close button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mx: 2, my: 2 }}>
          <Logo showTitle/>
          <IconButton onClick={handleDrawerToggle}>
            <IconX />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <Menu subHeading="HOME">
          <MenuItem
            key="about"
            isSelected={pathname === "/about"}
            borderRadius="8px"
            icon={<IconInfoCircle />}
            link="/about"
            component={Link}
            sx={{ color: theme.palette.text.secondary }}
          >
            About
          </MenuItem>
       
          <MenuItem
            key="blog"
            isSelected={pathname === "/blog"}
            borderRadius="8px"
            icon={<IconEdit />}
            link="/blog"
            component={Link}
            sx={{ color: theme.palette.text.secondary }}
          >
            Blog
          </MenuItem>
          <MenuItem
            key="features"
            isSelected={pathname === "/features"}
            borderRadius="8px"
            icon={<IconStars/>}
            link="/features"
            component={Link}
            sx={{ color: theme.palette.text.secondary }}
          >
            Features
          </MenuItem>
        </Menu>
      </MUI_Sidebar>
    </Box>
  );

  return (
    <>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          {/* Mobile menu icon */}
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none', xs: 'inline' }, mr: 1 }}
          >
            <IconMenu width="24" height="24" />
          </IconButton>

          {/* Logo */}
          <Logo/>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                size="large"
                color="primary"
                component={Link}
                href={`/${page.toLowerCase()}`}
              >
                {page}
              </Button>
            ))}
          </Stack>

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
            {user && <Profile user={user} />}
            <ThemeModeToggle />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: { sx: { boxShadow: (theme) => theme.shadows[8], ...scrollbarStyles } },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;