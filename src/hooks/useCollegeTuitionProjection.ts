import { useState } from 'react';
import {
  CollegeTuitionInput,
  validateCollegeTuitionInput,
  CollegeTuitionValidationError,
  CollegeTuitionProjectionRow,
  calculateCollegeTuitionProjection,
} from 'financial-calcs';
import { currencyFormatter } from '@/lib/formatters/currency';

export function useCollegeTuitionProjection(formValues: CollegeTuitionInput) {
  const [rows, setRows] = useState<CollegeTuitionProjectionRow[]>([]);
  const [error, setError] = useState<string[] | null>(null);

  const generateTable = () => {
    try {
      const results = calculateCollegeTuitionProjection(formValues);
      setRows(results);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: CollegeTuitionValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const validateInput = (): CollegeTuitionValidationError[] => {
    const errors = validateCollegeTuitionInput(formValues);
    return errors;
  }

  const reset = () => {
    setRows([]);
  }

  return { rows, error, reset, generateTable, validateInput };
}

export function getSummaryMessage(
    rows: CollegeTuitionProjectionRow[], 
    error?: string[] | null,
    input?: CollegeTuitionInput
  ): { type: 'success' | 'warning' | 'error'; message: string[] } {
    // All deficit rows
    const deficitRows = rows.filter(r => r.annualWithdraw < r.tuitionAmount);

    if (error && error.length > 0) {
      return {
        type: 'error',
        message: error
      };
    }
    else if (deficitRows.length === 0) {
      const last = rows[rows.length - 1];
      return {
        type: 'success',
        message: [`You will not run out of money. In year ${last.year}, you will still have ` + currencyFormatter(last.endingBalance) + `.`]};
    } else {
      const firstDeficit = deficitRows[0];

      const firstCollegeYearRow = rows.find(r => r.tuitionAmount > 0);
      const collegeYear = firstDeficit.year - firstCollegeYearRow!.year + 1;

      // Sum the shortfall across all deficit years
      const totalShortfall = deficitRows.reduce(
        (sum, r) => sum + (r.tuitionAmount - r.annualWithdraw),
        0
      );

      let message = 
        `You will run out of money in ${firstDeficit.year} (${collegeYear}${ordinalSuffix(
          collegeYear
        )} year of college). Across all deficit years, you will fall short by ` + currencyFormatter(totalShortfall) + `.`;
      ;

      if (input) {
        const requiredContribution = calculateRequiredAnnualContribution(input);
        const additionalNeeded = Math.max(
          0,
          requiredContribution - input.annualContribution
        );

        if (additionalNeeded > 0) {
          message += ` To fully cover college tuition, consider increasing your annual contribution by approximately ` + currencyFormatter(additionalNeeded) +
            `, bringing your total annual contribution to ` + currencyFormatter(requiredContribution) + `.`;
        }
      }
      
      return {
        type: 'warning',
        message: [message],
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

  function calculateRequiredAnnualContribution(
    input: CollegeTuitionInput,
    maxContribution = 100_000,
    tolerance = 1
  ): number {
    let low = 0;
    let high = maxContribution;
    let result = maxContribution;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      const projection = calculateCollegeTuitionProjection({
        ...input,
        annualContribution: mid,
      });

      if (hasTuitionDeficit(projection)) {
        low = mid + tolerance;
      } else {
        result = mid;
        high = mid - tolerance;
      }
    }
    return result;
  }

  function hasTuitionDeficit(rows: CollegeTuitionProjectionRow[]): boolean {
    return rows.some(
      r => r.tuitionAmount > 0 && r.annualWithdraw < r.tuitionAmount
    );
  }