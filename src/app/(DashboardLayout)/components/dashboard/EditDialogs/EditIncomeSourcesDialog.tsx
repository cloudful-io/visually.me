"use client";

import { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, CircularProgress, Typography } from "@mui/material";
import { useForm } from "@/hooks/useForm";
import EditRetirementSavings from "./EditRetirementSavings";
import EditSocialSecurityBenefit from "./EditSocialSecurityBenefit";
import EditFERSPension from "./EditFERSPension";
import EditMilitaryPension from "./EditMilitaryPension";
import { retirementSavingsConfig, retirementSavingsFieldConfigs } from "@/configs/retirementSavings";
import { socialSecurityConfig, socialSecurityFieldConfigs } from "@/configs/socialSecurityBenefits";
import { fersPensionConfig, fersPensionFieldConfigs } from "@/configs/fersPension";
import { militaryPensionConfig, militaryPensionFieldConfigs } from "@/configs/militaryPension";
import { RetirementSavingsInput, SocialSecurityBenefitInput, FersPensionInput, MilitaryPensionInput } from "financial-calcs";
import { AssetInput } from "@/lib/assets/schema";
import { useFersPensionProjection } from '@/hooks/useFersPensionProjection';
import { useMilitaryPensionProjection } from '@/hooks/useMilitaryPensionProjection';
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
  sources: AssetInput[] | null;
  sourceId: string | null;
  defaultType?: string | null;
  onClose: () => void;
  onSave: (input: AssetInput & { id?: string }) => Promise<void>;
}) {
  const loading = false;
  const isEditing = !!sourceId;
  const showLoading = isEditing && loading;
  
  // ----------------------------
  // Root-level fields
  // ----------------------------
  type IncomeSourceType = "retirement-savings" | "social-security" | "fers-pension" | "military-pension";
  const [asset_type, setAsset_Type] = useState<IncomeSourceType>("retirement-savings");
  const [label, setLabel] = useState("");
  const [errors, setErrors] = useState<{ type?: string; label?: string }>({});
  const [childValidationMessages, setChildValidationMessages] = useState<string[]>([]);

  // ----------------------------
  // Child form state
  // ----------------------------
  const initialRetirementSavingsValues: RetirementSavingsInput = {
    ...retirementSavingsConfig.initialFormValues!,
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    withdrawStartAge: userAttributes?.targetRetirementAge ?? 60,
    lifeExpectancyAge: userAttributes?.lifeExpectancyAge ?? 85,
  };

  const initialSocialSecurityValues: SocialSecurityBenefitInput = {
    ...socialSecurityConfig.initialFormValues!,
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    lifeExpectancyAge: userAttributes?.lifeExpectancyAge ?? 85,
  };

  const initialFersPensionValues: FersPensionInput = {
    ...fersPensionConfig.initialFormValues!,
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    retirementAge: userAttributes?.targetRetirementAge ?? 62,
    lifeExpectancyAge: userAttributes?.lifeExpectancyAge ?? 85,
  };

  const initialMilitaryPensionValues: MilitaryPensionInput = {
    ...militaryPensionConfig.initialFormValues!,
    startYear: userAttributes?.startYear ?? new Date().getFullYear(),
    birthYear: userAttributes?.birthYear ?? 1970,
    lifeExpectancyAge: userAttributes?.lifeExpectancyAge ?? 85,
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
      description: retirementSavingsConfig.calculatorDescription,
      initial: initialRetirementSavingsValues, 
      Component: EditRetirementSavings, 
      fieldConfigs: retirementSavingsFieldConfigs,
    },
    "social-security": { 
      title: "Social Security Benefits",
      description: socialSecurityConfig.calculatorDescription,
      initial: initialSocialSecurityValues, 
      Component: EditSocialSecurityBenefit, 
      fieldConfigs: socialSecurityFieldConfigs,
    },
    "fers-pension": { 
      title: "Federal Employee Retirement System (FERS) Pension",
      description: fersPensionConfig.calculatorDescription,
      initial: initialFersPensionValues, 
      Component: EditFERSPension, 
      fieldConfigs: fersPensionFieldConfigs 
    },
    "military-pension": { 
      title: "Uniformed Service Pension",
      description: militaryPensionConfig.calculatorDescription,
      initial: initialMilitaryPensionValues, 
      Component: EditMilitaryPension, 
      fieldConfigs: militaryPensionFieldConfigs 
    },
  };

  const currentType = typeConfig[asset_type] ?? typeConfig["retirement-savings"];
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
    !asset_type.trim() ||
    !label.trim() ||
    childHasErrors ||
    childValidationMessages.length > 0;

  const friendlyType = typeConfig[asset_type].title ?? "Income / Investment";

  const dialogTitle = isEditing
    ? `Edit: ${friendlyType}`
    : `Add: ${friendlyType}`;

  const childHook = (() => {
    switch (asset_type) {
      case "fers-pension":
        return useFersPensionProjection(childValues as FersPensionInput);
      case "military-pension":
        return useMilitaryPensionProjection(childValues as MilitaryPensionInput);
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
        if (src.asset_type === "retirement-savings" ||
          src.asset_type === "social-security" ||
          src.asset_type === "fers-pension" ||
          src.asset_type === "military-pension") {
        setAsset_Type(src.asset_type);
        } else {
          setAsset_Type("retirement-savings");
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
      defaultType === "fers-pension" ||
      defaultType === "military-pension"
    ) {
      setAsset_Type(defaultType);
    } else {
      setAsset_Type("retirement-savings");  // fallback
    }
    setLabel("");
    if (defaultType === "retirement-savings") reset(initialRetirementSavingsValues);
    else if (defaultType === "social-security") reset(initialSocialSecurityValues);
    else if (defaultType === "fers-pension") reset(initialFersPensionValues);
    else if (defaultType === "military-pension") reset(initialMilitaryPensionValues);
    setErrors({});
  }, [open, sourceId, sources, isEditing, defaultType]);

  useEffect(() => {
    if (!isEditing) {
      reset(currentType.initial);
    }
  }, [asset_type, isEditing]);

  // ----------------------------
  // Validation
  // ----------------------------
  const validateRoot = () => {
    const newErrors: { type?: string; label?: string } = {};
    if (!asset_type.trim()) newErrors.type = "Type is required.";
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
          yearOverrides = parsed.yearOverrides ?? undefined;
        } catch {
          yearOverrides = undefined;
        }
      }
    }

    await onSave({
      id: sourceId ?? undefined,
      asset_type,
      //label: label.trim(),

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
              {typeConfig[asset_type].description}
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