"use client";
import { Grid, Box, Card, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/components/Logo";
import {AuthResetPassword} from "supabase-auth-lib"

const Reset2 = () => (
  <PageContainer title="Reset Password" description="Typing Help: Reset Password page">
    <Box
      sx={{
        position: "relative",
        "&:before": {
          content: '""',
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: "0.3",
        },
      }}
    >
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{
          height: {
            xs: "90vh", // mobile
            md: "100vh", // medium and larger screens
          },
        }}
      >
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          size={{
            xs: 12,
            sm: 12,
            lg: 4,
            xl: 3
          }}>
          <Card
            elevation={9}
            sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Logo />
            </Box>
            <AuthResetPassword
              subtext={
                <Typography
                    variant="h3"
                    textAlign="center"
                    color="textSecondary"
                    fontWeight="500"
                    mb={1}
                  >
                    Visually.Me
                  </Typography>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Reset2;
