"use client";
import { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, CircularProgress, Typography } from "@mui/material";
import { useForm } from "@/hooks/useForm";
import { AssetInput } from "@/lib/assets/schema";
import { FormSummary } from "@/app/(DashboardLayout)/components/shared/FormSummary";
import { calculatorRegistry } from "@/lib/calculators/registry";
import { assetRegistry } from "@/lib/assets/registry";
import { FormFields } from "../../shared/FormFields";
import { incomeAssetTypes } from "@/lib/assets/registry";
import { IconUser, IconFriends } from "@tabler/icons-react";

export default function EditIncomeSourceDialog({
  userAttributes,
  hasSpouse,
  open,
  sources,
  sourceId,
  defaultType,
  onClose,
  onSave,
}: {
  userAttributes: Record<string, any>;
  hasSpouse: boolean;
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
  const [asset_type, setAsset_Type] = useState<AssetInput["asset_type"]>("retirement-savings");
  const [isSpouse, setIsSpouse] = useState<boolean>(false);
  const [label, setLabel] = useState("");
  const [errors, setErrors] = useState<{ type?: string; label?: string }>({});
  const [childValidationMessages, setChildValidationMessages] = useState<string[]>([]);

  const assetDef = assetRegistry[asset_type];
  const calculator = assetDef.calculatorId ? calculatorRegistry[assetDef.calculatorId] : null;
  if (!calculator) throw new Error(`Calculator not found for ${asset_type}`);

  const buildInitialValues = () => {
    const base = {
      ...calculator.config.initialFormValues,
      startYear: userAttributes?.startYear ?? new Date().getFullYear(),
      birthYear: userAttributes?.birthYear ?? 1970,
      lifeExpectancyAge: userAttributes?.lifeExpectancyAge ?? 85,
    };

    if ("retirementAge" in base) base.retirementAge = userAttributes?.targetRetirementAge;
    if ("withdrawStartAge" in base) base.withdrawStartAge = userAttributes?.targetRetirementAge;

    return base;
  };

  const {
    values: childValues,
    handleChange: handleChildChange,
    errors: childErrors,
    hasErrors: childHasErrors,
    reset
  } = useForm(
    buildInitialValues(),
    calculator.fieldConfigs
  );

  const isSaveDisabled =
    showLoading ||
    !asset_type.trim() ||
    !label.trim() ||
    childHasErrors ||
    childValidationMessages.length > 0;

  // ----------------------------
  // Load existing source if editing or defaultType if adding
  // ----------------------------
  useEffect(() => {
    if (!open) return;

    if (isEditing && sources) {
      const src = sources.find((s) => s.id === sourceId);
      if (src) {
        setAsset_Type(
          incomeAssetTypes.includes(src.asset_type)
            ? (src.asset_type as AssetInput["asset_type"])
            : "retirement-savings"
        );

        setIsSpouse(hasSpouse ? !!src.spouse : false);

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

    setAsset_Type(
      incomeAssetTypes.includes(defaultType!)
        ? (defaultType as AssetInput["asset_type"])
        : "retirement-savings"
    );
    setIsSpouse(false);
    setLabel("");
    reset(buildInitialValues());
    setErrors({});
  }, [open, sourceId, sources, isEditing, defaultType]);

  useEffect(() => {
    if (!isEditing) {
      reset(buildInitialValues());
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

    if (assetDef.validate) {
      const validationErrors = assetDef.validate(childValues);
      
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
      spouse: hasSpouse ? isSpouse : false,
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
      <DialogTitle>{assetDef.title}</DialogTitle>

      <DialogContent dividers>
        {showLoading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          <Grid container spacing={2}>
            <Typography variant="body1">
              {calculator.config.calculatorDescription}
            </Typography>
            {/* Owner Toggle */}
            {hasSpouse && (
              <Grid size={{ xs: 12 }}>
                <ToggleButtonGroup
                  value={isSpouse ? "spouse" : "primary"}
                  exclusive
                  onChange={(_, value) => {
                    if (!value) return;
                    setIsSpouse(value === "spouse");
                  }}
                  fullWidth
                  size="medium"
                  sx={{
                    "& .MuiToggleButton-root.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  }}
                >
                  <ToggleButton value="primary">
                    <IconUser size={18} style={{ marginRight: 6 }} />
                    You
                  </ToggleButton>
                  <ToggleButton value="spouse">
                    <IconFriends size={18} style={{ marginRight: 6 }} />
                    Spouse
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            )}
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
              <FormFields
                fields={calculator.fieldConfigs}
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