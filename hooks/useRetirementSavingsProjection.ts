import { useState } from 'react';
import {
  RetirementSavingsInput,
  RetirementSavingsProjectionRow,
  calculateRetirementSavingsProjection,
} from 'financial-calcs';

export function useRetirementSavingsProjection(formValues: RetirementSavingsInput) {
  const [rows, setRows] = useState<RetirementSavingsProjectionRow[]>([]);

  const generateTable = () => {
    const results = calculateRetirementSavingsProjection(formValues);
    setRows(results);
  };

  return { rows, generateTable };
}