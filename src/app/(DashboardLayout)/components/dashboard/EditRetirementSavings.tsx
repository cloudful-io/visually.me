"use client";

import { FormFields } from "@/app/(DashboardLayout)/components/shared/FormFields";
import { RetirementSavingsInput } from "financial-calcs";
import { retirementSavingsFieldConfigs } from "@/configs/retirementSavingsFields";

interface Props {
  values: RetirementSavingsInput;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof RetirementSavingsInput, string>>;
}

const EditRetirementSavings = ({ values, onChange, errors }: Props) => {
  return (
    <FormFields
      fields={retirementSavingsFieldConfigs}
      values={values}
      onChange={onChange}
      errors={errors}
      dialog
      context={{ isAuthenticated: true }}
    />
  );
};

export default EditRetirementSavings;
