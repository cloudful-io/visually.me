import { useState } from 'react';
import {
  SocialSecurityBenefitInput,
  validateSocialSecurityBenefitInput,
  SocialSecurityValidationError,
  SocialSecurityBenefitProjectionRow,
  calculateSocialSecurityBenefitProjection,
  calculateSocialSecurityBenefitProjectionWithOverrides,
} from 'financial-calcs';
import { currencyFormatter } from '@/lib/formatters/currency';

export function useSocialSecurityBenefitProjection(formValues: SocialSecurityBenefitInput) {
  const [rows, setRows] = useState<SocialSecurityBenefitProjectionRow[]>([]);
  const [error, setError] = useState<string[] | null>(null);

  const generateTable = () => {
    try {
      const data = calculateSocialSecurityBenefitProjection(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: SocialSecurityValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const generateTableWithOverrides = () => {
    try {
      const data = calculateSocialSecurityBenefitProjectionWithOverrides(formValues);
      setRows(data);
      setError(null); // clear any previous error
    }
    catch (err: any) {
      if (err && Array.isArray(err.validationErrors)) {
        setError(err.validationErrors.map((e: SocialSecurityValidationError) => e.message));
      } else {
        setError(["Unknown error occurred"]);
      }
      setRows([]);
    }
  };

  const validateInput = (): SocialSecurityValidationError[] => {
    const errors = validateSocialSecurityBenefitInput(formValues);
    return errors;
  }

  const reset = () => {
    setRows([]);
  }
  
  return { rows, error, reset, generateTable, generateTableWithOverrides, validateInput };
}

export function getSummaryMessage(
    rows: SocialSecurityBenefitProjectionRow[], 
    error?: string[] | null,
    input?: SocialSecurityBenefitInput
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
      message: ['No Social Security benefit projection has been generated yet.'],
    };
  }

  const benefitRows = rows.filter(r => (r.annualBenefit ?? 0) > 0);

  if (benefitRows.length === 0) {
    return {
      type: 'warning',
      message: ['This projection does not include any years with Social Security benefits.'],
    };
  }

  const totalLifetimeBenefit = calculateTotalLifetimeBenefit(rows);

  const claimAge = benefitRows[0].age;
  const lastBenefitAge = benefitRows[benefitRows.length - 1].age;
  const yearsReceiving = benefitRows.length;

  let message = '';
  message += `You are projected to receive Social Security benefits from age ${claimAge} through age ${lastBenefitAge} (${yearsReceiving} years). `;
  message += `Your total estimated lifetime Social Security benefit is ${currencyFormatter(totalLifetimeBenefit)}.`;
  return {
    type: 'success',
    message: [message],
  };
}

function calculateTotalLifetimeBenefit(
  rows: SocialSecurityBenefitProjectionRow[]
): number {
  return rows.reduce((sum, row) => sum + (row.annualBenefit ?? 0), 0);
}