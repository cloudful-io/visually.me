"use client";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import {
  IconLayoutDashboard,
  IconHomeSignal,
  IconCash,
  IconCalculator
} from "@tabler/icons-react";
import Menuitems from "../sidebar/MenuItems";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSupabaseAuth();

  // Pick only top-level items you want in bottom nav
  /*const navItems = Menuitems.filter(
    (item) => item.href && !item.children && !item.subheader
  ).slice(0, 4); // limit to 3–5 items max*/

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: "block", md: "none" },
        zIndex: 1200,
      }}
      elevation={8}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(_, newValue) => router.push(newValue)}
      >
        {user ? [
    <BottomNavigationAction  
      key="/dashboard"
      label="Dashboard"
      value="/dashboard"
      icon={<IconLayoutDashboard size={22} />}
    />,
    <BottomNavigationAction  
      key="/income"
      label="Income and Investment"
      value="/income"
      icon={<IconCash size={22} />}
    />,
    <BottomNavigationAction  
      key="/real-estate"
      label="Real Estate"
      value="/real-estate"
      icon={<IconHomeSignal size={22} />}
    />
  ] : null}
        <BottomNavigationAction  
            label="Calculators"
            value="/calculators"
            icon={<IconCalculator size={22} />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;