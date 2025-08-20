//import { useState } from 'react';
/*
export function usePersistedForm1<T>(key: string, initialState: T) {
  const [formValues, setFormValues] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored
        ? JSON.parse(stored, (_key, value) => {
            // Detect ISO date strings
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
              return new Date(value);
            }
            return value;
          })
        : initialState;
    }
    return initialState;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(formValues));
    }
  }, [formValues]);

  return [formValues, setFormValues] as const;
}*/

import { useEffect, useState } from 'react';
import { useForm } from './useForm';
import { FormFieldConfig } from '@/types/forms';

export function usePersistedForm<T extends Record<string, any>>(
  key: string,
  initialValues: T,
  fieldConfigs: FormFieldConfig<T>[]
) {
  const [rehydratedValues] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValues;

    const stored = localStorage.getItem(key);
    if (!stored) return initialValues;

    try {
      return JSON.parse(stored, (_k, value) => {
        // revive ISO date strings
        if (
          typeof value === 'string' &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
        ) {
          return new Date(value);
        }
        return value;
      }) as T;
    } catch {
      return initialValues;
    }
  });

  const { values, setValues, errors, handleChange, hasErrors } = useForm<T>(
    rehydratedValues,
    fieldConfigs
  );

  // persist whenever `values` change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(values));
    }
  }, [key, values]);

  return { values, setValues, errors, handleChange, hasErrors };
}
