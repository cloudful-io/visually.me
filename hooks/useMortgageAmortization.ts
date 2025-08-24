import { useState } from 'react';
import {
  calculateMortgageAmortization,
  groupByYear,
  MortgageAmortizationInput,
  AmortizationRow,
  YearlyAmortizationRow
} from 'financial-calcs';

export function useMortgageAmortization(input: MortgageAmortizationInput) {
  const [rows, setRows] = useState<AmortizationRow[]>([]);
  const [yearlyRows, setYearlyRows] = useState<YearlyAmortizationRow[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateTable = () => {
    try {
      const monthlyRows = calculateMortgageAmortization(input);
      const yearly = groupByYear(monthlyRows);
      setRows(monthlyRows);
      setYearlyRows(yearly);
      setError(null); // clear any previous error
    }
     catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error occurred"));
      }
      setRows([]);
      setYearlyRows([]);
    }
  };

  return { rows, yearlyRows, error, generateTable };
}