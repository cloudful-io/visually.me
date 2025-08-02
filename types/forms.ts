export type FormFieldOption = {
  value: string;
  label: string;
};

export type FormFieldConfig<T extends Record<string, any>> = {
  name: keyof T;
  label: string;
  type?: 'number' | 'text' | 'date' | 'select';
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  options?: FormFieldOption[]; // Only used if type === 'select'
};
