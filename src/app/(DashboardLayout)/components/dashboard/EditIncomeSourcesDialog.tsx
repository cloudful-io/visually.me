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
import { useForm } from "@/hooks/useForm";
import EditRetirementSavings from "./EditRetirementSavings";
import EditSocialSecurityBenefit from "./EditSocialSecurityBenefit";
import EditFERSPension from "./EditFERSPension";
import { retirementSavingsFieldConfigs } from "@/configs/retirementSavingsFields";
import { socialSecurityFieldConfigs } from "@/configs/socialSecurityBenefitsFields";
import { fersPensionFieldConfigs } from "@/configs/fersPensionFields";
import { RetirementSavingsInput, SocialSecurityBenefitInput, FersPensionInput } from "financial-calcs";
import { IncomeSourcesInput } from "@/lib/incomeSources/schema";

export default function EditIncomeSourceDialog({
  open,
  sources,
  sourceId,
  defaultType,
  onClose,
  onSave,
}: {
  open: boolean;
  sources: IncomeSourcesInput[] | null;
  sourceId: string | null;
  defaultType?: string | null;
  onClose: () => void;
  onSave: (input: { type: string; data: string; label: string; id?: string }) => Promise<void>;
}) {
  const loading = false;
  const isEditing = !!sourceId;
  const showLoading = isEditing && loading;
  
  // ----------------------------
  // Root-level fields
  // ----------------------------
  type IncomeSourceType = "retirement-savings" | "social-security" | "fers-pension";
  const [type, setType] = useState<IncomeSourceType>("retirement-savings");
  const [label, setLabel] = useState("");
  const [errors, setErrors] = useState<{ type?: string; label?: string }>({});

  // ----------------------------
  // Child form state (for retirement-savings for now)
  // ----------------------------
  const initialRetirementSavingsValues: RetirementSavingsInput = {
    startYear: new Date().getFullYear(),
    birthYear: 1970,
    initialBalance: 100000,
    initialContribution: 10000,
    estimatedYield: 6,
    estimatedWithdrawRate: 5,
    contributionIncreaseRate: 2,
    withdrawStartAge: 60,
    yearsToProject: 40,
  };

  const initialSocialSecurityValues: SocialSecurityBenefitInput = {
    startYear: new Date().getFullYear(),
    birthYear: 1970,
    claimingAge: 67,
    averageIncome: 100000,
    averageCOLA: 2.5,
    yearsToProject: 45,
  };

  const initialFersPensionValues: FersPensionInput = {
    startYear: new Date().getFullYear(),
    birthYear: 1970,
    serviceStartYear: 1990,
    serviceEndYear: 2010,
    retirementAge: 62,
    currentSalary: 85000,
    salaryGrowthRate: 3,
    high3Salary: 100000,
    colaPercent: 2,
    pensionMultiplier: 1.1,
    yearsToProject: 40,
    retirementType: 'regular',
  };

  const typeConfig: Record<IncomeSourceType, {
    initial: any;
    Component: any;
    fieldConfigs: any;
  }> = {
    "retirement-savings": { initial: initialRetirementSavingsValues, Component: EditRetirementSavings, fieldConfigs: retirementSavingsFieldConfigs },
    "social-security": { initial: initialSocialSecurityValues, Component: EditSocialSecurityBenefit, fieldConfigs: socialSecurityFieldConfigs },
    "fers-pension": { initial: initialFersPensionValues, Component: EditFERSPension, fieldConfigs: fersPensionFieldConfigs },
  };

  const currentType = typeConfig[type] ?? typeConfig["retirement-savings"];
  const ChildComponent = currentType.Component;

  const {
    values: childValues,
    handleChange: handleChildChange,
    errors: childErrors,
    hasErrors: childHasErrors,
    reset
  } = useForm<typeof currentType.initial, { isAuthenticated: boolean }>(
    currentType.initial,
    currentType.fieldConfigs
  );

  const isSaveDisabled = showLoading || !type.trim() || !label.trim() || (type === "retirement-savings" && childHasErrors);

  const typeDisplayName: Record<string, string> = {
    "retirement-savings": "Retirement Savings",
    "fers-pension": "FERS Pension",
    "social-security": "Social Security Benefits",
  };

  const friendlyType = typeDisplayName[type] ?? "Income Source";

  const dialogTitle = isEditing
    ? `Edit: ${friendlyType}`
    : `Add: ${friendlyType}`;

  // ----------------------------
  // Load existing source if editing or defaultType if adding
  // ----------------------------
  useEffect(() => {
    if (!open) return;

    if (isEditing && sources) {
      const src = sources.find((s) => s.id === sourceId);
      if (src) {
        if (src.type === "retirement-savings" ||
          src.type === "social-security" ||
          src.type === "fers-pension") {
        setType(src.type);
      } else {
        // fallback if somehow an unknown type got saved
        setType("retirement-savings");
      }

        if (src.data) {
          try {
            const parsed = JSON.parse(src.data);

            // Load label
            if (parsed.label !== undefined) {
                setLabel(parsed.label);
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

    // New source
    if (defaultType === "retirement-savings" ||
      defaultType === "social-security" ||
      defaultType === "fers-pension"
    ) {
      setType(defaultType);
    } else {
      setType("retirement-savings");  // fallback
    }
    setLabel("");
    if (defaultType === "retirement-savings") reset(initialRetirementSavingsValues);
    else if (defaultType === "social-security") reset(initialSocialSecurityValues);
    setErrors({});
  }, [open, sourceId, sources, isEditing, defaultType]);

  useEffect(() => {
    reset(currentType.initial);
  }, [type]);

  // ----------------------------
  // Validation
  // ----------------------------
  const validateRoot = () => {
    const newErrors: { type?: string; label?: string } = {};
    if (!type.trim()) newErrors.type = "Type is required.";
    if (!label.trim()) newErrors.label = "Account Name / Label is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------
  // Save handler
  // ----------------------------
  const handleSave = async () => {
    const rootValid = validateRoot();
    //const childValid = type === "retirement-savings" ? /*childValidate()*/ true : true;

    if (!rootValid /*|| !childValid*/) return;

    await onSave({
      id: sourceId ?? undefined,
      type,
      label: label.trim(),

      data: 
        JSON.stringify({
          label: label.trim(),
          fields: childValues})
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
          <Grid container spacing={2} mt={1}>

            {/* Account Label */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Account Name / Label"
                fullWidth
                value={label}
                onChange={(e) => {
                  const val = e.target.value;
                  setLabel(val);
                  setErrors((prev) => ({
                    ...prev,
                    label: val.trim() ? "" : "Account Name / Label is required.",
                  }));
                }}
                required
                error={!!errors.label}
                helperText={errors.label || "Example: Bank of America Roth IRA"}
              />
            </Grid>

            {/* Child Form */}
            
              <Grid size={{ xs: 12 }}>
                <ChildComponent
                  values={childValues}
                  onChange={handleChildChange}
                  errors={childErrors}
                />
              </Grid>
            
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
