export type FormFieldOption = {
  value: string;
  label: string;
};

export type FormFieldGroup = {
  id: string;
  label: string;
  description?: string;
};

export type DeriveContext<T> = {
  values: T;
  prevValues: T;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
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
  derive?: (ctx: DeriveContext<T>) => void;
  group?: FormFieldGroup;
};

export type ColumnDef<T> = {
  key: keyof T;
  label: string;
  description?: string;
  currency?: boolean;
  editable?: boolean;
  hiddenOnMobile?: boolean;
  isDifference?: boolean;
  min?: number;
  max?: number;
};

export type DataKeyOption<T> = {
  key: T extends any ? keyof T : never;
  label: string;
};