import { useState } from 'react';
import {
  SocialSecurityBenefitInput,
  validateSocialSecurityBenefitInput,
  SocialSecurityValidationError,
  SocialSecurityBenefitProjectionRow,
  calculateSocialSecurityBenefitProjection,
} from 'financial-calcs';

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

  const validateInput = (): SocialSecurityValidationError[] => {
    const errors = validateSocialSecurityBenefitInput(formValues);
    return errors;
  }

  return { rows, error, generateTable, validateInput };
}