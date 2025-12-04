"use client";

import { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, CircularProgress, Typography } from "@mui/material";
import { useForm } from "@/hooks/useForm";
import EditRetirementSavings from "./EditRetirementSavings";
import EditSocialSecurityBenefit from "./EditSocialSecurityBenefit";
import EditFERSPension from "./EditFERSPension";
import { retirementSavingsFieldConfigs } from "@/configs/retirementSavingsFields";
import { socialSecurityFieldConfigs } from "@/configs/socialSecurityBenefitsFields";
import { fersPensionFieldConfigs } from "@/configs/fersPensionFields";
import { RetirementSavingsInput, SocialSecurityBenefitInput, FersPensionInput } from "financial-calcs";
import { IncomeSourcesInput } from "@/lib/incomeSources/schema";
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
import { useRetirementSavingsProjection } from "@/hooks/useRetirementSavingsProjection";
import { useSocialSecurityBenefitProjection } from "@/hooks/useSocialSecurityBenefitProjection";
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";

interface ChildFormHook<T> {
  values: T;
  handleChange: (field: keyof T, value: any) => void;
  errors: Record<string, string>;
  hasErrors: boolean;
  validateInput?: () => { field: string; message: string }[];
}

export default function EditIncomeSourceDialog({
  userAttributes,
  open,
  sources,
  sourceId,
  defaultType,
  onClose,
  onSave,
}: {
  userAttributes: Record<string, any>;
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
  const [childValidationMessages, setChildValidationMessages] = useState<string[]>([]);

  // ----------------------------
  // Child form state
  // ----------------------------
  const initialRetirementSavingsValues: RetirementSavingsInput = {
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    initialBalance: 100000,
    initialContribution: 10000,
    estimatedYield: 6,
    estimatedWithdrawRate: 5,
    contributionIncreaseRate: 2,
    withdrawStartAge: userAttributes?.targetRetirementAge ?? 60,
    yearsToProject: userAttributes?.yearsToProject ?? 40,
  };

  const initialSocialSecurityValues: SocialSecurityBenefitInput = {
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    claimingAge: 67,
    averageIncome: 100000,
    averageCOLA: 2.5,
    yearsToProject: userAttributes?.yearsToProject ?? 40,
  };

  const initialFersPensionValues: FersPensionInput = {
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    serviceStartYear: 1990,
    serviceEndYear: 2010,
    retirementAge: userAttributes?.targetRetirementAge ?? 62,
    currentSalary: 85000,
    salaryGrowthRate: 3,
    high3Salary: 100000,
    colaPercent: 2,
    pensionMultiplier: 1.1,
    yearsToProject: userAttributes?.yearsToProject ?? 40,
    retirementType: 'regular',
  };

  const typeConfig: Record<IncomeSourceType, {
    title: string;
    description: string;
    initial: any;
    Component: any;
    fieldConfigs: any;
  }> = {
    "retirement-savings": { 
      title: "Retirement Savings",
      description: "Project how long your retirement savings will last given your initial investment balance, annual contribution, estimated yield and withdraw rates.",
      initial: initialRetirementSavingsValues, 
      Component: EditRetirementSavings, 
      fieldConfigs: retirementSavingsFieldConfigs,
    },
    "social-security": { 
      title: "Social Security Benefits",
      description: "Estimate your Social Security monthly benefits based on earnings, retirement age, and Cost-of-Living Adjustment (COLA).",
      initial: initialSocialSecurityValues, 
      Component: EditSocialSecurityBenefit, 
      fieldConfigs: socialSecurityFieldConfigs,
    },
    "fers-pension": { 
      title: "Federal Employee Retirement System (FERS) Pension",
      description: "Calculate your Federal Employee Retirement System (FERS) pension based on type of retirement, years of service, high-3 salary, and retirement age.",
      initial: initialFersPensionValues, 
      Component: EditFERSPension, 
      fieldConfigs: fersPensionFieldConfigs },
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

  const isSaveDisabled =
    showLoading ||
    !type.trim() ||
    !label.trim() ||
    childHasErrors ||
    childValidationMessages.length > 0;

  const friendlyType = typeConfig[type].title ?? "Income / Investment";

  const dialogTitle = isEditing
    ? `Edit: ${friendlyType}`
    : `Add: ${friendlyType}`;

  const childHook = (() => {
    switch (type) {
      case "fers-pension":
        return useFersPensionProjection(childValues as FersPensionInput);
      case "retirement-savings":
        return useRetirementSavingsProjection(childValues as RetirementSavingsInput);
      case "social-security":
        return useSocialSecurityBenefitProjection(childValues as SocialSecurityBenefitInput);
      default:
        return null;
    }
  })();
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
    else if (defaultType === "fers-pension") reset(initialFersPensionValues);
    setErrors({});
  }, [open, sourceId, sources, isEditing, defaultType]);

  useEffect(() => {
    if (!isEditing) {
      reset(currentType.initial);
    }
  }, [type, isEditing]);

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
      const src = sources?.find((s) => s.id === sourceId);
      if (src) {
        try {
          const parsed = JSON.parse(src.data);
          console.log(parsed)
          yearOverrides = parsed.yearOverrides ?? undefined;
        } catch {
          yearOverrides = undefined;
        }
      }
    }

    await onSave({
      id: sourceId ?? undefined,
      type,
      label: label.trim(),

      data: 
        JSON.stringify({
          label: label.trim(),
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
              {typeConfig[type].description}
            </Typography>
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
                helperText={errors.label || "Example: Bank of America Roth IRA, or Navy Pension"}
              />
            </Grid>

            {/* Child Form */}
            
            <Grid size={{ xs: 12 }}>
              <ChildComponent
                values={childValues}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChildChange(event);
                  setChildValidationMessages([]);
                }}
                errors={childErrors}
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