export type FormFieldConfig<T extends Record<string, any>> = {
  name: keyof T;
  label: string;
  type?: 'number' | 'text' | 'date';
};