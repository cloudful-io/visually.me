import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, IconButton } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";

export function AddRealEstateCard({ onAdd }: { onAdd: () => void }) {
  const theme = useTheme();

  const handleAdd = () => {
    onAdd();
  };

  return (
    <DashboardCard>
      <Box display="flex" flexDirection="column">
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ minHeight: 160 }}
        >
          <IconButton
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: `2px dashed ${theme.palette.info.main}`,
            }}
            color="primary"
            onClick={handleAdd}
          >
            <IconPlus size={40} />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            Add Property
          </Typography>
        </Stack>
      </Box>
    </DashboardCard>
  );
}
