import { useState } from 'react';
import {
  calculateFersPensionProjection,
  FersPensionInput,
  FersPensionProjectionRow,
} from 'financial-calcs';

export function useFersPensionProjection(formValues: FersPensionInput) {
  const [rows, setRows] = useState<FersPensionProjectionRow[]>([]);

  const generateTable = () => {
    const data = calculateFersPensionProjection(formValues);
    setRows(data);
  };

  return { rows, generateTable };
}