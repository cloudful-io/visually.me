import { useState } from "react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useTheme } from '@mui/material/styles';
import {
  Menu,
  MenuItem,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { IconPlus, IconBuildingBank, IconUser, IconCoin, IconMilitaryRank } from "@tabler/icons-react";

export function AddIncomeCard({ onAdd }: { onAdd: (type: string) => void }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (type: string) => {
    handleClose();
    onAdd(type);
  };

  return (
    <DashboardCard>
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ minHeight: 180 }}
      >
        <IconButton
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2px dashed ${theme.palette.info.main}`,
          }}
          color="primary"
          onClick={handleOpen}
        >
          <IconPlus size={40} />
        </IconButton>

        <Typography variant="h6" fontWeight={600}>
          Add Income Source
        </Typography>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => handleSelect("fers-pension")}>
            <IconUser size={18} style={{ marginRight: 8 }} />
            FERS Pension
          </MenuItem>

          <MenuItem onClick={() => handleSelect("military-pension")}>
            <IconMilitaryRank size={18} style={{ marginRight: 8 }} />
            Uniformed Service Pension
          </MenuItem>

          <MenuItem onClick={() => handleSelect("retirement-savings")}>
            <IconCoin size={18} style={{ marginRight: 8 }} />
            Retirement Savings
          </MenuItem>

          <MenuItem onClick={() => handleSelect("social-security")}>
            <IconBuildingBank size={18} style={{ marginRight: 8 }} />
            Social Security
          </MenuItem>
        </Menu>
      </Stack>
    </DashboardCard>
  );
}
