"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useIncomeSources } from "@/lib/incomeSources/hook";

export default function EditIncomeSourceDialog({
  open,
  sourceId,
  defaultType, // NEW
  onClose,
  onSave,
}: {
  open: boolean;
  sourceId: string | null;
  defaultType?: string | null; // NEW
  onClose: () => void;
  onSave: (input: { type: string; data: string; id?: string }) => Promise<void>;
}) {
  const { data: sources, loading } = useIncomeSources({ lazy: true });
  const isEditing = !!sourceId;
  const showLoading = isEditing && loading;

  // ----------------------------
  // Local Form State
  // ----------------------------
  const [type, setType] = useState("");
  const [data, setData] = useState("");
  const [errors, setErrors] = useState<{ type?: string; data?: string }>({});

  // Load existing source if editing or defaultType if adding
  useEffect(() => {
    if (!open) return; // do nothing if dialog not open

    if (isEditing && sources) {
      const src = sources.find((s) => s.id === sourceId);
      if (src) {
        setType(src.type);
        setData(src.data);
        setErrors({});
        return;
      }
    }

    // New source → prefill with defaultType if provided
    setType(defaultType ?? "");
    setData("");
    setErrors({});
  }, [open, sourceId, sources, isEditing, defaultType]);

  // ----------------------------
  // Simple Validation
  // ----------------------------
  const validate = () => {
    const newErrors: { type?: string; data?: string } = {};
    if (!type.trim()) newErrors.type = "Type is required.";
    if (!data.trim()) newErrors.data = "Data is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------
  // Submit Handler
  // ----------------------------
  const handleSave = async () => {
    if (!validate()) return;

    try {
      await onSave({
        id: sourceId ?? undefined,
        type: type.trim(),
        data: data.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Error saving income source:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Income Source" : "Add Income Source"}</DialogTitle>

      <DialogContent dividers>
        {showLoading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Income Type"
                fullWidth
                select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                error={!!errors.type}
                helperText={errors.type}
              >
                <MenuItem value="Retirement Savings">Retirement Savings</MenuItem>
                <MenuItem value="Social Security">Social Security</MenuItem>
                <MenuItem value="FERS Pension">FERS Pension</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Income Data"
                fullWidth
                multiline
                minRows={2}
                value={data}
                onChange={(e) => setData(e.target.value)}
                error={!!errors.data}
                helperText={errors.data}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={showLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={showLoading}>
          {showLoading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
