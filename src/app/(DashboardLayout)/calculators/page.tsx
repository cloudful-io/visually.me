"use client";
import { Grid, Box, Card, CardContent, CardActions, Typography, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import PageContainer from "../components/container/PageContainer";
import {
  IconHome,
  IconUser,
  IconBuildingBank,
  IconSchool,
  IconCoin,
} from "@tabler/icons-react";

// Define calculator metadata here
const calculators = [
  {
    id: "college-tuition",
    title: "College Tuition Calculator",
    description: "Estimate how much you need to save to cover future tuition costs.",
    route: "/calculators/college-tuition",
    icon: IconSchool,
  },
  {
    id: "fers-pension",
    title: "FERS Pension Calculator",
    description: "Calculate your FERS pension based on years of service and high-3 salary.",
    route: "/calculators/fers-pension",
    icon: IconUser,
  },
  {
    id: "mortgage-amortization",
    title: "Mortgage Amortization Calculator",
    description: "See how your loan payments are split between principal and interest over time.",
    route: "/calculators/mortgage-amortization",
    icon: IconHome,
  },
  {
    id: "retirement-savings",
    title: "Retirement Savings & Withdrawal Calculator",
    description: "Project how long your retirement savings will last given contributions and withdrawals.",
    route: "/calculators/retirement-savings",
    icon: IconCoin,
  },
  {
    id: "social-security",
    title: "Social Security Calculator",
    description: "Estimate your Social Security monthly benefits based on earnings and retirement age.",
    route: "/calculators/social-security",
    icon: IconBuildingBank,
  },
];

export default function CalculatorsPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <PageContainer
        title="Financial Calculators"
        description="Financial calculators at your finger tips."
        showTitle>
      <Grid container spacing={3}>
        {calculators.map((calc) => {
          const IconComponent = calc.icon;
          return (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={calc.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Icon */}
                  <Box sx={{ mb: 2 }}>
                    <IconComponent color={theme.palette.secondary.main} size={32} stroke={1.5} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {calc.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {calc.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined" onClick={() => router.push(calc.route)}>
                    Open
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </PageContainer>
  );
}