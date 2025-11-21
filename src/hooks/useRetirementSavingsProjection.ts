import { useState } from 'react';
import {
  RetirementSavingsInput,
  RetirementSavingsProjectionRow,
  calculateRetirementSavingsProjection,
} from 'financial-calcs';

export function useRetirementSavingsProjection(formValues: RetirementSavingsInput) {
  const [rows, setRows] = useState<RetirementSavingsProjectionRow[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateTable = () => {
    try {
      const data = calculateRetirementSavingsProjection(formValues);
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

export function getSummaryMessage(
    rows: RetirementSavingsProjectionRow[], error?: Error | null
  ): { type: 'success' | 'info' | 'warning' | 'error'; message: string } {
    if (error ) {
      return {
        type: 'error',
        message: error.message
      }
    }
    else if (rows.length < 2) {
      return {
        type: 'info',
        message: "Not enough data to analyze withdrawal trends."
      };
    }

    // Find first year where withdrawal decreases from the previous year
    let dropRow: RetirementSavingsProjectionRow | null = null;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].annualWithdraw < rows[i - 1].annualWithdraw) {
        dropRow = rows[i];
        break;
      }
    }

    if (!dropRow) {
      const last = rows[rows.length - 1];
      return {
        type: 'success',
        message: `Your annual withdrawals never decrease. By age ${last.age} (year ${last.year}), you are still withdrawing ${last.annualWithdraw.toLocaleString(undefined, { 
          style: 'currency', 
          currency: 'USD', 
          maximumFractionDigits: 0 
        })} annually, with a balance of ${last.endingBalance.toLocaleString(undefined, { 
          style: 'currency', 
          currency: 'USD', 
          maximumFractionDigits: 0 
        })}`
      };
    } else {
      // Compare to previous year
      const prevRow = rows[rows.findIndex(r => r.year === dropRow!.year) - 1];
      const shortfall = prevRow.annualWithdraw - dropRow.annualWithdraw;

      return {
        type: 'warning',
        message: `Your annual withdrawal decreases in year ${dropRow.year} at age ${dropRow.age}. It drops from ${prevRow.annualWithdraw.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} to ${dropRow.annualWithdraw.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}, a reduction of ${shortfall.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}.`
      };
    }
  }