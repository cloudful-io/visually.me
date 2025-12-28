"use client";
import { Grid, Box, Card, CardContent, CardActions, Typography, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import PageContainer from "../components/container/PageContainer";
import { calculatorRegistry } from "@/lib/calculators/registry";

const calculators = Object.values(calculatorRegistry)
  .map((entry) => ({
    id: entry.config.id,
    title: entry.config.shortTitle,
    description: entry.config.calculatorDescription,
    route: entry.config.calculatorRoute,
    icon: entry.config.icon,
  }))
  .sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

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
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => router.push(calc.route)} 
                    sx={{width: { xs: '100%', sm: 'auto' }}}
                  >
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