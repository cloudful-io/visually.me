"use client";
import React, {useState} from "react";
import { SpeedDial, SpeedDialAction, Tooltip, FabProps } from "@mui/material";

interface Action {
  id: string;               
  icon: React.ReactNode;    
  label: string;            
  onClick?: () => void;    
}

interface SectionSpeedDialProps {
  actions: Action[];
  icon: React.ReactNode;     
  tooltip?: string;          
  sx?: object;               
  fabProps?: FabProps;       
}

export default function SectionSpeedDial({
  actions,
  icon,
  tooltip = "Navigate",
  sx = {},
  fabProps = {},
}: SectionSpeedDialProps) {

  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -50; 
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <Tooltip title={tooltip} placement="bottom">
      <SpeedDial
        ariaLabel={tooltip}
        icon={icon}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}                
        FabProps={{
          color: "secondary",
          ...fabProps,
        }}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 84 },
          right: { xs: 8, sm: 32 },
          zIndex: 9999,
          "& .MuiFab-root": {
            width: 48,
            height: 48,
          },
          ...sx,
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.id}
            icon={action.icon}
            slotProps={{ tooltip: { title: action.label }}}
            onClick={() => {
              action.onClick?.();
              scrollTo(action.id);
            }}
          />
        ))}
      </SpeedDial>
    </Tooltip>
  );
}