import { FormFieldConfig } from '@/types/forms';
import { RetirementSavingsInput, RetirementSavingsProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';


export const retirementSavingsFieldConfigs: FormFieldConfig<RetirementSavingsInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying retirement savings and withdraw',
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
    name: 'initialBalance',
    label: 'Initial Balance ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Balance of retirement savings at Start Year',
  },
  {
    name: 'initialContribution',
    label: 'Initial Contribution ($)',
    type: 'currency',
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
    label: 'Estimated Withdrawal Rate (%)',
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
    label: 'Withdrawal Start Age',
    min: 50,
    max: 73,
    step: 1,
    helperText: 'Age to start withdrawing retirement savings',
    //shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
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

export function getRetirementSavingsProjectionColumns(editable: boolean = false): ColumnDef<RetirementSavingsProjectionRow>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "beginningBalance", label: "Beginning Balance ($)", currency: true },
    { key: "contribution", label: "Contribution ($)", currency: true, editable, min: 0 },
    { key: "yieldPercent", label: "Yield %", editable, min: -100, max: 100 },
    { key: "withdrawRate", label: "Withdrawal %", editable, min: 0, max: 100 },
    { key: "monthlyWithdraw", label: "Monthly Withdrawal ($)", currency: true },
    { key: "annualWithdraw", label: "Annual Withdrawal ($)", currency: true, editable, min: 0 },
    { key: "endingBalance", label: "Ending Balance ($)", currency: true, editable, min: 0 },
  ];
}

export const retirementSavingsDataKeys: DataKeyOption<any>[] = [
  { key: "endingBalance", label: "End of Year Balance ($)" },
  { key: "annualWithdraw", label: "Annual Withdrawal ($)" },
] satisfies DataKeyOption<RetirementSavingsProjectionRow>[];