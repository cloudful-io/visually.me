import { FormFieldConfig } from '@/types/forms';
import { CollegeTuitionInput } from 'financial-calcs';

export const collegeTuitionFieldConfigs: FormFieldConfig<CollegeTuitionInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying college savings and tuition',
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
    name: 'childBirthYear',
    label: "Child's Birth Year",
    min: 1900,
    step: 1,
  },  
  {
    name: 'childCollegeFirstYear',
    label: "Child's First Year of College",
    min: 2000,
    step: 1,
  },  
  {
    name: 'childCollegeLastYear',
    label: "Child's Last Year of College",
    min: 2000,
    step: 1,
  },  
  {
    name: 'initialBalance',
    label: 'Initial Balance ($)',
    min: 0,
    step: 1000,
    helperText: 'Balance of college savings at Start Year',
  },
  {
    name: 'annualContribution',
    label: 'Annual Contribution ($)',
    min: 0,
    step: 100,
    helperText: 'Annual contribution each year',
  },
  {
    name: 'estimatedYield',
    label: 'Estimated Annual Yield (%)',
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'estimatedFirstYearTuition',
    label: 'Estimated First Year Tuition ($)',
    min: 0,
    max: 200000,
    step: 100,
    helperText: 'Estimated college tuition at first year in future dollar'
  },
  {
    name: 'estimatedInflationRate',
    label: 'Estimated Inflation Rate (%)',
    min: 0,
    max: 100,
    step: 0.1,
    helperText: 'Estimated inflation rate to calculate rising college tuition',
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    min: 1,
    max: 40,
    step: 1,
    helperText: 'Number of years to show savings and withdraw projections',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
];