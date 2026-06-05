import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig } from '@/types/forms';
import { MilitaryPensionInput, MilitaryPensionProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';
import { IconMilitaryRank } from "@tabler/icons-react";

export const militaryPensionConfig: CalculatorConfig<MilitaryPensionInput> = {
  id: "military-pension",
  icon: IconMilitaryRank,
  shortTitle: "Uniformed Service (Military) Pension",
  calculatorTitle: "Uniformed Service (Military) Pension Projection",
  calculatorDescription:
    "Calculate your Uniformed Service (Military) pension based on retirement system, years of service, high-36 salary.",
  calculatorRoute: "/calculators/military-pension",
  scenarioTitle: "Uniformed Service (Military) Pension Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your Uniformed Service (Military) pension based on retirement syste, years of service, and high-36 salary.",
  scenarioRoute: "/calculators/military-pension/scenario",
  chartTitle: "Pension Over Time",
  assumptions: [
    "Calculator currently does not support REDUX or Disability retirement plan.",
    "Calculator currently only supports service members retiring from Active Duty.",
  ],
  initialFormValues: {
    startYear: new Date().getFullYear(),
    birthYear: 1990,
    serviceStartYear: 2010,
    serviceEndYear: 2030,
    high3Salary: 5000,
    colaPercent: 2,
    lifeExpectancyAge: 85,
    retirementType: 'brs',
  },
};

export const militaryPensionFieldConfigs: FormFieldConfig<MilitaryPensionInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    type: "number",
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying projection data',
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
    name: 'retirementType',
    label: 'Retirement Type',
    type: 'select',
    options: [
      { value: 'high3', label: 'High-36' },
      { value: 'brs', label: 'Blended Retirement System (BRS)' },
    ],
    helperText: 'Choose the applicable retirement plan (currently does not support REDUX or Disability)',
  },
  {
    name: 'serviceStartYear',
    label: 'Service Start Year',
    type: "number",
    min: 1900,
    step: 1,
    helperText: 'Year you began military service',
  },
  {
    name: 'serviceEndYear',
    label: 'Service End Year',
    type: "number",
    min: 1900,
    step: 1,
    helperText: 'Year you ended military service',
  },
  {
    name: 'high3Salary',
    label: 'High-36 Salary ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Average of the highest 36 months of basic pay (Monthly Salary)',
  },
  {
    name: 'colaPercent',
    label: 'COLA Estimate (%)',
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    helperText: 'Annual cost-of-living adjustment after retirement',
  },
  {
    name: 'lifeExpectancyAge',
    label: 'Life Expectancy Age',
    type: "number",
    min: 1,
    max: 150,
    step: 1,
    helperText: 'Your estimated life expectancy',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
];

export function getMilitaryPensionProjectionColumns(editable: boolean = false): ColumnDef<MilitaryPensionProjectionRow>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "colaApplied", label: "COLA Applied (%)", editable, min: 0, max: 100 },
    { key: "pension", label: "Annual Pension ($)", currency: true },
    { key: "monthlyPension", label: "Monthly Pension ($)", currency: true, hiddenOnMobile: true },
  ];
}

export function getMilitaryPensionScenarioColumns(): ColumnDef<any>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "pension1", label: "Scenario 1 Pension ($)", currency: true },
    { key: "pension2", label: "Scenario 2 Pension ($)", currency: true },
    { 
      key: "pensionDiff", 
      label: "Pension Difference ($)", 
      currency: true, 
      getCellSx: (value, row) => {
        const isNegative = Number(value) < 0;
        const isZero = Number(value) === 0;

        return {
          color: isZero ? "text.primary" : 
            isNegative
            ? "error.main"
            : "success.main",
          fontWeight: isZero ? 400 : 800,
        };
      },
    },
  ];
}

export const militaryPensionDataKeys: DataKeyOption<any>[] = [
  { key: "pension", label: "Annual Pension ($)" },
] satisfies DataKeyOption<MilitaryPensionProjectionRow>[];