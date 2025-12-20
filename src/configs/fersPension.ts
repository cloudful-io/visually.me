import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig } from '@/types/forms';
import { FersPensionInput, FersPensionProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';
import { IconUser } from "@tabler/icons-react";

export const fersPensionConfig: CalculatorConfig<FersPensionInput> = {
  id: "fers-pension",
  icon: IconUser,
  shortTitle: "FERS Pension",
  calculatorTitle: "Federal Employee Retirement System (FERS) Pension Projection",
  calculatorDescription:
    "Calculate your Federal Employee Retirement System (FERS) pension based on type of retirement, years of service, high-3 salary, and retirement age.",
  calculatorRoute: "/calculators/fers-pension",
  scenarioTitle: "Federal Employee Retirement System (FERS) Pension Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your Federal Employee Retirement System (FERS) pension based on type of retirement, years of service, high-3 salary, and retirement age.",
  scenarioRoute: "/calculators/fers-pension/scenarios",
  chartTitle: "Income and Pension Over Time",
  assumptions: [
    "Salary grows annually by a fixed percentage until retirement. The average of your highest 3 years of salary before retirement is used to calculate your pension.",
    "Pension multiplier is typically 1% or 1.1% based on your age and service years.",
    "Cost-of-Living Adjustments (COLA) start applying after age 62, increasing your pension annually by the estimated COLA percentage.",
    "This calculator assumes a simplified model for illustrative purposes. Actual FERS pension calculations may include additional factors like retirement type and survivor benefits.",
  ],
  initialFormValues: {
    startYear: new Date().getFullYear(),
    birthYear: 1970,
    serviceStartYear: 1990,
    serviceEndYear: 2010,
    retirementAge: 62,
    currentSalary: 85000,
    salaryGrowthRate: 3,
    high3Salary: 100000,
    colaPercent: 2,
    pensionMultiplier: 1.1,
    yearsToProject: 40,
    retirementType: 'regular',
  },
};

export const fersPensionFieldConfigs: FormFieldConfig<FersPensionInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying pension and final salary',
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
    name: 'retirementType',
    label: 'Retirement Type',
    type: 'select',
    options: [
      { value: 'regular', label: 'Immediate (Regular)' },
      { value: 'mra10', label: 'MRA + 10 (Reduced Pension)' },
      { value: 'early', label: 'Early (Involuntary)' },
      { value: 'deferred', label: 'Deferred (No Immediate Pension)' },
    ],
    helperText: 'Choose the applicable retirement type based on your eligibility',
  },
  {
    name: 'serviceStartYear',
    label: 'Service Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year you began federal service under FERS',
  },
  {
    name: 'serviceEndYear',
    label: 'Service End Year',
    min: 1900,
    step: 1,
    helperText: 'Year you ended federal service under FERS',
    shouldDisplay: (values) => (!!values && values.retirementType === "deferred"), // hide if retirement type is not deferred
  },
  {
    name: 'retirementAge',
    label: 'Retirement Age',
    min: 40,
    max: 80,
    step: 1,
    helperText: 'Age you plan to retire and start collecting pension',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
  {
    name: 'currentSalary',
    label: 'Current Salary ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Your current annual basic salary',
    shouldDisplay: (values) => (!!values && values.retirementType !== "deferred"), // hide if retirement type is deferred
  },
  {
    name: 'salaryGrowthRate',
    label: 'Salary Growth Rate (%)',
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Estimated annual increase in salary before retirement',
    shouldDisplay: (values) => (!!values && values.retirementType !== "deferred"), // hide if retirement type is deferred
  },
  {
    name: 'high3Salary',
    label: 'High-3 Salary ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Average of the highest basic pay earned during any three consecutive years of service',
    shouldDisplay: (values) => (!!values && values.retirementType === "deferred"), // hide if retirement type is deferred
  },
  {
    name: 'colaPercent',
    label: 'COLA Estimate (%)',
    min: 0,
    max: 10,
    step: 0.1,
    helperText: 'Annual cost-of-living adjustment after retirement',
  },
  {
    name: 'pensionMultiplier',
    label: 'Pension Multiplier (%)',
    type: 'select',
    options: [
      { value: '1.0', label: '1.0%: Standard Annuity' },
      { value: '1.1', label: '1.1%: Enhanced Annuity' },
      { value: '1.7', label: '1.7%: Special Provision Employees' },
    ],
    helperText: 'Typically 1% or 1.1%, depending on age and service',
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    min: 1,
    max: 80,
    step: 1,
    helperText: 'Number of years to show pension income',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
];

export function getFersPensionProjectionColumns(editable: boolean = false): ColumnDef<FersPensionProjectionRow>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "salary", label: "Annual Salary ($)", currency: true, editable, min: 0 },
    { key: "salaryGrowthRate", label: "Salary Growth Rate (%)", editable, min: 0, max: 100 },
    { key: "colaApplied", label: "COLA Applied (%)", editable, min: 0, max: 100 },
    { key: "pension", label: "Annual Pension ($)", currency: true },
    { key: "monthlyPension", label: "Monthly Pension ($)", currency: true, hiddenOnMobile: true },
  ];
}

export function getFersPensionComparisonColumns(): ColumnDef<any>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "salary1", label: "Scenario 1 Salary ($)", currency: true },
    { key: "salary2", label: "Scenario 2 Salary ($)", currency: true },
    { key: "salaryDiff", label: "Salary Difference ($)", currency: true, isDifference: true },
    { key: "pension1", label: "Scenario 1 Pension ($)", currency: true },
    { key: "pension2", label: "Scenario 2 Pension ($)", currency: true },
    { key: "pensionDiff", label: "Pension Difference ($)", currency: true, isDifference: true },
  ];
}


export const fersPensionDataKeys: DataKeyOption<any>[] = [
  { key: "pension", label: "Annual Pension ($)" },
  { key: "salary", label: "Annual Salary ($)" },
] satisfies DataKeyOption<FersPensionProjectionRow>[];