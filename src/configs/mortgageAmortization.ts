import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig } from '@/types/forms';
import { MortgageAmortizationInput, AmortizationRow, YearlyAmortizationRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms'; 
import { IconHome } from "@tabler/icons-react";

export const mortgageAmortizationConfig: CalculatorConfig<MortgageAmortizationInput> = {
  id: "mortgage-amortization",
  icon: IconHome,
  shortTitle: "Mortgage Amortization",
  calculatorTitle: "Mortgage Amortization Calculator",
  calculatorDescription:
    "Determine how your loan payments are split between principal and interest over time, based on loan amount, interest rate, loan term, and whether extra monthly payments are made.",
  calculatorRoute: "/calculators/mortgage-amortization",
  scenarioTitle: "Mortgage Amortization Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your mortgage amortization based on loan amount, interest rate, loan term, and whether extra monthly payments are made.",
  scenarioRoute: "/calculators/mortgage-amortization/scenario",
  chartTitle: "Mortgage Amortization",
  assumptions: [
    "Mortgage has a fixed interest rate that never changes during the life of the loan.",
    "Monthly principal and interest payments remain constant throughout the term.",
    "Amortization chart and table does not include property taxes, homeowners insurance, Homeowner Association (HOA) fees, or Private Mortgage Insurance (PMI) in the payment calculation.",
    "Any extra payments are applied directly to the loan principal without penalties or restrictions.",
    "Loan begins immediately and the first payment occurs one month after the start date.",
  ],
  initialFormValues: {
    loanAmount: 300000,
    annualRate: 6,
    termYears: 30,
    extraPayment: 0,
    startDate: new Date(),
  },
};

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
    type: "number",
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Interest rate per year as a percentage (Example: Average 30-year fixed mortgage rate in 2024: 6.8%)',
  },
  {
    name: 'termYears',
    label: 'Loan Term (Years)',
    type: "number",
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

export function getMortgageAmortizationProjectionColumns(editable: boolean = false, isYearly: boolean = false): ColumnDef<AmortizationRow>[] {
  return [
    isYearly ? { key: 'year', label: 'Year' } : { key: 'month', label: 'Month' },
    { key: 'date', label: 'Date' },
    { key: 'payment', label: 'Payment ($)', currency: true },
    { key: 'principal', label: 'Principal ($)', currency: true },
    { key: 'interest', label: 'Interest ($)', currency: true },
    { key: 'balance', label: 'Remaining Balance ($)', currency: true },
  ];
}

export function getMortgageAmortizationScenarioColumns(): ColumnDef<any>[] {
  return [
    { key: "year", label: "Year" },
    { key: "balance1", label: "Scenario 1 Balance ($)", currency: true },
    { key: "balance2", label: "Scenario 2 Balance ($)", currency: true },
    { key: "balanceDiff", label: "Balance Difference ($)", currency: true, isDifference: true },
  ];
}

export const mortgageAmortizationDataKeys: DataKeyOption<YearlyBalanceRow>[] = [
  { key: "balance", label: "Remaining Balance ($)" },
] satisfies DataKeyOption<YearlyBalanceRow>[];