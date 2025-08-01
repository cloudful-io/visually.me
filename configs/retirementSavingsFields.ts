import { FormFieldConfig } from '@/types/forms';

export type RetirementSavingsFormValues = {
  startYear: number;
  birthYear: number;
  initialBalance: number;
  initialContribution: number;
  estimatedYield: number;
  estimatedWithdrawRate: number;
  contributionIncreaseRate: number;
  withdrawStartAge: number;
  yearsToProject: number;
};

export const retirementSavingsFieldConfigs: FormFieldConfig<RetirementSavingsFormValues>[] = [
  { name: 'startYear', label: 'Start Year' },
  { name: 'birthYear', label: 'Birth Year' },
  { name: 'initialBalance', label: 'Initial Balance ($)' },
  { name: 'initialContribution', label: 'Initial Contribution ($)' },
  { name: 'estimatedYield', label: 'Estimated Annual Yield (%)' },
  { name: 'estimatedWithdrawRate', label: 'Estimated Withdraw Rate (%)' },
  { name: 'contributionIncreaseRate', label: 'Contribution Increase Rate (%)' },
  { name: 'withdrawStartAge', label: 'Withdraw Start Age' },
  { name: 'yearsToProject', label: 'Years to Project' },
];
