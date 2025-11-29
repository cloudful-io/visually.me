export type FormFieldOption = {
  value: string;
  label: string;
};

export type FormFieldConfig<T, C = void> = {
  name: keyof T;
  label: string;
  type?: 'number' | 'text' | 'date' | 'select' | 'currency';
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  options?: FormFieldOption[]; // Only used if type === 'select'
  shouldDisplay?: (values: T, context: C extends void ? undefined : C) => boolean;
};
