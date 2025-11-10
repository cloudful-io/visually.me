"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  CircularProgress,
  LinearProgress,
  Snackbar,
  Alert
} from "@mui/material";

const steps = ["Agreements", "Profile"];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Agreements
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Step 2: Profile
  const [fullName, setFullName] = useState("");
  
  const [birthYear, setBirthYear] = useState(currentYear-40);
  const [retirementAge, setRetirementAge] = useState(62);
  const [deathAge, setDeathAge] = useState(90);

  // Step navigation
  const [activeStep, setActiveStep] = useState(0);

  const canContinueStep1 = agreeTerms && agreePrivacy;
  const canContinueStep2 = fullName && birthYear && retirementAge && deathAge;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async () => {
    // Anonymous users
    if (!session?.user) {
        // Redirect user to homepage
        router.push("/");
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
            deathAge,
          }),
        });

        const profile = await profileRes.json();

        // Redirect user to dashboard
        router.push("/dashboard");
    } catch (error) {
        console.error("Error saving profile:", error);
        setErrorMsg("Failed to save your profile. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

  useEffect(() => {
    // Anonymous users - redirect to homepage
    if (status === "unauthenticated") {
        router.push("/");
    }
    // Prefill full name when session loads
    if (session?.user?.name) {
      setFullName(session.user.name);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <LinearProgress />; // show a loading bar
}
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", position: "relative" }}>
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
                disabled={isSaving}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Year of Birth"
                type="number"
                value={birthYear}
                disabled={isSaving}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                fullWidth
                error={birthYear < 1900 || birthYear > currentYear}
                helperText={
                    birthYear < 1900 || birthYear > currentYear
                    ? `Must be between 1900 and ${currentYear}`
                    : ""
                }
              />
              <TextField
                label="Target Retirement Age"
                type="number"
                value={retirementAge}
                disabled={isSaving}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                fullWidth
                error={retirementAge < 21 || retirementAge > 100}
                helperText={
                    retirementAge < 21 || retirementAge > 100
                    ? `Must be between 21 and 100`
                    : ""
                }
              />
              <TextField
                label="Life Expectancy Age"
                type="number"
                value={deathAge}
                disabled={isSaving}
                onChange={(e) => setDeathAge(Number(e.target.value))}
                fullWidth
                error={deathAge < 21 || retirementAge > 100}
                helperText={
                    deathAge < 21 || deathAge > 100
                    ? `Must be between 21 and 100`
                    : "Age you expect to live until"
                }
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

      {/* Terms Dialog */}
      <Dialog
        open={showTerms}
        onClose={() => setShowTerms(false)}
        scroll="paper"
        maxWidth="sm"
        aria-labelledby="terms-title"
        fullWidth
      >
        <DialogTitle id="terms-title">Terms of Use</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            This tool is provided for educational purposes only. It does not
            constitute financial, investment, legal, or tax advice. Results are
            based on assumptions and not guaranteed. You are solely responsible
            for your decisions. We are not liable for any losses or damages.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTerms(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
            setAgreeTerms(true); // auto-check the box
            setShowTerms(false);
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        maxWidth="sm"
        aria-labelledby="privacy-title"
        fullWidth
      >
        <DialogTitle id="privacy-title">Privacy Policy</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            We collect basic info (age, income, retirement goals) for
            calculations. Data is stored securely and will not be shared or
            sold. You may request deletion anytime. By using this tool, you
            consent to this handling.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacy(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
            setAgreePrivacy(true); // auto-check the box
            setShowPrivacy(false);
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
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
