import { FormFieldConfig } from '@/types/forms';
import { Grid, Typography } from '@mui/material';
import { startCase } from "lodash";
import { currencyFormatter } from '@/lib/formatters/currency';

export function ReadOnlyFields<T, C = void>({
  fields,
  values,
  context,
}: {
  fields: FormFieldConfig<T, C>[];
  values: T;
  context?: C;
}) {

  if (!values) return null;
  return (
    <Grid container spacing={2}>
      {fields
        .filter((field) => field.shouldDisplay?.(values, context as any) ?? true)
        .map((field) => {
          const rawValue = values[field.name];

          let displayValue: string | number = rawValue as any;

          if (field.type === "currency") {
            displayValue = currencyFormatter(rawValue as number);
          }
          else if (field.type === "number") {
            displayValue = String(rawValue);
          }

          else if (field.type === "date") {
            const date = new Date(String(rawValue));
            displayValue = date.toLocaleDateString("en-US"); 
          }

          else if (field.type === "select" && field.options) {
            const match = field.options.find(opt => opt.value === rawValue);
            displayValue = match ? match.label : String(rawValue ?? "");
          }
          
          else {
            displayValue = startCase(String(rawValue ?? ""));
          }

          return (
            <Grid key={String(field.name)} size={{xs: 12, sm: 6, md: 3}}>
              <Typography variant="caption" color="text.secondary">
                {field.label}
              </Typography>
              <Typography variant="body1">
                {displayValue}
              </Typography>
            </Grid>
          );
        })}
    </Grid>
  );
}
