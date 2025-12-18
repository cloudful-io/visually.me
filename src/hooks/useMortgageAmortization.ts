import { useState } from 'react';
import {
  calculateMortgageAmortization,
  groupByYear,
  validateMortgageInput,
  MortgageValidationError,
  MortgageAmortizationInput,
  AmortizationRow,
  YearlyAmortizationRow
} from 'financial-calcs';

export function useMortgageAmortization(input: MortgageAmortizationInput) {
  const [rows, setRows] = useState<AmortizationRow[]>([]);
  const [yearlyRows, setYearlyRows] = useState<YearlyAmortizationRow[]>([]);
  const [error, setError] = useState<string[] | null>(null);

  const generateTable = () => {
    try {
      const monthlyRows = calculateMortgageAmortization(input);
      const yearly = groupByYear(monthlyRows);
      setRows(monthlyRows);
      setYearlyRows(yearly);
      setError(null); // clear any previous error
    }
     catch (err: any) {
        if (err && Array.isArray(err.validationErrors)) {
          setError(err.validationErrors.map((e: MortgageValidationError) => e.message));
        } else {
          setError(["Unknown error occurred"]);
        }
        setRows([]);
      }
  };

  const validateInput = (): MortgageValidationError[] => {
    const errors = validateMortgageInput(input);
    return errors;
  }

  const reset = () => {
    setRows([]);
    setYearlyRows([]);
  }

  return { rows, yearlyRows, reset, error, generateTable, validateInput };
}