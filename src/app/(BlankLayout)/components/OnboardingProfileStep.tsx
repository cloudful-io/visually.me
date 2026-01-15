"use client";
import { Box, Button, TextField, CircularProgress } from "@mui/material";

type Props = {
  displayName: string;
  setDisplayName: (value: string) => void;
  birthYear: number;
  setBirthYear: (value: number) => void;
  startYear: number;
  setStartYear: (value: number) => void;
  targetRetirementAge: number;
  setTargetRetirementAge: (value: number) => void;
  lifeExpectancyAge: number;
  setLifeExpectancyAge: (value: number) => void;
  isSaving: boolean;
  handleBack: () => void;
  handleSave: () => void;
  validate: {
    birthYear: boolean;
    startYear: boolean;
    targetRetirementAge: boolean;
    lifeExpectancyAge: boolean;
  };
  canContinue: boolean;
  minYear: number;
  maxYear: number;
  currentYear: number;
};

export function OnboardingProfileStep({
  displayName,
  setDisplayName,
  birthYear,
  setBirthYear,
  startYear,
  setStartYear,
  targetRetirementAge,
  setTargetRetirementAge,
  lifeExpectancyAge,
  setLifeExpectancyAge,
  isSaving,
  handleBack,
  handleSave,
  validate,
  canContinue,
  minYear,
  maxYear,
  currentYear
}: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <TextField
        label="Display Name"
        value={displayName}
        disabled={isSaving}
        onChange={(e) => setDisplayName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Year of Birth"
        type="number"
        value={birthYear}
        disabled={isSaving}
        onChange={(e) => setBirthYear(Number(e.target.value))}
        error={!!validate.birthYear}
        helperText={validate.birthYear ? `Enter a year between ${minYear} and ${maxYear}. You must be at least 18 years old.` : ""}
        slotProps={{
          htmlInput: {
            min: minYear,
            max: maxYear,
          },
        }}
        fullWidth
      />
      <TextField
        label="Year to Start Projecting Data"
        type="number"
        value={startYear}
        disabled={isSaving}
        onChange={(e) => setStartYear(Number(e.target.value))}
        error={!!validate.startYear}
        helperText={validate.startYear ? `Enter a year between ${minYear} and ${currentYear}` : ""}
        slotProps={{
          htmlInput: {
            min: 1900,
            max: currentYear,
          },
        }}
        fullWidth
      />
      <TextField
        label="Target Retirement Age"
        type="number"
        value={targetRetirementAge}
        disabled={isSaving}
        onChange={(e) => setTargetRetirementAge(Number(e.target.value))}
        error={!!validate.targetRetirementAge}
        helperText={validate.targetRetirementAge ? "Target Retirement Age must be between 40 and 80" : ""}
        slotProps={{
          htmlInput: {
            min: 40,
            max: 80,
          },
        }}
        fullWidth
      />
      <TextField
        label="Life Expectancy Age"
        type="number"
        value={lifeExpectancyAge}
        disabled={isSaving}
        onChange={(e) => setLifeExpectancyAge(Number(e.target.value))}
        error={!!validate.lifeExpectancyAge}
        helperText={validate.lifeExpectancyAge ? "Enter a number between 1 and 150" : ""}
        slotProps={{
          htmlInput: {
            min: 1,
            max: 150,
          },
        }}
        fullWidth
      />

      <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
        <Button variant="outlined" disabled={isSaving} onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!canContinue || Object.values(validate).some(Boolean) || isSaving}
          onClick={handleSave}
        >
          {isSaving ? <CircularProgress size={20} color="inherit" /> : "Save Profile"}
        </Button>
      </Box>
    </Box>
  );
}