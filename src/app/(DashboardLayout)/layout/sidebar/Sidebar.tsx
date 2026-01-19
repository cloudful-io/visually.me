import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

interface ItemType {
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up("md"));

  const drawerWidthExpanded = 360;
  const drawerWidthCollapsed = 72;
  
  if (mdUp) {
    return (
      <Box
        sx={{
          width: isSidebarOpen ? drawerWidthExpanded : drawerWidthCollapsed,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Drawer
          variant="permanent"
          open
          slotProps={{
            paper: {
              sx: {
                overflowX: "hidden",
                width: isSidebarOpen
                  ? drawerWidthExpanded
                  : drawerWidthCollapsed,
                transition: (theme) =>
                  theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.standard,
                  }),
              },
            },
          }}
        >
          {/* Apply styles to hide text when collapsed */}
          {!isSidebarOpen && (
            <style>
              {`
                /* Hide the text container entirely when collapsed */
                .sidebar .MuiListItemText-root {
                  display: none !important;
                }
              `}
            </style>
          )}
          <SidebarItems collapsed={!isSidebarOpen} />
        </Drawer>
      </Box>
    );
  }

  // Mobile 
  return null;
};

export default MSidebar;





