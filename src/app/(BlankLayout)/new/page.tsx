"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
//import { useMode } from "@/contexts/ModeContext";
//import { useUserRoles } from "@/contexts/UserRolesContext";
import { supabase } from '@/utils/supabase/client';
import { UserService } from 'supabase-auth-lib';
import { UserProfileService } from 'supabase-auth-lib';
import { UserRoleService } from 'supabase-auth-lib';
import Loading from "@/app/loading";
import {OnboardingAgreementStep} from "supabase-auth-lib";
import { Box, Button, Paper, Step, StepLabel, Stepper, Typography, CircularProgress, TextField, Snackbar, Alert } from "@mui/material";
import Image from "next/image";
import TermsOfUse from "@/app/components/TermsOfUse";
import PrivacyPolicy from "@/app/components/PrivacyPolicy";

const steps = ["Agreements", "Profile"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  //const { setMode } = useMode();
  //const { setRoles } = useUserRoles();
  
  const [isSaving, setIsSaving] = useState(false);

  // Step 2: Profile
  const [displayName, setDisplayName] = useState("");

  // Step navigation
  const [activeStep, setActiveStep] = useState(0);

  const canContinueStep2 = displayName;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const [errorMsg, setErrorMsg] = useState("");
  
  const handleSave = async () => {
    // Anonymous users
    if (!user) {
        // Redirect user to homepage
        router.push("/");
        return;
    }
    else if (!displayName) {
      setErrorMsg("Please provide a display name.");
      return;
    }
    

    setIsSaving(true);
    try {
      const userService = new UserService(supabase);
      const userObject = await userService.getOrCreateOrUpdate({
        id: user.id,
        email: user.email!,
        onboardingComplete: true,
      });

      if (!userObject?.id) throw new Error("Failed to get user ID from database");

      const userProfileService = new UserProfileService(supabase);
      await userProfileService.updateDisplayName(user.id, displayName);

      //const userRoleService = new UserRoleService(supabase);
      //await userRoleService.addByName({ userId: user.id, roleName: selectedRole });

      //setRoles([selectedRole]);

      // Redirect user to dashboard
      setTimeout(() => router.push("/dashboard"), 0);
    } catch (error) {
        setErrorMsg("Failed to save profile. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };
  useEffect(() => {
    if (user != null) {
      setDisplayName(user.user_metadata?.full_name);
    }
    const checkOnboardingStatus = async () => {
    if (!user) return; // Wait until user is available (can also be null if not logged in)

    try {
      const userService = new UserService(supabase);
      const isOnboarded = await userService.isOnboarded(user.id);
      
      if (isOnboarded) {
        router.replace("/dashboard");
      }
      
    } catch (err) {
      console.error("Failed to check onboarding status:", err);
    }
  };

  checkOnboardingStatus();
  }, [user, router]);
  
  if (user === undefined) {
    return <Loading/>;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", position: "relative", top: "-10%" }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography align="center" sx={{ mb: 2 }}>
            Step {activeStep + 1} of {steps.length}
        </Typography>
        {/* Step Content */}
        {activeStep === 0 && (
          <>
            <OnboardingAgreementStep
              title="Visually.Me"
              onContinue={handleNext}
              TermsComponent={TermsOfUse}
              PrivacyComponent={PrivacyPolicy}
            />
          </>
        )}

        {activeStep === 1 && (
          <>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField
                label="Display Name"
                value={displayName}
                disabled={isSaving}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
              <Button variant="outlined" disabled={isSaving} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!canContinueStep2 || isSaving}
                onClick={handleSave}
                >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : "Save Profile"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
        >
        <Alert severity="error" onClose={() => setErrorMsg("")}>
            {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
