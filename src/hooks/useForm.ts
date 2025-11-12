// hooks/useForm.ts
import { useState } from 'react';
import { FormFieldConfig } from '@/types/forms';

export function useForm<T extends Record<string, any>, C = void>(
  initialValues: T,
  fieldConfigs: FormFieldConfig<T, C>[]
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === 'number') {
      parsedValue = value === '' ? '' : parseFloat(value);
    }

    setValues((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Validation
    const fieldConfig = fieldConfigs.find((f) => f.name === name);
    if (fieldConfig) {
      const { min, max, label } = fieldConfig;
      let error = '';

      if (type === 'number' && parsedValue !== '' && !isNaN(parsedValue)) {
        if (min !== undefined && parsedValue < min) {
          error = `${label} must be ≥ ${min}`;
        } else if (max !== undefined && parsedValue > max) {
          error = `${label} must be ≤ ${max}`;
        }
      } else if (value === '') {
        error = `${label} is required`;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const hasErrors = Object.values(errors).some((e) => e);

  return { values, setValues, errors, handleChange, hasErrors };
}
