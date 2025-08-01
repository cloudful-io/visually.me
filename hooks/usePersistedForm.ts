import { useState, useEffect } from 'react';

export function usePersistedForm<T>(key: string, initialState: T) {
  const [formValues, setFormValues] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialState;
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