import React from 'react';
import { FormFieldConfig } from '@/types/forms';
import { Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

type GenericFormValues = Record<string, number | string | Date | undefined>;

type Props<T, C = void> = C extends void
  ? {
      fields: FormFieldConfig<T, C>[];
      values: T;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onDateChange?: (name: keyof T, value: Date | null) => void;
      errors?: Partial<Record<keyof T, string>>;
    }
  : {
      fields: FormFieldConfig<T, C>[];
      values: T;
      context: C; // required only when C is not void
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      onDateChange?: (name: keyof T, value: Date | null) => void;
      errors?: Partial<Record<keyof T, string>>;
    };


export function FormFields<T, C = void>(props: Props<T, C>) {
  const { fields, values, onChange, onDateChange, errors } = props;

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
            <Grid key={String(name)} size={{ xs: 12, sm: 6, md: 3 }}>
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
                  type={type !== 'select' ? type : undefined}
                  value={values[name] ?? ''}
                  onChange={onChange}
                  error={!!fieldError}
                  helperText={fieldError || helperText}
                  slotProps={
                    type !== 'select'
                      ? { input: { inputProps: { min, max, step } } }
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
