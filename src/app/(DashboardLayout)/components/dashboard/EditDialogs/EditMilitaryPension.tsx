"use client";

import { FormFields } from "@/app/(DashboardLayout)/components/shared/FormFields";
import { MilitaryPensionInput } from "financial-calcs";
import { militaryPensionFieldConfigs } from "@/configs/militaryPension";

interface Props {
  values: MilitaryPensionInput;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof MilitaryPensionInput, string>>;
}

const EditMilitaryPension = ({ values, onChange, errors }: Props) => {
  return (
    <FormFields
      fields={militaryPensionFieldConfigs}
      values={values}
      onChange={onChange}
      errors={errors}
      dialog
      context={{ isAuthenticated: true }}
    />
  );
};

export default EditMilitaryPension;
