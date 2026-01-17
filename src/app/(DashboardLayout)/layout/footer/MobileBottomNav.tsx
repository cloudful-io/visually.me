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
        
        value={pathname}
        onChange={(_, newValue) => router.push(newValue)}
      >
        {user ? [
            <BottomNavigationAction  
            key="/dashboard"
            label="Dashboard"
            value="/dashboard"
            icon={<IconLayoutDashboard/>}
            />,
            <BottomNavigationAction  
            key="/income"
            label="Income"
            value="/income"
            icon={<IconCash/>}
            />,
            <BottomNavigationAction  
            key="/real-estate"
            label="Real Estate"
            value="/real-estate"
            icon={<IconHomeSignal/>}
            />
        ] : null}
        <BottomNavigationAction  
            label="Calculators"
            value="/calculators"
            icon={<IconCalculator/>}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;