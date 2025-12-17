import { FormFieldConfig, FormFieldGroup } from '@/types/forms';
import { SocialSecurityBenefitInput, SocialSecurityBenefitProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';

const PERSONAL_INFO: FormFieldGroup = {
  id: 'personal',
  label: 'Personal Information',
};

const SALARY_INFO: FormFieldGroup = {
  id: 'salary',
  label: 'Salary and Benefit Information',
};

export const socialSecurityFieldConfigs: FormFieldConfig<SocialSecurityBenefitInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying data',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
    group: PERSONAL_INFO,
  },
  {
    name: 'birthYear',
    label: 'Birth Year',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
    group: PERSONAL_INFO,
  },
  {
    name: 'claimingAge',
    label: 'Planned Claiming Age',
    min: 62,
    max: 70,
    step: 1,
    helperText: 'You must be at least 62 to begin collecting benefits',
    group: PERSONAL_INFO,
  },
  {
    name: 'averageIncome',
    label: 'Average Annual Income ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Estimated average yearly earnings used to calculate benefit',
    group: SALARY_INFO,
  },
  {
    name: 'averageCOLA',
    label: 'Average COLA (%)',
    min: 0,
    max: 10,
    step: 0.1,
    helperText: 'Cost-of-Living Adjustment applied annually after claiming',
    group: SALARY_INFO,
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    min: 1,
    max: 80,
    step: 1,
    helperText: 'Number of years to show benefit projections',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
    group: PERSONAL_INFO,
  },
];

export function getSocialSecurityProjectionColumns(editable: boolean = false): ColumnDef<SocialSecurityBenefitProjectionRow>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "colaApplied", label: "COLA Applied (%)", editable, min: 0, max: 100 },
    { key: "monthlyBenefit", label: "Monthly Benefit ($)", currency: true, hiddenOnMobile: true },
    { key: "annualBenefit", label: "Annual Benefit ($)", currency: true },
  ];
}

export const socialSecurityDataKeys: DataKeyOption<SocialSecurityBenefitProjectionRow>[] = [
  { key: "annualBenefit", label: "Annual Social Security Benefit ($)" },
] satisfies DataKeyOption<SocialSecurityBenefitProjectionRow>[];