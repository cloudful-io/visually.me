import { FormFieldConfig } from '@/types/forms';
import { FersPensionInput } from 'financial-calcs';

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
    shouldDisplay: (values) => values.retirementType === "deferred", // hide if retirement type is not deferred
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
    shouldDisplay: (values) => values.retirementType !== "deferred", // hide if retirement type is deferred
  },
  {
    name: 'salaryGrowthRate',
    label: 'Salary Growth Rate (%)',
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Estimated annual increase in salary before retirement',
    shouldDisplay: (values) => values.retirementType !== "deferred", // hide if retirement type is deferred
  },
  {
    name: 'high3Salary',
    label: 'High-3 Salary ($)',
    type: 'currency',
    min: 0,
    step: 1000,
    helperText: 'Average of the highest basic pay earned during any three consecutive years of service',
    shouldDisplay: (values) => values.retirementType === "deferred", // hide if retirement type is deferred
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
    min: 0,
    max: 2,
    step: 0.1,
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
