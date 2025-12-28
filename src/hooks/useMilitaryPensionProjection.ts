import { useState } from 'react';
import {
  calculateMilitaryPensionProjection,
  validateMilitaryPensionInput,
  MilitaryPensionValidationError,
  MilitaryPensionInput,
  MilitaryPensionProjectionRow,
  calculateMilitaryPensionProjectionWithOverrides,
} from 'financial-calcs';
import { currencyFormatter } from '@/lib/formatters/currency';

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

export function getSummaryMessage(
    rows: MilitaryPensionProjectionRow[], 
    error?: string[] | null,
    input?: MilitaryPensionInput
  ): { type: 'success' | 'warning' | 'error'; message: string[] } {

  if (error && error.length > 0) {
    return {
      type: 'error',
      message: error,
    };
  }
  if (!rows || rows.length === 0) {
    return {
      type: 'warning',
      message: ['No Uniformed Service Member pension projection has been generated yet.'],
    };
  }

  const pensionRows = rows.filter(r => (r.pension ?? 0) > 0);

  if (pensionRows.length === 0) {
    return {
      type: 'warning',
      message: ['This projection does not include any years with Uniformed Service Member pension.'],
    };
  }

  const totalLifetimePension = calculateTotalLifetimePension(rows);

  const pensionAge = pensionRows[0].age;
  const lastPensionAge = pensionRows[pensionRows.length - 1].age;
  const yearsReceiving = pensionRows.length;

  let message = '';
  message += `You are projected to receive Uniformed Service Member pension from age ${pensionAge} through age ${lastPensionAge} (${yearsReceiving} years). `;
  message += `Your total estimated lifetime Uniformed Service Member pension is ${currencyFormatter(totalLifetimePension)}.`;
  return {
    type: 'success',
    message: [message],
  };
}

function calculateTotalLifetimePension(
  rows: MilitaryPensionProjectionRow[]
): number {
  return rows.reduce((sum, row) => sum + (row.pension ?? 0), 0);
}