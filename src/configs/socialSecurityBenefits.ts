import { CalculatorConfig } from './calculatorConfig';
import { FormFieldConfig, FormFieldGroup } from '@/types/forms';
import { SocialSecurityBenefitInput, SocialSecurityBenefitProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';
import { IconBuildingBank } from "@tabler/icons-react";

export const socialSecurityConfig: CalculatorConfig<SocialSecurityBenefitInput> = {
  id: "social-security",
  icon: IconBuildingBank,
  shortTitle: "Social Security Calculator",
  calculatorTitle: "Social Security Benefit Projection",
  calculatorDescription:
    "Estimate your Social Security monthly benefits based on earnings, retirement age, and Cost-of-Living Adjustment (COLA).",
  calculatorRoute: "/calculators/social-security",
  scenarioTitle: "Social Security Benefit Scenario Comparison",
  scenarioDescription:
    "Build scenarios to compare your Social Security monthly benefits based on earnings, retirement age, and Cost-of-Living Adjustment (COLA). ",
  scenarioRoute: "/calculators/social-security/scenarios",
  chartTitle: "Annual Social Security Benefit Over Time",
  assumptions: [
    "This calculator uses a simplified formula to estimate Social Security benefits. It assumes a linear relationship between income and the Primary Insurance Amount (PIA), and uses your claiming age to adjust the benefit according to Social Security Administration (SSA) rules.",
    "The annual benefit increases each year after claiming based on your specified Cost-of-Living Adjustment (COLA), which averages around 2.6% historically but is not guaranteed.",
    "This tool assumes you begin collecting benefits at a fixed age and continue receiving them annually for the number of years you specify. It does not account for taxes, spousal benefits, or income-related reductions.",
  ],
  initialFormValues: {
    startYear: new Date().getFullYear(),
    birthYear: 1970,
    claimingAge: 67,
    averageIncome: 100000,
    averageCOLA: 2.5,
    yearsToProject: 45,
  },
};

const PERSONAL_INFO: FormFieldGroup = {
  id: 'personal',
  label: 'Personal Information',
};

const SALARY_INFO: FormFieldGroup = {
  id: 'salary',
  label: 'Salary and Benefit Information',
};

export const socialSecurityFieldConfigs: FormFieldConfig<SocialSecurityBenefitInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying data',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
    group: PERSONAL_INFO,
  },
  {
    name: 'birthYear',
    label: 'Birth Year',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
    group: PERSONAL_INFO,
  },
  {
    name: 'claimingAge',
    label: 'Planned Claiming Age',
    min: 62,
    max: 70,
    step: 1,
    helperText: 'You must be at least 62 to begin collecting benefits',
    group: PERSONAL_INFO,
  },
  {
    name: 'averageIncome',
    label: 'Average Annual Income ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Estimated average yearly earnings used to calculate benefit',
    group: SALARY_INFO,
  },
  {
    name: 'averageCOLA',
    label: 'Average COLA (%)',
    min: 0,
    max: 10,
    step: 0.1,
    helperText: 'Cost-of-Living Adjustment applied annually after claiming',
    group: SALARY_INFO,
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    min: 1,
    max: 80,
    step: 1,
    helperText: 'Number of years to show benefit projections',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
    group: PERSONAL_INFO,
  },
];

export function getSocialSecurityProjectionColumns(editable: boolean = false): ColumnDef<SocialSecurityBenefitProjectionRow>[] {
  return [
    { key: "year", label: "Year" },
    { key: "age", label: "Age" },
    { key: "colaApplied", label: "COLA Applied (%)", editable, min: 0, max: 100 },
    { key: "monthlyBenefit", label: "Monthly Benefit ($)", currency: true, hiddenOnMobile: true },
    { key: "annualBenefit", label: "Annual Benefit ($)", currency: true },
  ];
}

export const socialSecurityDataKeys: DataKeyOption<SocialSecurityBenefitProjectionRow>[] = [
  { key: "annualBenefit", label: "Annual Social Security Benefit ($)" },
] satisfies DataKeyOption<SocialSecurityBenefitProjectionRow>[];