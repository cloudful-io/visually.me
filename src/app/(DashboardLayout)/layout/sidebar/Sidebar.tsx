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
                .MuiListItemText-root {
                  display: none !important;
                }
                /* Remove forced margins/widths from the icon container */
                .MuiListItemIcon-root {
                  margin-right: 0 !important;
                  min-width: 0 !important;
                  justify-content: center !important;
                  width: 100% !important;
                }
                /* Center the button content */
                .MuiButtonBase-root {
                  justify-content: center !important;
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





