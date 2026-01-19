"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  CircularProgress,
  Snackbar, 
  Alert
} from "@mui/material";

import { useUserAttributes } from "@/lib/userAttributes/hook";

export default function EditUserAttributesDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: attrs, save: saveUserAttrs } = useUserAttributes();
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState(1970);
  const [startYear, setStartYear] = useState(currentYear);
  const [targetRetirementAge, setTargetRetirementAge] = useState(62);
  const [lifeExpectancyAge, setLifeExpectancyAge] = useState(85);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load existing values into dialog fields
  useEffect(() => {
    if (!attrs) return;

    setBirthYear(attrs.birthYear!);
    setStartYear(attrs.startYear!);
    setTargetRetirementAge(attrs.targetRetirementAge!);
    setLifeExpectancyAge(attrs.lifeExpectancyAge!);
  }, [attrs]);

  const canSave = birthYear && targetRetirementAge && startYear && lifeExpectancyAge;
  const validate = {
    birthYear: birthYear && (birthYear < 1900 || birthYear > currentYear),
    targetRetirementAge: targetRetirementAge && (targetRetirementAge < 40 || targetRetirementAge > 80),
    startYear: startYear && (startYear < 1900 || startYear > currentYear),
    lifeExpectancyAge: lifeExpectancyAge && (lifeExpectancyAge <= 0 || lifeExpectancyAge > 150),
  };

  const handleSave = async () => {
    if (!birthYear) {
      setErrorMsg("Please provide your year of birth.");
      return;
    }
    else if (!targetRetirementAge) {
      setErrorMsg("Please provide your target retirement age.");
      return;
    }
    else if (!startYear) {
      setErrorMsg("Please provide the year to start projecting data");
      return;
    }
    else if (!lifeExpectancyAge) {
      setErrorMsg("Please provide your life expectancy age");
      return;
    }

    try {
      await saveUserAttrs({
        spouse: false,
        birthYear: Number(birthYear),
        startYear: Number(startYear),
        targetRetirementAge: Number(targetRetirementAge),
        lifeExpectancyAge: Number(lifeExpectancyAge),
      });

      onSaved();     
      onClose();
    } catch (err) {
      console.error("Error saving attributes:", err);
    }
  };

  const loading = false;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Financial Profile</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField
                type="number"
                fullWidth
                label="Year of Birth"
                value={birthYear}
                disabled={isSaving}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                error={!!validate.birthYear}
                helperText={validate.birthYear ? `Enter a year between 1900 and ${currentYear}` : ""}
                slotProps={{
                  htmlInput: {
                    min: 1900,
                    max: currentYear,
                  },
                }}
              />
              <TextField
                type="number"
                fullWidth
                label="Target Retirement Age"
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
              />
              <TextField
                type="number"
                fullWidth
                label="Year to Start Projecting Data"
                value={startYear}
                disabled={isSaving}
                onChange={(e) => setStartYear(Number(e.target.value))}
                error={!!validate.startYear}
                helperText={validate.startYear ? `Enter a year between 1900 and ${currentYear}` : ""}
                slotProps={{
                  htmlInput: {
                    min: 1900,
                    max: currentYear,
                  },
                }}
              />
              <TextField
                type="number"
                fullWidth
                label="Life Expectancy Age"
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
              />
            </Box>
        )}
        <Snackbar
            open={!!errorMsg}
            autoHideDuration={4000}
            onClose={() => setErrorMsg("")}
            >
            <Alert severity="error" onClose={() => setErrorMsg("")}>
                {errorMsg}
            </Alert>
        </Snackbar>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave || validate.birthYear || validate.targetRetirementAge || validate.startYear || validate.lifeExpectancyAge || isSaving}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
