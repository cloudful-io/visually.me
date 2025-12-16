import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Box,
} from '@mui/material';
import { FormFieldConfig } from '@/types/forms';
import { FormFields, Props, BaseFormProps } from './FormFields';

/*type FormWizardProps<T, C = void> = C extends void
  ? {
      fields: FormFieldConfig<T, C>[];
      values: T;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onDateChange?: (name: keyof T, value: Date | null) => void;
      errors?: Partial<Record<keyof T, string>>;
      dialog?: boolean;
    }
  : {
      fields: FormFieldConfig<T, C>[];
      values: T;
      context: C; // required only when C is not void
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onDateChange?: (name: keyof T, value: Date | null) => void;
      errors?: Partial<Record<keyof T, string>>;
      dialog?: boolean;
    };*/

export type FormWizardProps<T, C = void> =
  BaseFormProps<T> & (C extends void ? {} : { context: C });


export function FormWizard<T, C = void>(props: FormWizardProps<T, C>) {
  const {
    fields,
    values,
    onChange,
    onDateChange,
    errors,
    dialog = false,
  } = props;

  const context = 'context' in props ? props.context : undefined;

  const [activeStep, setActiveStep] = React.useState(0);

  // Group fields by group.id
  const groups = React.useMemo(() => {
    const map = new Map<string, { meta: any; fields: typeof fields }>();

    fields.forEach((field) => {
      const group = field.group ?? { id: 'default', label: 'Details' };
      if (!map.has(group.id)) {
        map.set(group.id, { meta: group, fields: [] });
      }
      map.get(group.id)!.fields.push(field);
    });

    return Array.from(map.values());
  }, [fields]);

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {groups.map((group, index) => (
        <Step key={group.meta.id}>
          <StepLabel>{group.meta.label}</StepLabel>

          <StepContent>
            <FormFields
              fields={group.fields}
              values={values}
              context={context as any}
              onChange={onChange}
              onDateChange={onDateChange}
              dialog
            />

            <Box mt={2}>
              <Button
                variant='contained'
                disabled={index === 0}
                onClick={() => setActiveStep((s) => s - 1)}
                sx={{ mr: 1 }}
              >
                Back
              </Button>

              {index < groups.length - 1 && (
                <Button variant="contained" onClick={() => setActiveStep(s => s + 1)}>
                    Next
                </Button>
              )}
            </Box>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
