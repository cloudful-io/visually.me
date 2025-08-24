import { useState } from 'react';
import {
  CollegeTuitionInput,
  CollegeTuitionProjectionRow,
  calculateCollegeTuitionProjection,
} from 'financial-calcs';

export function useCollegeTuitionProjection(formValues: CollegeTuitionInput) {
  const [rows, setRows] = useState<CollegeTuitionProjectionRow[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateTable = () => {
    try {
      const results = calculateCollegeTuitionProjection(formValues);
      setRows(results);
      setError(null); // clear any previous error
    }
    catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error occurred"));
      }
      setRows([]);
    }
  };

  return { rows, error, generateTable };
}

export function getSummaryMessage(
    rows: CollegeTuitionProjectionRow[], error?: Error | null
  ): { type: 'success' | 'warning' | 'error'; message: string } {
    // All deficit rows
    const deficitRows = rows.filter(r => r.annualWithdraw < r.tuitionAmount);

    if (error ) {
      return {
        type: 'error',
        message: error.message
      }
    }
    else if (deficitRows.length === 0) {
      const last = rows[rows.length - 1];
      return {
        type: 'success',
        message: `You will not run out of money. In year ${last.year}, you will still have ${last.endingBalance.toLocaleString(undefined, { 
          style: 'currency', 
          currency: 'USD', 
          maximumFractionDigits: 0 
        })}.`
      };
    } else {
      const firstDeficit = deficitRows[0];

      const firstCollegeYearRow = rows.find(r => r.tuitionAmount > 0);
      const collegeYear = firstDeficit.year - firstCollegeYearRow!.year + 1;

      // Sum the shortfall across all deficit years
      const totalShortfall = deficitRows.reduce(
        (sum, r) => sum + (r.tuitionAmount - r.annualWithdraw),
        0
      );

      return {
        type: 'warning',
        message: `You will run out of money in year ${firstDeficit.year} (${collegeYear}${ordinalSuffix(collegeYear)} year of college). Across all deficit years, you will fall short by ${totalShortfall.toLocaleString(undefined, { 
          style: 'currency', 
          currency: 'USD', 
          maximumFractionDigits: 0 
        })}.`
      };
    }
  }

  // Helper to format "1st", "2nd", "3rd", etc.
  function ordinalSuffix(n: number): string {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }