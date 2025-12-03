import { FormFieldConfig } from '@/types/forms';
import { Grid, Typography } from '@mui/material';
import { startCase } from "lodash";

export function ReadOnlyFields<T, C = void>({
  fields,
  values,
  context,
}: {
  fields: FormFieldConfig<T, C>[];
  values: T;
  context?: C;
}) {
  function formatCurrency(value: any) {
    if (value == null || value === '') return '';

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  return (
    <Grid container spacing={2}>
      {fields
        .filter((field) => field.shouldDisplay?.(values, context as any) ?? true)
        .map((field) => (
        <Grid key={String(field.name)} size={{xs: 12, sm: 6, md: 3}}>
          <Typography variant="caption" color="text.secondary">
            {field.label}
          </Typography>
          <Typography variant="body1">
            {field.type === 'currency'
              ? formatCurrency(values[field.name])
              : startCase(String(values[field.name] ?? ""))
            }
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
