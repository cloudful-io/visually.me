"use client";

import { FormFields } from "@/app/(DashboardLayout)/components/shared/FormFields";
import { SocialSecurityBenefitInput } from "financial-calcs";
import { socialSecurityFieldConfigs } from "@/configs/socialSecurityBenefitsFields";

interface Props {
  values: SocialSecurityBenefitInput;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof SocialSecurityBenefitInput, string>>;
}

const EditSocialSecurityBenefit = ({ values, onChange, errors }: Props) => {
  return (
    <FormFields
      fields={socialSecurityFieldConfigs}
      values={values}
      onChange={onChange}
      errors={errors}
      dialog
      context={{ isAuthenticated: true }}
    />
  );
};

export default EditSocialSecurityBenefit;
