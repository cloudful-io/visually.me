"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/utils/supabase/client';
import { UserService } from 'supabase-auth-lib';
import { UserProfileService } from 'supabase-auth-lib';
import Loading from "@/app/loading";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import {OnboardingAgreementStep} from "supabase-auth-lib";
import { OnboardingProfileStep } from "../components/OnboardingProfileStep";
import { Box, Paper, Step, StepLabel, Stepper, Typography, Snackbar, Alert } from "@mui/material";
import TermsOfUse from "@/app/components/TermsOfUse";
import PrivacyPolicy from "@/app/components/PrivacyPolicy";
import { useUserAttributes } from "@/lib/userAttributes/hook";

const steps = ["Agreements", "Profile"];

export default function OnboardingPage() {
  const MINIMUM_AGE = 18;
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const currentYear = new Date().getFullYear();
  const minYear = 1900;
  const maxYear = currentYear - MINIMUM_AGE;

  const { save: saveUserAttributes } = useUserAttributes({ lazy: true });

  const [isSaving, setIsSaving] = useState(false);

  // Step 2: Profile
  const [displayName, setDisplayName] = useState("");
  const [birthYear, setBirthYear] = useState(1970);
  const [targetRetirementAge, setTargetRetirementAge] = useState(62);
  const [startYear, setStartYear] = useState(currentYear);
  const [lifeExpectancyAge, setLifeExpectancyAge] = useState(85);

  // Step navigation
  const [activeStep, setActiveStep] = useState(0);

  const canContinueStep2 = 
    !!displayName &&
    !!birthYear &&
    !!startYear &&
    !!targetRetirementAge &&
    !!lifeExpectancyAge;

  const validate = {
    birthYear: !!birthYear && (birthYear < minYear || birthYear > maxYear),
    startYear: !!startYear && (startYear < minYear || startYear > currentYear),
    targetRetirementAge: !!targetRetirementAge && (targetRetirementAge < 40 || targetRetirementAge > 80),
    lifeExpectancyAge: !!lifeExpectancyAge && (lifeExpectancyAge <= 0 || lifeExpectancyAge > 150),
  };

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
    else if (!birthYear) {
      setErrorMsg("Please provide your year of birth.");
      return;
    }
    else if (!startYear) {
      setErrorMsg("Please provide the year to start projecting data");
      return;
    }
    else if (!targetRetirementAge) {
      setErrorMsg("Please provide your target retirement age.");
      return;
    }
    else if (!lifeExpectancyAge) {
      setErrorMsg("Please provide your life expectancy age");
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
      
      // Save attributes via hook
      await saveUserAttributes({
        spouse: false,
        birthYear,
        startYear,
        targetRetirementAge,
        lifeExpectancyAge
      });
      
      // Redirect user to dashboard
      setTimeout(() => router.push("/onboarding"), 0);
    } catch (error) {
        setErrorMsg("Failed to save profile. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };
  useEffect(() => {
    if (user != null) {
      setDisplayName(user.user_metadata?.full_name ?? "");
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
    <PageContainer
      title="New User Onboarding"
      description="Page to onboard new users to Visually.Me">
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
            <OnboardingProfileStep
              displayName={displayName}
              setDisplayName={setDisplayName}
              birthYear={birthYear}
              setBirthYear={setBirthYear}
              startYear={startYear}
              setStartYear={setStartYear}
              targetRetirementAge={targetRetirementAge}
              setTargetRetirementAge={setTargetRetirementAge}
              lifeExpectancyAge={lifeExpectancyAge}
              setLifeExpectancyAge={setLifeExpectancyAge}
              isSaving={isSaving}
              handleBack={handleBack}
              handleSave={handleSave}
              validate={validate}
              canContinue={canContinueStep2}
              minYear={minYear}
              maxYear={maxYear}
              currentYear={currentYear}
            />
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
    </PageContainer>
  );
}