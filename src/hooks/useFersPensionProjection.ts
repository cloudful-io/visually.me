import { useState } from 'react';
import {
  calculateFersPensionProjection,
  validateFersPensionInput,
  FersPensionValidationError,
  FersPensionInput,
  FersPensionProjectionRow,
} from 'financial-calcs';

export function useFersPensionProjection(formValues: FersPensionInput) {
  const [rows, setRows] = useState<FersPensionProjectionRow[]>([]);
  const [error, setError] = useState<string[] | null>(null);

  const generateTable = () => {
    try {
      const data = calculateFersPensionProjection(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: FersPensionValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const validateInput = (): FersPensionValidationError[] => {
    const errors = validateFersPensionInput(formValues);
    return errors;
  }

  return { rows, error, validateInput, generateTable };
}