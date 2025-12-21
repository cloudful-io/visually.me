import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig } from '@/types/forms';
import { RetirementSavingsInput, RetirementSavingsProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';
import { IconCoin } from "@tabler/icons-react";

export const retirementSavingsConfig: CalculatorConfig<RetirementSavingsInput> = {
  id: "retirement-savings",
  icon: IconCoin,
  shortTitle: "Retirement Savings & Withdrawal",
  calculatorTitle: "Retirement Savings and Withdrawal Projection",
  calculatorDescription:
    "Project how long your retirement savings will last given your initial investment balance, annual contribution, estimated yield and withdraw rates.",
  calculatorRoute: "/calculators/retirement-savings",
  scenarioTitle: "Retirement Savings and Withdrawal Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your retirement savings based on your initial investment balance, annual contribution, estimated yield and withdraw rates.",
  scenarioRoute: "/calculators/retirement-savings/scenario",
  chartTitle: "Retirement Savings and Withdrawal Over Time",
  assumptions: [
    <>
      This calculator assumes that contributions increase at a fixed percentage
      rate over your lifetime. In practice, if you are contributing at the{" "}
      <a
        href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits"
        target="_blank"
        rel="noopener noreferrer"
      >
        IRS maximum limit
      </a>
      , the contribution limit itself may change year over year. For example,
      there was no change between 2020 and 2021 ($19,500), while the limit increased
      from $20,500 to $22,500 between 2022 and 2023.
    </>,

    <>
      This calculator assumes withdrawals occur at a fixed percentage rate. In
      reality, withdrawals may be constrained by{" "}
      <a
        href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds"
        target="_blank"
        rel="noopener noreferrer"
      >
        Required Minimum Distributions (RMDs)
      </a>
      , which mandate a minimum withdrawal percentage starting at age 73. This
      requirement does not apply to Roth 401(k) or Roth IRA accounts.
    </>,

    <>
      This calculator simplifies annual investment growth by assuming that each
      year’s contribution is added to your account at the{" "}
      <strong>end of the year</strong>. In reality, contributions are typically
      made throughout the year (for example, via monthly or bi-weekly paychecks),
      which may benefit from market growth during the same year.
    </>,
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
    type: "number",
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying retirement savings and withdraw',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
  {
    name: 'birthYear',  
    label: 'Birth Year',
    type: "number",
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
    type: "number",
    min: 0,
    step: 0.1,
  },
  {
    name: 'estimatedWithdrawRate',
    label: 'Estimated Withdrawal Rate (%)',
    type: "number",
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Percentage of remaining balance to withdraw',
  },
  {
    name: 'contributionIncreaseRate',
    label: 'Contribution Increase Rate (%)',
    type: "number",
    min: -99,
    max: 100,
    step: 0.1,
    helperText: 'Percentage of increase of annual contribution ',
  },
  {
    name: 'withdrawStartAge',
    label: 'Withdrawal Start Age',
    type: "number",
    min: 50,
    max: 73,
    step: 1,
    helperText: 'Age to start withdrawing retirement savings',
    //shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    type: "number",
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

export function getRetirementSavingsScenarioColumns(): ColumnDef<any>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "endingBalance1", label: "Scenario 1 Balance ($)", currency: true },
    { key: "endingBalance2", label: "Scenario 2 Balance ($)", currency: true },
    { key: "endingBalanceDiff", label: "Balance Difference ($)", currency: true, isDifference: true },
    { key: "annualWithdraw1", label: "Scenario 1 Annual Withdrawal ($)", currency: true },
    { key: "annualWithdraw2", label: "Scenario 2 Annual Withdrawal ($)", currency: true },
    { key: "annualWithdrawDiff", label: "Annual Withdrawal Difference ($)", currency: true, isDifference: true },
  ];
}

export const retirementSavingsDataKeys: DataKeyOption<any>[] = [
  { key: "endingBalance", label: "End of Year Balance ($)" },
  { key: "annualWithdraw", label: "Annual Withdrawal ($)" },
] satisfies DataKeyOption<RetirementSavingsProjectionRow>[];