import { FormFieldConfig } from '@/types/forms';

export type FersPensionFormValues = {
  startYear: number;
  birthYear: number;
  serviceStartYear: number;
  retirementAge: number;
  currentSalary: number;
  salaryGrowthRate: number;
  colaPercent: number;
  retirementType: 'regular' | 'mra10' | 'early' | 'deferred';
  pensionMultiplier: number;
  yearsToProject: number;
};

export const fersPensionFieldConfigs: FormFieldConfig<FersPensionFormValues>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying pension and final salary',
  },
  {
    name: 'birthYear',
    label: 'Birth Year',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
  },
  {
    name: 'serviceStartYear',
    label: 'Service Start Year',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    helperText: 'Year you began federal service under FERS',
  },
  {
    name: 'retirementAge',
    label: 'Retirement Age',
    min: 50,
    max: 80,
    step: 1,
    helperText: 'Age you plan to retire and start collecting pension',
  },
  {
    name: 'currentSalary',
    label: 'Current Salary ($)',
    min: 0,
    step: 1000,
    helperText: 'Your current annual basic salary',
  },
  {
    name: 'salaryGrowthRate',
    label: 'Salary Growth Rate (%)',
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Estimated annual increase in salary before retirement',
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
  },
];
