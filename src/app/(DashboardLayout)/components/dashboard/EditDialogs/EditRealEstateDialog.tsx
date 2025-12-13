"use client";

import { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, CircularProgress, Typography } from "@mui/material";
import { useForm } from "@/hooks/useForm";
import { FormFields } from "../../shared/FormFields";
import { realEstateFieldConfigs } from "@/configs/realEstate";
import { RealEstatePropertyInput } from "financial-calcs";
import { RealEstateInput } from "@/lib/realEstate/schema";
import { useRealEstateProjection } from "@/hooks/useRealEstateProjection";
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";

export default function EditRealEstateDialog({
  userAttributes,
  open,
  properties,
  propertyId,
  onClose,
  onSave,
}: {
  userAttributes: Record<string, any>;
  open: boolean;
  properties: RealEstateInput[] | null;
  propertyId: string | null;
  onClose: () => void;
  onSave: (input: { data: string; label: string; address?: string; id?: string }) => Promise<void>;
}) {
  const loading = false;
  const isEditing = !!propertyId;
  const showLoading = isEditing && loading;
  
  // ----------------------------
  // Root-level fields
  // ----------------------------
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ type?: string; label?: string }>({});
  const [childValidationMessages, setChildValidationMessages] = useState<string[]>([]);

  // ----------------------------
  // Child form state
  // ----------------------------
  const initialRealEstateValues: RealEstatePropertyInput = {
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    propertyType: 'residence',
    monthlyMortgage: 2000,
    mortgageEndYear: new Date().getFullYear() + 29,
    annualPropertyTax: 5000,
    propertyTaxIncreaseRate: 2,
    annualInsurance: 1000,
    insuranceIncreaseRate: 2,
    monthlyHoaFee: 300,
    hoaFeeIncreaseRate: 2,
    monthlyRentalIncome: 0,
    rentalIncomeIncreaseRate: 2,
    yearsToProject: userAttributes?.yearsToProject ?? 40,
  };

  const {
    values: childValues,
    handleChange: handleChildChange,
    errors: childErrors,
    hasErrors: childHasErrors,
    reset
  } = useForm<RealEstatePropertyInput, { isAuthenticated: boolean }>(
    initialRealEstateValues,
    realEstateFieldConfigs
  );

  const isSaveDisabled =
    showLoading ||
    !label.trim() ||
    childHasErrors ||
    childValidationMessages.length > 0;

  const friendlyType = "Real Estate Property";

  const dialogTitle = isEditing
    ? `Edit: ${friendlyType}`
    : `Add: ${friendlyType}`;

  const childHook = (() => {
    return useRealEstateProjection(childValues as RealEstatePropertyInput);
  })();

  // ----------------------------
  // Load existing properties if editing
  // ----------------------------
  useEffect(() => {
    if (!open) return;

    if (isEditing && properties) {
      const property = properties.find((s) => s.id === propertyId);
      if (property) {
        if (property.data) {
          try {
            const parsed = JSON.parse(property.data);

            // Load label
            if (parsed.label !== undefined) {
              setLabel(parsed.label);
            }
            if (parsed.address !== undefined) {
              setAddress(parsed.address);
            }

            // Load child form values
            if (parsed.fields) {
              reset(parsed.fields);
            }
          } catch {}
        }

        setErrors({});
        return;
      }
    }

    setLabel("");
    setAddress("");
    reset(initialRealEstateValues);
    
    setErrors({});
  }, [open, propertyId, properties, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      reset(initialRealEstateValues);
    }
  }, [isEditing]);

  // ----------------------------
  // Validation
  // ----------------------------
  const validateRoot = () => {
    const newErrors: { type?: string; label?: string } = {};
    if (!label.trim()) newErrors.label = "Property Name / Label is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------
  // Save handler
  // ----------------------------
  const handleSave = async () => {
    const rootValid = validateRoot();

    if (!rootValid) return;

    let childValid = true;
    let childErrorMessages: string[] = [];

    if (childHook?.validateInput) {
      const validationErrors = childHook.validateInput();
      
      if (validationErrors.length > 0) {
        childValid = false;
        childErrorMessages = validationErrors.map(e => e.message);
      }
    }

    if (!childValid) {
      // Show all child validation messages in FormSummary
      setChildValidationMessages(childErrorMessages);
      return;
    } else {
      setChildValidationMessages([]);
    }

    let yearOverrides: Record<string, any> | undefined;

    if (isEditing) {
      const property = properties?.find((s) => s.id === propertyId);
      if (property) {
        try {
          const parsed = JSON.parse(property.data);
          yearOverrides = parsed.yearOverrides ?? undefined;
        } catch {
          yearOverrides = undefined;
        }
      }
    }

    await onSave({
      id: propertyId ?? undefined,
      label: label.trim(),
      address: address.trim(),

      data: 
        JSON.stringify({
          label: label.trim(),
          address: address.trim(),
          fields: childValues,
          ...(yearOverrides ? { yearOverrides } : {})
        })
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent dividers>
        {showLoading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          <Grid container spacing={2}>
            <Typography variant="body1">
              Real Estate Description Here
            </Typography>
            {/* Account Label */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Property Name / Label"
                fullWidth
                value={label}
                onChange={(e) => {
                  const val = e.target.value;
                  setLabel(val);
                  setErrors((prev) => ({
                    ...prev,
                    label: val.trim() ? "" : "Property Name / Label is required.",
                  }));
                }}
                required
                error={!!errors.label}
                helperText={errors.label || "Example: McLean House"}
              />
            </Grid>
            {/* Account Label */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Property Address (Optional)"
                fullWidth
                value={address}
                onChange={(e) => {
                  const val = e.target.value;
                  setAddress(val);
                }}
                required
                helperText="Example: 1234 McLean Way"
              />
            </Grid>

            {/* Child Form */}
            
            <Grid size={{ xs: 12 }}>
              <FormFields
                fields={realEstateFieldConfigs}
                values={childValues}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChildChange(event);
                  setChildValidationMessages([]);
                }}
                errors={childErrors}
                dialog
                context={{ isAuthenticated: true }}
              />
            </Grid>
            {childValidationMessages && Array.isArray(childValidationMessages) && childValidationMessages.length > 0 && (
            <Box sx={{width: '100%'}}>
              <FormSummary type="error" message={childValidationMessages} showTitle={false}/>
            </Box>
          )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={showLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isSaveDisabled}>
          {showLoading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}