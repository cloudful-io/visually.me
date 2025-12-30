import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig } from '@/types/forms';
import { CollegeTuitionInput, CollegeTuitionProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';
import { IconSchool } from "@tabler/icons-react";

export const collegeTuitionConfig: CalculatorConfig<CollegeTuitionInput> = {
  id: "college-tuition",
  icon: IconSchool,
  shortTitle: "College Savings & Tuition",
  calculatorTitle: "College Savings and Tuition Projection",
  calculatorDescription:
    "Estimate how much you need to save to cover future tuition costs, based on initial balance of savings, years of college education, annual contributions, estimated yield and inflation rates, and cost of college education.",
  calculatorRoute: "/calculators/college-tuition",
  scenarioTitle: "College Savings and Tuition Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your college tuition and savings based on initial balance of savings, years of college education, annual contributions, estimated yield and inflation rates, and cost of college education.",
  scenarioRoute: "/calculators/college-tuition/scenario",
  chartTitle: "College Savings and Tuition Over Time",
  assumptions: [
    "This calculator assumes that contribution is made annually, and it simplies the calculation of annual yield by assume that the annual contribution is added to your account at the beginning of each year.  In reality, contribution may be added incrementally throughout a year.",
    "This calculator assumes that contribution automatically stops at the end of the last year of college.",
    "This calculator assumes that the balance will never go negative, meaning that the withdraw amount for tuition will never be larger than the available balance.",
  ],
  initialFormValues: {
    startYear: new Date().getFullYear(),
    childBirthYear: 2010,
    childCollegeFirstYear: 2028,
    childCollegeLastYear: 2031,
    initialBalance: 20000,
    annualContribution: 10000,
    estimatedYield: 5,
    estimatedFirstYearTuition: 50000,
    estimatedInflationRate: 3,
  },
};
export const collegeTuitionFieldConfigs: FormFieldConfig<CollegeTuitionInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    type: "number",
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying college savings and tuition',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
  {
    name: 'childBirthYear',
    label: "Child's Birth Year",
    type: "number",
    min: 1900,
    step: 1,
  },  
  {
    name: 'childCollegeFirstYear',
    label: "Child's First Year of College",
    type: "number",
    min: 2000,
    step: 1,
    derive: ({ values, prevValues, set }) => {
      if (
        values.childBirthYear &&
        values.childBirthYear !== prevValues.childBirthYear
      ) {
        set('childCollegeFirstYear', values.childBirthYear + 18);
      }
    },
  },  
  {
    name: 'childCollegeLastYear',
    label: "Child's Last Year of College",
    type: "number",
    min: 2000,
    step: 1,
    derive: ({ values, prevValues, set }) => {
      if (
        values.childCollegeFirstYear &&
        values.childCollegeFirstYear !== prevValues.childCollegeFirstYear
      ) {
        set('childCollegeLastYear', values.childCollegeFirstYear + 3);
      }
    },
  },  
  {
    name: 'initialBalance',
    label: 'Initial Balance ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Balance of college savings at Start Year',
  },
  {
    name: 'annualContribution',
    label: 'Annual Contribution ($)',
    type: 'currency',
    min: 0,
    step: 100,
    helperText: 'Annual contribution each year',
  },
  {
    name: 'estimatedYield',
    label: 'Estimated Annual Yield (%)',
    type: "number",
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'estimatedFirstYearTuition',
    label: 'Estimated First Year Tuition ($)',
    type: 'currency',
    min: 0,
    max: 200000,
    step: 100,
    helperText: 'Estimated college tuition at first year in future dollar'
  },
  {
    name: 'estimatedInflationRate',
    label: 'Estimated Inflation Rate (%)',
    type: "number",
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Estimated inflation rate to calculate rising college tuition',
  },
];

export function getCollegeTuitionProjectionColumns(editable: boolean = false): ColumnDef<CollegeTuitionProjectionRow>[] {
  return [
    { key: 'year', label: 'Year' },
    { key: 'age', label: 'Child\'s Age' },
    //{ key: 'childAge', label: 'Child\'s Age' },
    { key: 'beginningBalance', label: 'Beginning Balance ($)', currency: true },
    { key: 'contribution', label: 'Contribution ($)', currency: true },
    { key: 'yieldPercent', label: 'Yield %' },
    { key: 'tuitionAmount', label: 'Tuition ($)', description: "Estimated Tuition Cost ($)", currency: true },
    { key: 'annualWithdraw', label: 'Annual Withdrawal ($)', description: "Amount to Withdraw to Cover College Tuition ($)", currency: true },
    { key: 'endingBalance', label: 'Ending Balance ($)', currency: true },
  ];
}

export function getCollegeTuitionScenarioColumns(): ColumnDef<any>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: 'Child\'s Age' },
    { key: "endingBalance1", label: "Scenario 1 Balance ($)", currency: true },
    { key: "endingBalance2", label: "Scenario 2 Balance ($)", currency: true },
    { key: "endingBalanceDiff", label: "Balance Difference ($)", currency: true, isDifference: true },
    { key: "annualWithdraw1", label: "Scenario 1 Tuition Withdrawal ($)", currency: true },
    { key: "annualWithdraw2", label: "Scenario 2 Tuition Withdrawal ($)", currency: true },
    { key: "annualWithdrawDiff", label: "Tuition Withdrawal Difference ($)", currency: true, isDifference: true },
  ];
}

export const collegeTuitionDataKeys: DataKeyOption<any>[] = [
  { key: "endingBalance", label: "End of Year Balance ($)" },
  { key: "annualWithdraw", label: "Tuition Withdrawal ($)" },
] satisfies DataKeyOption<CollegeTuitionProjectionRow>[];