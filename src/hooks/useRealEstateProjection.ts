import { useState } from 'react';
import {
  calculateRealEstatePropertyProjection,
  validateRealEstatePropertyInput,
  RealEstatePropertyValidationError,
  RealEstatePropertyInput,
  RealEstatePropertyProjectionRow,
  calculateRealEstatePropertyProjectionWithOverrides,
} from 'financial-calcs';

export function useRealEstateProjection(formValues: RealEstatePropertyInput) {
  const [rows, setRows] = useState<RealEstatePropertyProjectionRow[]>([]);
  const [error, setError] = useState<string[] | null>(null);

  const generateTable = () => {
    try {
      const data = calculateRealEstatePropertyProjection(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: RealEstatePropertyValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const generateTableWithOverrides = () => {
    try {
      const data = calculateRealEstatePropertyProjectionWithOverrides(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: RealEstatePropertyValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const validateInput = (): RealEstatePropertyValidationError[] => {
    const errors = validateRealEstatePropertyInput(formValues);
    return errors;
  }

  const reset = () => {
    setRows([]);
  }

  return { rows, error, reset, validateInput, generateTable, generateTableWithOverrides };
}