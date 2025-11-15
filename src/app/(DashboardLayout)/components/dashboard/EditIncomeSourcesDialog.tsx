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
} from "@mui/material";
import { useIncomeSources } from "@/lib/incomeSources/hook";

export default function EditIncomeSourceDialog({
  open,
  sourceId,
  onClose,
  onSave,
}: {
  open: boolean;
  sourceId: string | null;
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

  // Load existing source if editing
  useEffect(() => {
    if (!sourceId || !sources) {
      setType("");
      setData("");
      setErrors({});
      return;
    }

    const src = sources.find((s) => s.id === sourceId);
    if (src) {
      setType(src.type);
      setData(src.data);
      setErrors({});
    }
  }, [sourceId, sources]);

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
      <DialogTitle>{sourceId ? "Edit Income Source" : "Add Income Source"}</DialogTitle>

      <DialogContent dividers>
        {showLoading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          <Grid container spacing={2} mt={1}>
            <Grid size={{xs:12}}>
              <TextField
                label="Income Type"
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value)}
                error={!!errors.type}
                helperText={errors.type}
              />
            </Grid>

            <Grid size={{xs:12}}>
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
