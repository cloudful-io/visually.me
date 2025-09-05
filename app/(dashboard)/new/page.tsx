"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getOrCreateOrUpdateUser, getOrCreateOrUpdateUserProfile } from "@/lib/user";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

const steps = ["Agreements", "Profile"];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);


  // Step 1: Agreements
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Step 2: Profile
  const [fullName, setFullName] = useState("");
  const [birthYear, setBirthYear] = useState(1970);
  const [retirementAge, setRetirementAge] = useState(62);

  // Step navigation
  const [activeStep, setActiveStep] = useState(0);

  const canContinueStep1 = agreeTerms && agreePrivacy;
  const canContinueStep2 = fullName && birthYear && retirementAge;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = async () => {
    if (!session?.user) {
        alert("No user session found!");
        return;
    }

    setIsSaving(true);
    try {
        const userRes = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            fullName: fullName,
            onboardingComplete: true,
          }),
        });
        const user = await userRes.json();

        if (!user?.id) {
          throw new Error("Failed to get user ID from database");
        }
        const profileRes = await fetch("/api/userProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            fullName,
            birthYear,
            retirementAge,
          }),
        });

        const profile = await profileRes.json();

        // optionally go to next step or show success message
        router.push("/dashboard");
    } catch (error) {
        console.error("Error saving profile:", error);
        alert(error);
    } finally {
        setIsSaving(false);
    }
  };

  // Prefill full name when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setFullName(session.user.name);
    }
  }, [session]);
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {activeStep === 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Welcome to VisuallyMe
            </Typography>
            <Typography variant="body1" gutterBottom>
              Before continuing, please review and accept the following:
            </Typography>

            <FormGroup>
                {/* Terms of Use */}
                <FormControlLabel
                control={
                    <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                }
                label={
                    <span>
                    I agree to the{" "}
                    <Link component="button" onClick={() => setShowTerms(true)}>
                        Terms of Use
                    </Link>
                    </span>
                }
                />
                {/* Privacy Policy */}
                <FormControlLabel
                control={
                    <Checkbox
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    />
                }
                label={
                    <span>
                    I agree to the{" "}
                    <Link component="button" onClick={() => setShowPrivacy(true)}>
                        Privacy Policy
                    </Link>
                    </span>
                }
                />
            </FormGroup>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={!canContinueStep1}
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              Set Up Your Profile
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please provide some basic information to personalize your
              retirement projections.
            </Typography>

            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Year of Birth"
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Target Retirement Age"
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                fullWidth
              />
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!canContinueStep2 || isSaving}
                onClick={handleSave}
                >
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Terms Dialog */}
      <Dialog
        open={showTerms}
        onClose={() => setShowTerms(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Terms of Use</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            This tool is provided for educational purposes only. It does not
            constitute financial, investment, legal, or tax advice. Results are
            based on assumptions and not guaranteed. You are solely responsible
            for your decisions. We are not liable for any losses or damages.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTerms(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            We collect basic info (age, income, retirement goals) for
            calculations. Data is stored securely and will not be shared or
            sold. You may request deletion anytime. By using this tool, you
            consent to this handling.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacy(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
