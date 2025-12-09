"use client";

import { Box, Container, Grid, Typography, Avatar, Stack, useTheme, Button } from "@mui/material";
import { motion } from "framer-motion";
import { IconTargetArrow, IconUsersGroup, IconSparkles } from "@tabler/icons-react";

export default function AboutPage() {
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
            About <Box component="span" color={theme.palette.primary.main}>Visually.Me</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="md">
            Plan Smarter. Live Better. Visually Me.
          </Typography>
        </Stack>

        {/* Mission Section */}
        <Grid container spacing={6} alignItems="center" mb={10}>
          <Grid size={{xs:12, md: 6}}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                At Visually.Me, we believe financial planning shouldn’t be intimidating. Our goal is to 
                help people make smarter, more confident life decisions through visual, data-driven 
                tools that turn complex financial goals into simple, actionable insights.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Whether you are saving for retirement or exploring your next big milestone, Visually.Me 
                helps you see your future — literally.
              </Typography>
            </motion.div>
          </Grid>
          <Grid size={{xs:12, md: 6}}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                component="img"
                src="/images/visually-me.png"
                alt="Mission illustration"
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Story Section */}
        <Stack spacing={3} alignItems="center" mb={10} textAlign="center">
          <IconTargetArrow size={40} color={theme.palette.primary.main} />
          <Typography variant="h4" fontWeight={600}>
            Our Story
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="md">
            Visually.Me started as a simple idea — to make financial planning more intuitive. 
            What began as a side project for my wife and I has grown into a platform that empowers individuals 
            to visualize their goals, model scenarios, and make informed choices — without needing 
            a financial degree.
          </Typography>
        </Stack>

        {/* Team Section */}
        <Stack spacing={3} alignItems="center" mb={8} textAlign="center">
          <IconUsersGroup size={40} color={theme.palette.primary.main} />
          <Typography variant="h4" fontWeight={600}>
            Meet the Team
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="md">
            We are a small but passionate group of designers, developers, and data enthusiasts 
            who believe that financial awareness is the foundation of freedom.
          </Typography>
        </Stack>

        {/* Example Team Grid */}
        <Grid container spacing={4} justifyContent="center">
          {[
            { name: "Will", role: "Founder & Developer", img: "/images/blog/authors/man.png" },
            { name: "Lorenda", role: "Senior Consultant", img: "/images/blog/authors/woman.png" },
            { name: "Adelynn", role: "Senior Advisor", img: "/images/blog/authors/girl.png" },
            { name: "Arden", role: "Advisor", img: "/images/blog/authors/boy.png" },
          ].map((member) => (
            <Grid size={{xs:12, sm: 6, md: 3}} key={member.name}>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  src={member.img}
                  alt={member.name}
                  sx={{ width: 120, height: 120, boxShadow: 3 }}
                />
                <Typography variant="h6" fontWeight={600}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Stack alignItems="center" mt={10}>
          <IconSparkles size={36} color={theme.palette.primary.main} />
          <Typography variant="h5" fontWeight={600} mt={2}>
            Ready to visualize your future?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3, borderRadius: "999px" }}
            href="/calculators"
          >
            Get Started
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}