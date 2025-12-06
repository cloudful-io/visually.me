"use client";

import { FormFields } from "@/app/(DashboardLayout)/components/shared/FormFields";
import { FersPensionInput } from "financial-calcs";
import { fersPensionFieldConfigs } from "@/configs/fersPension";

interface Props {
  values: FersPensionInput;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof FersPensionInput, string>>;
}

const EditFERSPension = ({ values, onChange, errors }: Props) => {
  return (
    <FormFields
      fields={fersPensionFieldConfigs}
      values={values}
      onChange={onChange}
      errors={errors}
      dialog
      context={{ isAuthenticated: true }}
    />
  );
};

export default EditFERSPension;
