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
    description: "Estimate how much you need to save to cover future tuition costs, based on initial balance of savings, years of college education, annual contributions, estimated yield and inflation rates, and cost of college education.",
    route: "/calculators/college-tuition",
    icon: IconSchool,
  },
  {
    id: "fers-pension",
    title: "FERS Pension Calculator",
    description: "Calculate your Federal Employee Retirement System (FERS) pension based on type of retirement, years of service, high-3 salary, and retirement age.",
    route: "/calculators/fers-pension",
    icon: IconUser,
  },
  {
    id: "mortgage-amortization",
    title: "Mortgage Amortization Calculator",
    description: "Determine how your loan payments are split between principal and interest over time, based on loan amount, interest rate, loan term, and whether extra monthly payments are made.",
    route: "/calculators/mortgage",
    icon: IconHome,
  },
  {
    id: "retirement-savings",
    title: "Retirement Savings & Withdrawal Calculator",
    description: "Project how long your retirement savings will last given your initial investment balance, annual contribution, estimated yield and withdraw rates.",
    route: "/calculators/retirement-savings",
    icon: IconCoin,
  },
  {
    id: "social-security",
    title: "Social Security Calculator",
    description: "Estimate your Social Security monthly benefits based on earnings, retirement age, and Cost-of-Living Adjustment (COLA).",
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
                  <Button size="small" variant="contained" onClick={() => router.push(calc.route)}>
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