import { useState } from 'react';
import {
  SocialSecurityBenefitInput,
  SocialSecurityBenefitProjectionRow,
  calculateSocialSecurityBenefitProjection,
} from 'financial-calcs';

export function useSocialSecurityBenefitProjection(formValues: SocialSecurityBenefitInput) {
  const [rows, setRows] = useState<SocialSecurityBenefitProjectionRow[]>([]);

  const generateTable = () => {
    const results = calculateSocialSecurityBenefitProjection(formValues);
    setRows(results);
  };

  return { rows, generateTable };
}