"use client";

import type { ReactNode } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  useTheme,
  Button,
  List,
  ListItem,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  IconCash,
  IconHomeSignal,
  IconLayoutDashboard,
  IconCalculator,
  IconSparkles,
} from "@tabler/icons-react";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: ReactNode;
  image: string;
};

const features: Feature[] = [
  {
    icon: IconCash,
    title: "Retirement Income & Investment Assets",
    description: (
      <>
        Manage and visualize income streams including{" "}
        <strong>FERS</strong> or <strong>uniformed service (military)</strong>{" "}
        pensions, <strong>Social Security</strong>, and{" "}
        <strong>retirement savings</strong> (e.g. 401(k)) — all in one place.
        <br />
        <br />
        Project your retirement income and balance over your retirement years, with the ability for override your assumptions such as annual yield, withdrawal rate, etc.  
      </>
    ),
    image: "/images/retirement-income.png",
  },
  {
    icon: IconHomeSignal,
    title: "Real Estate Properties",
    description:
      "Track real estate rental income and expenses (e.g. mortgage, property tax, homeowner association fee), and payoff date as part of your overall financial picture.  Project your net cash flow in order to make informed decision about your real estate portfolio.",
    image: "/images/real-estate.png",
  },
  {
    icon: IconLayoutDashboard,
    title: "Visual Financial Dashboard",
    description:
      <>
      <List sx={{ pl: 2 }}>
        <ListItem>
        <Typography variant="body1" color="text.secondary">
            See projected income, investment balances, and real estate cash flow over time with clear, interactive charts.
        </Typography>
        </ListItem>
        <ListItem>
        <Typography variant="body1" color="text.secondary">
            Track <strong>net cash flow across all income sources and expenses</strong> to understand how money moves month-to-month and year-to-year.
        </Typography>
        </ListItem>
        <ListItem>
        <Typography variant="body1" color="text.secondary">
            Combine retirement income, investments, and property performance into a single, unified view.
        </Typography>
        </ListItem>
        <ListItem>
        <Typography variant="body1" color="text.secondary">
            Follow a comprehensive <strong>financial timeline</strong> that spans from today through key milestones such as retirement, home purchases, and education expenses.
        </Typography>
        </ListItem>
        <ListItem>
        <Typography variant="body1" color="text.secondary">
            Make informed decisions by seeing how today’s choices shape your long-term financial future.
        </Typography>
        </ListItem>
    </List>
      </>,
    image: "/images/blog/feature/dashboard.png",
  },
  {
    icon: IconCalculator,
    title: "Powerful Scenario-Based Calculators",
    description:
      "Compare scenarios across retirement, pensions, Social Security, mortgages, and college planning to make confident decisions.",
    image: "/images/blog/feature/scenario.png",
  },
];

export default function FeatureContent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={2} alignItems="center" mb={8} textAlign="center">
          <Typography variant="h2" fontWeight={700}>
            Platform <Box component="span" color="primary.main">Features</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="md">
            Everything you need to visualize, compare, and plan your financial future.
          </Typography>
        </Stack>

        {/* Feature Sections */}
        <Stack spacing={10}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <Grid
                container
                spacing={6}
                alignItems="center"
                key={feature.title}
                direction={isEven ? "row" : "row-reverse"}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Stack spacing={2}>
                      <Icon size={40} color={theme.palette.primary.main} />
                      <Typography variant="h4" fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Stack>
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box
                      component="img"
                      src={feature.image}
                      alt={feature.title}
                      sx={{
                        width: "100%",
                        borderRadius: 4,
                        boxShadow: 3,
                      }}
                    />
                  </motion.div>
                </Grid>
              </Grid>
            );
          })}
        </Stack>

        {/* Calculator Summary */}
        <Box mt={12}>
          <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <IconCalculator size={42} color={theme.palette.primary.main} />
                <Typography variant="h4" fontWeight={600}>
                  Built-In Financial Calculators
                </Typography>
                <Typography variant="body1" color="text.secondary" maxWidth="md">
                  Includes calculators for FERS and military pensions, retirement savings, Social Security,
                  mortgage amortization, and college savings & tuition — all supporting side-by-side
                  scenario comparisons.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* CTA */}
        <Stack alignItems="center" mt={12} spacing={2} textAlign="center">
          <IconSparkles size={36} color={theme.palette.primary.main} />
          <Typography variant="h5" fontWeight={600}>
            Start exploring your financial possibilities
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2, borderRadius: "999px" }}
            href="/calculators"
          >
            Explore the Tools
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
