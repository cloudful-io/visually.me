import { useState } from 'react';
import {
  calculateMilitaryPensionProjection,
  validateMilitaryPensionInput,
  MilitaryPensionValidationError,
  MilitaryPensionInput,
  MilitaryPensionProjectionRow,
  calculateMilitaryPensionProjectionWithOverrides,
} from 'financial-calcs';

export function useMilitaryPensionProjection(formValues: MilitaryPensionInput) {
  const [rows, setRows] = useState<MilitaryPensionProjectionRow[]>([]);
  const [error, setError] = useState<string[] | null>(null);

  const generateTable = () => {
    try {
      const data = calculateMilitaryPensionProjection(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: MilitaryPensionValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const generateTableWithOverrides = () => {
    try {
      const data = calculateMilitaryPensionProjectionWithOverrides(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: MilitaryPensionValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const validateInput = (): MilitaryPensionValidationError[] => {
    const errors = validateMilitaryPensionInput(formValues);
    return errors;
  }

  const reset = () => {
    setRows([]);
  }

  return { rows, error, reset, validateInput, generateTable, generateTableWithOverrides };
}