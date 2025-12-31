import React from 'react';
import { FormFieldConfig } from '@/types/forms';
import { Grid, TextField, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export type BaseFormProps<T> = {
  fields: FormFieldConfig<T, any>[];
  values: T;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (name: keyof T, value: Date | null) => void;
  errors?: Partial<Record<keyof T, string>>;
  dialog?: boolean;
};

export type Props<T, C = void> =
  C extends void
    ? BaseFormProps<T>
    : BaseFormProps<T> & { context: C };

export function FormFields<T, C = void>(props: Props<T, C>) {
  const { fields, values, onChange, onDateChange, errors, dialog = false } = props;

  // Safe fallback for errors
  const safeErrors: Partial<Record<keyof T, string>> = errors ?? {};

  // Grab context only if it exists (undefined if C = void)
  const context = 'context' in props ? props.context : undefined;

  return (
    <>
      {fields
        .filter((field) => field.shouldDisplay?.(values, context as any) ?? true)
        .map(({ name, label, type = 'number', min, max, step, helperText, options }) => {
          const fieldError = safeErrors[name];

          return (
            <Grid key={String(name)} paddingY={dialog ? 1 : 0} size={dialog ? { xs: 12 } : { xs: 12, md: 3, sm: 6 }}>
              {type === 'date' ? (
                <DatePicker
                  label={label}
                  value={values[name] instanceof Date ? dayjs(values[name] as Date) : null}
                  onChange={(newValue: Dayjs | null) =>
                    onDateChange?.(name, newValue ? newValue.toDate() : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!fieldError,
                      helperText: fieldError || helperText,
                    },
                  }}
                />
              ) : (
                <TextField
                  fullWidth
                  select={type === 'select'}
                  name={String(name)}
                  label={label}
                  type={type === 'currency' ? 'number' : type !== 'select' ? type : undefined}
                  value={values[name] ?? ''}
                  onChange={onChange}
                  error={!!fieldError}
                  helperText={fieldError || helperText}
                  slotProps={
                    type !== 'select'
                      ? { input: { inputProps: {
                         min, 
                         max, 
                         step, 
                        },
                      startAdornment: type === 'currency' ? (
                        <InputAdornment position="start">$</InputAdornment>
                      ) : undefined, } }
                      : undefined
                    }
                  >
                  {type === 'select' &&
                    options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            </Grid>
          );
        })}
    </>
  );
}
