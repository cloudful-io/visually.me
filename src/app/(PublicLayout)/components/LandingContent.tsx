"use client";
import React from "react";
import { Box, Grid, Typography, Button, useTheme } from "@mui/material";
import { IconChartCovariate } from '@tabler/icons-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useRouter } from "next/navigation";
import { supabase } from '@/utils/supabase/client';
import { UserProfileService } from "supabase-auth-lib";
import { useState, useEffect } from "react";
import { useCheckOnboarding } from "@/hooks/useCheckOnboarding";
import Typewriter from "./Typewriter";
import Loading from "@/app/loading";

export default function LandingContent() {
  const theme = useTheme();
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);

  const slogan1 = "Plan Smarter.";
  const slogan2 = "Live Better.";
  const slogan3 = "Visually Me.";

  const { loading } = useCheckOnboarding(user);

  useEffect(() => {
    if (user) {
      const fetchName = async () => {
        try {
          const userProfileService = new UserProfileService(supabase);
          const profile = await userProfileService.getById(user.id);
          setDisplayName(profile?.display_name || null);
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      };
      fetchName();
    }
  }, [user]);

  if (loading) return <Loading />;
  
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        flexDirection: "column",
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 0 },
      }}
    >
      {/* ------------------- */}
      {/* Optional Dashboard Prompt */}
      {/* ------------------- */}
      {user && !loading && displayName && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: 3,
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 6,
            },
          }}
          onClick={() => router.push("/dashboard")}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Welcome back, {displayName}!
          </Typography>
          <Button variant="contained" color="primary" size="small">
            Go to Dashboard
          </Button>
        </Box>
      )}

      <Grid container spacing={4} alignItems="center">
        {/* Left Column - Text */}
        <Grid size={{xs: 12, md: 6}}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconChartCovariate
                color={theme.palette.secondary.main}
                width="20"
                height="20"
                style={{ marginRight: 8 }}
              />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Take control of your own financial future
              </Typography>
            </Box>

            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }}>
              {slogan1}
            </Typography>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }}>
              {slogan2}
            </Typography>
            <Typography variant="h2" component="h1" color="primary" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }}>
              {slogan3}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                lineHeight: 1.4,
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                color: theme.palette.text.secondary,
              }}
            >
              Whether you are preparing for retirement, estimating Social Security income, mapping out college savings, or managing housing expenses — our interactive calculators and intuitive charts make it easy to visualize your goals and stay on track.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/calculators"
              sx={{ borderRadius: "999px" }}
            >
              Try It Out
            </Button>
          </Box>
        </Grid>

        {/* Right Column - Media */}
        <Grid size={{xs: 12, md: 6}}>
          <Box
            sx={{
              width: "100%",
              height: { xs: 300, sm: 400, md: 500 },
              backgroundColor: theme.palette.grey[200],
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                px: 2,
              }}
            >
              <Typewriter
                messages={[
                  "Do I have enough to retire?",
                  "How long will my savings last?",
                  "What will my retirement income be at 75?",
                  "How much should I put into my 401k each paycheck?",
                  "What will my Social Security be at 67?",
                ]}
              />
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
