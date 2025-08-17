import { FormFieldConfig } from '@/types/forms';

export type MortgageFormValues = {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  extraPayment: number;
  startDate?: Date;
};

export const mortgageAmortizationFieldConfigs: FormFieldConfig<MortgageFormValues>[] = [
  {
    name: 'loanAmount',
    label: 'Loan Amount ($)',
    min: 0,
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
    min: 1,
    max: 40,
    step: 1,
    helperText: 'Number of years over which the mortgage will be paid.',
  },
  {
    name: 'extraPayment',
    label: 'Extra Monthly Payment ($)',
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
