"use client"
import Menuitems from "./MenuItems";
import { useTheme } from '@mui/material/styles';
import { Box, Divider, Tooltip } from "@mui/material";
import {
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../header/Logo";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const renderMenuItems = (items: any[], pathDirect: string, user: any, collapsed: boolean) => {
  // Filter and render menu items recursively
  const visibleItems = items.filter((item) => {
    if (item.authRequired && !user) return false;
    return true;
  });

  return visibleItems.map((item) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    // --- Subheader ---
    if (item.subheader) {
      if (collapsed) 
        return <Divider key={item.subheader} sx={{ my:1}}/>;
      // Only show if there is at least one item after it that is visible and not another subheader
      const hasFollowingVisible = visibleItems.some(
        (next) => !next.subheader && (!next.authRequired || user)
      );
      if (!hasFollowingVisible) return null;
      return <Menu subHeading={item.subheader} key={item.subheader} />;
    }

    // --- Submenu (nested items) ---
    if (item.children) {
      if (collapsed) {
        return (
          <Tooltip title={item.title} key={item.id} placement="right" arrow>
            <Box sx={{ display: collapsed ? "flex" : "inline", justifyContent: collapsed ? "center" : "flex-start" }}>
              <MenuItem 
                icon={itemIcon} 
                sx={{
                  justifyContent: "center",
                  px: 0,
                  minHeight: 48,
                }}/>
                </Box>
          </Tooltip>
        );
      }
      const renderedChildren = renderMenuItems(item.children, pathDirect, user, collapsed);
      if (renderedChildren.filter(Boolean).length === 0) return null; // hide if all children are filtered out

      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius="7px"
        >
          {renderedChildren}
        </Submenu>
      );
    }

    // --- Normal item ---
    return (
      <Box 
        px={collapsed ? 1 : 3} 
        key={item.id}>
        <Tooltip title={item.title} key={item.id} placement="right" arrow>
          <Box sx={{ width: "100%",display: collapsed ? "flex" : "inline", justifyContent: collapsed ? "center" : "flex-start" }}>
            <MenuItem
              key={item.id}
              isSelected={pathDirect.indexOf(item?.href) >= 0}
              borderRadius="8px"
              icon={itemIcon}
              link={item.href}
              component={Link}
            >
              {!collapsed && item.title}
            </MenuItem>
          </Box>
        </Tooltip>
      </Box>
    );
  });
};

const SidebarItems = ({ collapsed }: { collapsed: boolean }) => {
  const pathname = usePathname();
  const theme = useTheme();
  const { user, loading } = useSupabaseAuth();
  const homeUrl = user ? "/dashboard" : "/";

  return (
    <MUI_Sidebar
      width="100%"
      showProfile={false}
      themeColor={theme.palette.primary.main}
      themeSecondaryColor={theme.palette.secondary.main}
      textColor={theme.palette.text.primary}
    >
      <Box sx={{ mx: collapsed ? 1 : 3, my: 1.5 }}>
        <Logo showTitle={!collapsed} homeUrl={homeUrl} />
      </Box>
      
      {renderMenuItems(Menuitems, pathname, user, collapsed)}
    </MUI_Sidebar>
  );
};

export default SidebarItems;
