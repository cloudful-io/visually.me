import { FormFieldConfig } from '@/types/forms';
import { RetirementSavingsInput } from 'financial-calcs';

export const retirementSavingsFieldConfigs: FormFieldConfig<RetirementSavingsInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying retirement savings and withdraw',
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
    name: 'initialBalance',
    label: 'Initial Balance ($)',
    min: 0,
    step: 1000,
    helperText: 'Balance of retirement savings at Start Year',
  },
  {
    name: 'initialContribution',
    label: 'Initial Contribution ($)',
    min: 1,
    step: 100,
    helperText: 'Initial annual contribution at Start Year',
  },
  {
    name: 'estimatedYield',
    label: 'Estimated Annual Yield (%)',
    min: 0,
    step: 0.1,
  },
  {
    name: 'estimatedWithdrawRate',
    label: 'Estimated Withdraw Rate (%)',
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Percentage of remaining balance to withdraw',
  },
  {
    name: 'contributionIncreaseRate',
    label: 'Contribution Increase Rate (%)',
    min: -99,
    max: 100,
    step: 0.1,
    helperText: 'Percentage of increase of annual contribution ',
  },
  {
    name: 'withdrawStartAge',
    label: 'Withdraw Start Age',
    min: 50,
    max: 73,
    step: 1,
    helperText: 'Age to start withdrawing retirement savings',
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    min: 1,
    max: 80,
    step: 1,
    helperText: 'Number of years to show benefit projections after claiming',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
];