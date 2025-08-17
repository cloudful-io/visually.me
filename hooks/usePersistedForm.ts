import { useState, useEffect } from 'react';

export function usePersistedForm<T>(key: string, initialState: T) {
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
}