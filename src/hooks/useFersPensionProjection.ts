import { useState } from 'react';
import {
  calculateFersPensionProjection,
  validateFersPensionInput,
  FersPensionValidationError,
  FersPensionInput,
  FersPensionProjectionRow,
  calculateFersPensionProjectionWithOverrides,
} from 'financial-calcs';
import { currencyFormatter } from '@/lib/formatters/currency';

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

  const generateTableWithOverrides = () => {
    try {
      const data = calculateFersPensionProjectionWithOverrides(formValues);
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

  const reset = () => {
    setRows([]);
  }

  return { rows, error, reset, validateInput, generateTable, generateTableWithOverrides };
}

export function getSummaryMessage(
    rows: FersPensionProjectionRow[], 
    error?: string[] | null,
    input?: FersPensionInput
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
      message: ['No FERS pension projection has been generated yet.'],
    };
  }

  const pensionRows = rows.filter(r => (r.pension ?? 0) > 0);

  if (pensionRows.length === 0) {
    return {
      type: 'warning',
      message: ['This projection does not include any years with FERS pension.'],
    };
  }

  const totalLifetimePension = calculateTotalLifetimePension(rows);

  const pensionAge = pensionRows[0].age;
  const lastPensionAge = pensionRows[pensionRows.length - 1].age;
  const yearsReceiving = pensionRows.length;

  let message = '';
  message += `You are projected to receive FERS pension from age ${pensionAge} through age ${lastPensionAge} (${yearsReceiving} years). `;
  message += `Your total estimated lifetime FERS pension is ${currencyFormatter(totalLifetimePension)}.`;
  return {
    type: 'success',
    message: [message],
  };
}

function calculateTotalLifetimePension(
  rows: FersPensionProjectionRow[]
): number {
  return rows.reduce((sum, row) => sum + (row.pension ?? 0), 0);
}