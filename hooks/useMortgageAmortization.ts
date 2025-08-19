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

  const generateTable = () => {
    const monthlyRows = calculateMortgageAmortization(input);
    const yearly = groupByYear(monthlyRows);
    setRows(monthlyRows);
    setYearlyRows(yearly);
  };

  return { rows, yearlyRows, generateTable };
}