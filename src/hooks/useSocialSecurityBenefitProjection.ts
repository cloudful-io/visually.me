import { useState } from 'react';
import {
  SocialSecurityBenefitInput,
  SocialSecurityBenefitProjectionRow,
  calculateSocialSecurityBenefitProjection,
} from 'financial-calcs';

export function useSocialSecurityBenefitProjection(formValues: SocialSecurityBenefitInput) {
  const [rows, setRows] = useState<SocialSecurityBenefitProjectionRow[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateTable = () => {
    try {
      const results = calculateSocialSecurityBenefitProjection(formValues);
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