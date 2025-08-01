import { FormFieldConfig } from '@/types/forms';

export type SocialSecurityBenefitsFormValues = {
  startYear: number;
  birthYear: number;
  claimingAge: number;
  averageIncome: number;
  averageCOLA: number;
  yearsToDisplay: number;
};

export const socialSecurityFieldConfigs: FormFieldConfig<SocialSecurityBenefitsFormValues>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: new Date().getFullYear(),
    step: 1,
    helperText: 'Year to begin displaying Social Security benefits',
  },
  {
    name: 'birthYear',
    label: 'Birth Year',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
  },
  {
    name: 'claimingAge',
    label: 'Planned Claiming Age',
    min: 62,
    max: 70,
    step: 1,
    helperText: 'You must be at least 62 to begin collecting benefits',
  },
  {
    name: 'averageIncome',
    label: 'Average Annual Income ($)',
    min: 0,
    step: 1000,
    helperText: 'Estimated average yearly earnings used to calculate benefit',
  },
  {
    name: 'averageCOLA',
    label: 'Average COLA (%)',
    min: 0,
    max: 10,
    step: 0.1,
    helperText: 'Cost-of-Living Adjustment applied annually after claiming',
  },
  {
    name: 'yearsToDisplay',
    label: 'Years to Display',
    min: 1,
    max: 40,
    step: 1,
    helperText: 'Number of years to show benefit projections after claiming',
  },
];