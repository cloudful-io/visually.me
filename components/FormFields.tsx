import React from "react";
import { Grid, TextField } from "@mui/material";
import { FormFieldConfig } from '@/types/forms';

type Props<T extends Record<string, any>> = {
  fields: FormFieldConfig<T>[];
  values: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FormFields<T extends Record<string, any>>({
  fields,
  values,
  onChange,
}: Props<T>): JSX.Element {
  return (
    <>
      {fields.map(({ name, label, type = 'number' }) => (
        <Grid key={String(name)} size={{xs:12, md: 3, sm: 6}}>
          <TextField
            fullWidth
            type={type}
            name={String(name)}
            label={label}
            value={values[name]}
            onChange={onChange}
          />
        </Grid>
      ))}
    </>
  );
}
