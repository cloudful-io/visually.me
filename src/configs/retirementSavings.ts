import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig } from '@/types/forms';
import { RetirementSavingsInput, RetirementSavingsProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';
import { IconCoin } from "@tabler/icons-react";

export const retirementSavingsConfig: CalculatorConfig<RetirementSavingsInput> = {
  id: "retirement-savings",
  icon: IconCoin,
  shortTitle: "Retirement Savings & Withdrawal Calculator",
  calculatorTitle: "Retirement Savings and Withdrawal Projection",
  calculatorDescription:
    "Project how long your retirement savings will last given your initial investment balance, annual contribution, estimated yield and withdraw rates.",
  calculatorRoute: "/calculators/retirement-savings",
  scenarioTitle: "Retirement Savings and Withdrawal Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your retirement savings based on your initial investment balance, annual contribution, estimated yield and withdraw rates.",
  scenarioRoute: "/calculators/retirement-savings/scenarios",
  chartTitle: "Retirement Savings and Withdrawal Over Time",
  assumptions: [
    "This calculator assumes that contribution increases at a fixed percentage rate over your lifetime. In reality, if you are contributing at the <a href='https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits' target='_blank' rel='noopener noreferrer'>maximum limit</a> allowed by the Internal Revenue Service (IRS), the growth rate varies year-over-year. For instance, there was no change between 2020 and 2021 at $19,500; while it increased from $20,500 to $22,500 between 2022 and 2023.",
    "This calculator assumes that withdrawal is kept at a fixed percentage rate. In reality, the limiting factor is the <a href='https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds' target='_blank' rel='noopener noreferrer'>Required Minimum Distribution (RMD)</a>, which requires you to withdraw a minimum percentage of your balance, starting at age 73. The exception is if your retirement savings is a Roth 401k or Roth IRA account.",
    "This calculator simplifies the calculation of annual yield by assuming that the annual contribution is added to your account at the <strong>end of each year</strong>. In reality, contribution is likely deducted from your monthly or bi-weekly paycheck that will benefit from the annual yield / growth of the current year.",
  ],
  initialFormValues: {
    startYear: new Date().getFullYear(),
    birthYear: 1970,
    initialBalance: 200000,
    initialContribution: 23000,
    estimatedYield: 6,
    estimatedWithdrawRate: 5,
    contributionIncreaseRate: 2,
    withdrawStartAge: 60,
    yearsToProject: 40,
  },
};

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
    { key: "beginningBalance", label: "Beginning Balance ($)", currency: true, hiddenOnMobile: true },
    { key: "contribution", label: "Contribution ($)", currency: true, editable, min: 0 },
    { key: "yieldPercent", label: "Yield %", editable, min: -100, max: 100 },
    { key: "withdrawRate", label: "Withdrawal %", editable, min: 0, max: 100 },
    { key: "monthlyWithdraw", label: "Monthly Withdrawal ($)", currency: true, hiddenOnMobile: true },
    { key: "annualWithdraw", label: "Annual Withdrawal ($)", currency: true, editable, min: 0 },
    { key: "endingBalance", label: "Ending Balance ($)", currency: true, editable, min: 0 },
  ];
}

export const retirementSavingsDataKeys: DataKeyOption<any>[] = [
  { key: "endingBalance", label: "End of Year Balance ($)" },
  { key: "annualWithdraw", label: "Annual Withdrawal ($)" },
] satisfies DataKeyOption<RetirementSavingsProjectionRow>[];