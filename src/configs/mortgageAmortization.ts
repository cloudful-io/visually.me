import { FormFieldConfig } from '@/types/forms';
import { MortgageAmortizationInput } from 'financial-calcs';

export const mortgageAmortizationFieldConfigs: FormFieldConfig<MortgageAmortizationInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'loanAmount',
    label: 'Loan Amount ($)',
    type: 'currency',
    min: 1,
    step: 1000,
    helperText: 'Total mortgage loan amount.',
  },
  {
    name: 'annualRate',
    label: 'Annual Interest Rate (%)',
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Interest rate per year as a percentage.',
  },
  {
    name: 'termYears',
    label: 'Loan Term (Years)',
    min: 0,
    max: 50,
    step: 1,
    helperText: 'Number of years over which the mortgage will be paid.',
  },
  {
    name: 'extraPayment',
    label: 'Extra Monthly Payment ($)',
    type: 'currency',
    min: 0,
    step: 100,
    helperText: 'Additional payment applied each month to reduce principal.',
  },
  {
    name: 'startDate',
    label: 'Mortgage Start Date',
    type: 'date',
    helperText: 'Date when mortgage payments begin.',
  },
];
