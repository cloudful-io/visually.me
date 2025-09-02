export type FormFieldOption = {
  value: string;
  label: string;
};

export type FormFieldConfig<T> = {
  name: keyof T;
  label: string;
  type?: 'number' | 'text' | 'date' | 'select';
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  options?: FormFieldOption[]; // Only used if type === 'select'
  shouldDisplay?: (values: T) => boolean;
};
