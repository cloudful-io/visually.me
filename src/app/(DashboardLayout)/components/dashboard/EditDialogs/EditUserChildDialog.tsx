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
  Alert,
  InputAdornment,
} from "@mui/material";

import { useUserChildren } from "@/lib/userChildren/hook";
import { UserChildInput, UserChildRecord } from "@/lib/userChildren/schema";

export default function EditUserChildDialog({
  open,
  onClose,
  onSaved,
  child,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  child?: UserChildRecord | null;
}) {
  const { save: saveUserChildren } = useUserChildren({ lazy: true });
  const currentYear = new Date().getFullYear();

  const defaultBirthYear = currentYear - 1;
  const defaultCollegeStartYear = defaultBirthYear + 18;
  const defaultCollegeEndYear = defaultBirthYear + 21;
  const defaultEstimatedFirstYearTuition = 50000;
  const defaultTuitionInflationRate = 3;

  const [label, setLabel] = useState("");
  const [birthYear, setBirthYear] = useState<number | "">(defaultBirthYear);
  const [collegeStartYear, setCollegeStartYear] = useState<number | "">(defaultCollegeStartYear);
  const [collegeEndYear, setCollegeEndYear] = useState<number | "">(defaultCollegeEndYear);
  const [estimatedFirstYearTuition, setEstimatedFirstYearTuition] = useState<number | "">(defaultEstimatedFirstYearTuition);
  const [tuitionInflationRate, setTuitionInflationRate] = useState<number | "">(defaultTuitionInflationRate);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [labelTouched, setLabelTouched] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (child) {
      setLabel(child.label ?? "");
      setBirthYear(child.birthYear ?? "");
      setCollegeStartYear(child.collegeStartYear ?? "");
      setCollegeEndYear(child.collegeEndYear ?? "");
      setEstimatedFirstYearTuition(child.estimatedFirstYearTuition ?? "");
      setTuitionInflationRate(child.tuitionInflationRate ?? "");
    } else {
      setLabel("");
      setBirthYear(defaultBirthYear);
      setCollegeStartYear(defaultCollegeStartYear);
      setCollegeEndYear(defaultCollegeEndYear);
      setEstimatedFirstYearTuition(defaultEstimatedFirstYearTuition);
      setTuitionInflationRate(defaultTuitionInflationRate);
    }

    setErrorMsg("");
    setLabelTouched(false);
  }, [child, open, defaultBirthYear, defaultCollegeEndYear, defaultCollegeStartYear, defaultEstimatedFirstYearTuition, defaultTuitionInflationRate]);

  const hasBirthYear = birthYear !== "";
  const hasCollegeStartYear = collegeStartYear !== "";
  const hasCollegeEndYear = collegeEndYear !== "";
  const hasEstimatedTuition = estimatedFirstYearTuition !== "";
  const hasTuitionInflationRate = tuitionInflationRate !== "";

  const validate = {
    label: !label.trim(),
    birthYear:
      hasBirthYear &&
      (birthYear < 1900 || birthYear > currentYear),
    collegeStartYear:
      hasCollegeStartYear &&
      (collegeStartYear < 1900 || collegeStartYear > currentYear + 20),
    collegeEndYear:
      hasCollegeEndYear &&
      (collegeEndYear < 1900 || collegeEndYear > currentYear + 20),
    collegeRange:
      hasCollegeStartYear &&
      hasCollegeEndYear &&
      collegeEndYear < collegeStartYear,
    estimatedFirstYearTuition:
      hasEstimatedTuition &&
      estimatedFirstYearTuition < 0,
    tuitionInflationRate:
      hasTuitionInflationRate &&
      (tuitionInflationRate < 0 || tuitionInflationRate > 100),
  };

  const canSave =
    !validate.label &&
    !validate.birthYear &&
    !validate.collegeStartYear &&
    !validate.collegeEndYear &&
    !validate.collegeRange &&
    !validate.estimatedFirstYearTuition &&
    !validate.tuitionInflationRate &&
    label.trim().length > 0 &&
    hasBirthYear &&
    hasCollegeStartYear &&
    hasCollegeEndYear &&
    hasEstimatedTuition &&
    hasTuitionInflationRate;

  useEffect(() => {
    if (child) return;
    if (birthYear === "") return;

    setCollegeStartYear(birthYear + 18);
    setCollegeEndYear(birthYear + 21);
  }, [birthYear, child]);

  const handleSave = async () => {
    if (!label.trim()) {
      setLabelTouched(true);
      setErrorMsg("Please provide a name for the child.");
      return;
    }
    if (!hasBirthYear) {
      setErrorMsg("Please provide the child's birth year.");
      return;
    }
    if (!hasCollegeStartYear || !hasCollegeEndYear) {
      setErrorMsg("Please provide the child's college start and end years.");
      return;
    }
    if (validate.birthYear || validate.collegeStartYear || validate.collegeEndYear || validate.collegeRange) {
      setErrorMsg("Please fix the year fields before saving.");
      return;
    }
    if (!hasEstimatedTuition) {
      setErrorMsg("Please provide the estimated first year tuition.");
      return;
    }
    if (!hasTuitionInflationRate) {
      setErrorMsg("Please provide the tuition inflation rate.");
      return;
    }
    if (validate.estimatedFirstYearTuition || validate.tuitionInflationRate) {
      setErrorMsg("Please fix the tuition fields before saving.");
      return;
    }

    try {
      setIsSaving(true);

      const payload: UserChildInput = {
        id: child?.id,
        label: label.trim(),
        birthYear: Number(birthYear),
        collegeStartYear: Number(collegeStartYear),
        collegeEndYear: Number(collegeEndYear),
        estimatedFirstYearTuition: Number(estimatedFirstYearTuition),
        tuitionInflationRate: Number(tuitionInflationRate),
      };

      await saveUserChildren([payload]);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save child:", err);
      setErrorMsg("Failed to save child. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{child ? "Edit Child" : "Add Child"}</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField
            fullWidth
            label="Child Name"
            value={label}
            disabled={isSaving}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => setLabelTouched(true)}
            error={labelTouched && validate.label}
            helperText={labelTouched && validate.label ? "Please enter the child's name." : ""}
          />
          <TextField
            type="number"
            fullWidth
            label="Birth Year"
            value={birthYear}
            disabled={isSaving}
            onChange={(e) => setBirthYear(e.target.value === "" ? "" : Number(e.target.value))}
            error={!!validate.birthYear}
            helperText={
              validate.birthYear
                ? `Enter a year between 1900 and ${currentYear}`
                : ""
            }
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
            label="First Year of College"
            value={collegeStartYear}
            disabled={isSaving}
            onChange={(e) => setCollegeStartYear(e.target.value === "" ? "" : Number(e.target.value))}
            error={!!validate.collegeStartYear || !!validate.collegeRange}
            helperText={
              validate.collegeRange
                ? "End year must be the same or later than first year."
                : validate.collegeStartYear
                ? `Enter a year between 1900 and ${currentYear + 20}`
                : ""
            }
            slotProps={{
              htmlInput: {
                min: 1900,
                max: currentYear + 20,
              },
            }}
          />
          <TextField
            type="number"
            fullWidth
            label="Last Year of College"
            value={collegeEndYear}
            disabled={isSaving}
            onChange={(e) => setCollegeEndYear(e.target.value === "" ? "" : Number(e.target.value))}
            error={!!validate.collegeEndYear || !!validate.collegeRange}
            helperText={
              validate.collegeRange
                ? "End year must be the same or later than first year."
                : validate.collegeEndYear
                ? `Enter a year between 1900 and ${currentYear + 20}`
                : ""
            }
            slotProps={{
              htmlInput: {
                min: 1900,
                max: currentYear + 20,
              },
            }}
          />
          <TextField
            type="number"
            fullWidth
            label="Estimated First Year Tuition"
            value={estimatedFirstYearTuition}
            disabled={isSaving}
            onChange={(e) => setEstimatedFirstYearTuition(e.target.value === "" ? "" : Number(e.target.value))}
            error={!!validate.estimatedFirstYearTuition}
            helperText={validate.estimatedFirstYearTuition ? "Enter a non-negative tuition amount." : ""}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 100,
              },
            }}
          />
          <TextField
            type="number"
            fullWidth
            label="Tuition Inflation Rate (%)"
            value={tuitionInflationRate}
            disabled={isSaving}
            onChange={(e) => setTuitionInflationRate(e.target.value === "" ? "" : Number(e.target.value))}
            error={!!validate.tuitionInflationRate}
            helperText={validate.tuitionInflationRate ? "Enter a number between 0 and 100." : ""}
            slotProps={{
              htmlInput: {
                min: 0,
                max: 100,
                step: 0.1,
              },
            }}
          />
        </Box>

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
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave || isSaving}
        >
          {isSaving ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
