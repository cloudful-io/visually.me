import { FormFieldConfig } from '@/types/forms';
import { MortgageAmortizationInput, AmortizationRow, YearlyAmortizationRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms'; 

export type YearlyBalanceRow = {
  year: number;     // X-axis
  balance: number;  // Y-axis
};

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

export function getYearlyMortgageAmortizationProjectionColumns(editable: boolean = false): ColumnDef<YearlyAmortizationRow>[] {
  return [
    { key: 'year', label: 'Year' },
    { key: 'date', label: 'Date' },
    { key: 'payment', label: 'Payment ($)', currency: true },
    { key: 'principal', label: 'Principal ($)', currency: true },
    { key: 'interest', label: 'Interest ($)', currency: true },
    { key: 'balance', label: 'Remaining Balance ($)', currency: true },
  ];
}

export function getMonthlyMortgageAmortizationProjectionColumns(editable: boolean = false): ColumnDef<AmortizationRow>[] {
  return [
    { key: 'month', label: 'Month' },
    { key: 'date', label: 'Date' },
    { key: 'payment', label: 'Payment ($)', currency: true },
    { key: 'principal', label: 'Principal ($)', currency: true },
    { key: 'interest', label: 'Interest ($)', currency: true },
    { key: 'balance', label: 'Remaining Balance ($)', currency: true },
  ];
}

export const mortgageAmortizationDataKeys: DataKeyOption<YearlyBalanceRow>[] = [
  { key: "balance", label: "Remaining Balance ($)" },
] satisfies DataKeyOption<YearlyBalanceRow>[];