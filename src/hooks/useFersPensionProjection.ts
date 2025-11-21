import { useState } from 'react';
import {
  calculateFersPensionProjection,
  FersPensionInput,
  FersPensionProjectionRow,
} from 'financial-calcs';

export function useFersPensionProjection(formValues: FersPensionInput) {
  const [rows, setRows] = useState<FersPensionProjectionRow[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateTable = () => {
    try {
      const data = calculateFersPensionProjection(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      setRows([]);
    }
  };

  return { rows, error, generateTable };
}