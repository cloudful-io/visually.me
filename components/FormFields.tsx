import React from 'react';
import { FormFieldConfig } from '@/types/forms';
import { Grid, TextField } from '@mui/material';

type GenericFormValues = Record<string, number | string>;

type Props<T extends GenericFormValues> = {
  fields: FormFieldConfig<T>[];
  values: T;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FormFields<T extends GenericFormValues>({
  fields,
  values,
  onChange,
}: Props<T>) {
  return (
    <>
      {fields.map(({ name, label, type = 'number', min, max, step, helperText }) => (
        <Grid key={String(name)} size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            name={String(name)}
            label={label}
            type={type}
            value={values[name]}
            onChange={onChange}
            slotProps={{ input: { inputProps: { min, max, step } } }}
            helperText={helperText}
          />
        </Grid>
      ))}
    </>
  );
}
