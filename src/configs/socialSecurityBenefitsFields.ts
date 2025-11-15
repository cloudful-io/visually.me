import { FormFieldConfig } from '@/types/forms';
import { SocialSecurityBenefitInput } from 'financial-calcs';

export const socialSecurityFieldConfigs: FormFieldConfig<SocialSecurityBenefitInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying data',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
  {
    name: 'birthYear',
    label: 'Birth Year',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
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
    name: 'yearsToProject',
    label: 'Years to Project',
    min: 1,
    max: 80,
    step: 1,
    helperText: 'Number of years to show benefit projections',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
];