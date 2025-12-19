"use client";
import { Grid, Box, Card, CardContent, CardActions, Typography, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import PageContainer from "../components/container/PageContainer";
import { collegeTuitionConfig } from "@/configs/collegeTuition";
import { fersPensionConfig } from "@/configs/fersPension";
import { militaryPensionConfig } from "@/configs/militaryPension";
import { mortgageAmortizationConfig } from "@/configs/mortgageAmortization";
import { retirementSavingsConfig } from "@/configs/retirementSavings";
import { socialSecurityConfig } from "@/configs/socialSecurityBenefits";

// Define calculator metadata here
const calculators = [
  {
    id: collegeTuitionConfig.id,
    title: collegeTuitionConfig.shortTitle,
    description: collegeTuitionConfig.calculatorDescription,
    route: collegeTuitionConfig.calculatorRoute,
    icon: collegeTuitionConfig.icon,
  },
  {
    id: fersPensionConfig.id,
    title: fersPensionConfig.shortTitle,
    description: fersPensionConfig.calculatorDescription,
    route: fersPensionConfig.calculatorRoute,
    icon: fersPensionConfig.icon,
  },
  {
    id: mortgageAmortizationConfig.id,
    title: mortgageAmortizationConfig.shortTitle,
    description: mortgageAmortizationConfig.calculatorDescription,
    route: mortgageAmortizationConfig.calculatorRoute,
    icon: mortgageAmortizationConfig.icon,
  },
  {
    id: retirementSavingsConfig.id,
    title: retirementSavingsConfig.shortTitle,
    description: retirementSavingsConfig.calculatorDescription,
    route: retirementSavingsConfig.calculatorRoute,
    icon: retirementSavingsConfig.icon,
  },
  {
    id: socialSecurityConfig.id,
    title: socialSecurityConfig.shortTitle,
    description: socialSecurityConfig.calculatorDescription,
    route: socialSecurityConfig.calculatorRoute,
    icon: socialSecurityConfig.icon,
  },
  {
    id: militaryPensionConfig.id,
    title: militaryPensionConfig.shortTitle,
    description: militaryPensionConfig.calculatorDescription,
    route: militaryPensionConfig.calculatorRoute,
    icon: militaryPensionConfig.icon,
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
                    <IconComponent
                      color={theme.palette.secondary.main}
                      size={48}
                      stroke={1.5}
                    />   
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