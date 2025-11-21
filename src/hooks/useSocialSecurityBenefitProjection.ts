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
      const data = calculateSocialSecurityBenefitProjection(formValues);
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