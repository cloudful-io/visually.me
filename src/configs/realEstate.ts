import { FormFieldConfig } from '@/types/forms';
import { RealEstatePropertyInput, RealEstatePropertyProjectionRow } from 'financial-calcs';
import { ColumnDef, DataKeyOption } from '@/types/forms';

export const realEstateFieldConfigs: FormFieldConfig<RealEstatePropertyInput, { isAuthenticated: boolean }>[] = [
  {
    name: 'startYear',
    label: 'Start Year',
    type: "number",
    min: 1900,
    step: 1,
    helperText: 'Year to begin displaying real estate income and expense',
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
    name: 'propertyType',
    label: 'Property Type',
    type: 'select',
    options: [
      { value: 'residence', label: 'Primary Home' },
      { value: 'rental', label: 'Rental Property' },
    ],
    helperText: 'Choose how the real estate property is being utilized',
  },
  {
    name: 'monthlyMortgage',
    label: 'Monthly Mortgage ($)',
    type: 'currency',
    min: 0,
    step: 100,
    helperText: 'Amount of principal and interest paid per month',
  },
  {
    name: 'mortgageEndYear',
    label: 'Last Year of Mortgage',
    type: "number",
    min: 2000,
    step: 1,
    helperText: 'Year you will pay off your mortgage',
  },
  {
    name: 'annualPropertyTax',
    label: 'Annual Property Tax ($)',
    type: 'currency',
    min: 0,
    step: 10,
    helperText: 'Amount of real estate property tax per year',
  },
  {
    name: 'propertyTaxIncreaseRate',
    label: 'Property Tax Increase Rate (%)',
    type: "number",
    min: 0,
    max: 100,
    step: 0.5,
    helperText: 'Estimated annual increase in real estate property tax',
  },
  {
    name: 'annualInsurance',
    label: 'Annual Homeowner and Private Mortgage Insurance ($)',
    type: 'currency',
    min: 0,
    step: 10,
    helperText: 'Amount of homeowner and private mortgage insurance per year',
  },
  {
    name: 'insuranceIncreaseRate',
    label: 'Insurance Increase Rate (%)',
    type: "number",
    min: 0,
    max: 100,
    step: 0.5,
    helperText: 'Estimated annual increase in homeowner and private mortgage insurance',
  },
  {
    name: 'monthlyHoaFee',
    label: 'Monthly Homeowner Association (HOA) Fee ($)',
    type: 'currency',
    min: 0,
    step: 10,
    helperText: 'Amount of Homeowner Association (HOA) fee per month',
  },
  {
    name: 'hoaFeeIncreaseRate',
    label: 'Homeowner Association (HOA) Fee Increase Rate (%)',
    type: "number",
    min: 0,
    max: 100,
    helperText: 'Estimated annual increase in homeowner association (HOA) fee',
  },
  {
    name: 'monthlyRentalIncome',
    label: 'Monthly Rental Income ($)',
    type: 'currency',
    min: 0,
    step: 10,
    helperText: 'Amount of rental income per month',
  },
  {
    name: 'rentalIncomeIncreaseRate',
    label: 'Rental Income Increase Rate (%)',
    type: "number",
    min: 0,
    max: 100,
    helperText: 'Estimated annual increase in rental income',
  },
  {
    name: 'yearsToProject',
    label: 'Years to Project',
    type: "number",
    min: 1,
    max: 80,
    step: 1,
    helperText: 'Number of years to show pension income',
    shouldDisplay: (_, ctx) => !(ctx?.isAuthenticated ?? false),
  },
];

export function getRealEstateProjectionColumns(editable: boolean = false, summary: boolean = false): ColumnDef<RealEstatePropertyProjectionRow>[] {
  if (summary) {
    return [
      { key: "year", label: "Year" },
      { key: "age", label: "Age" },
      { key: "monthlyIncome", label: "Monthly Income ($)", currency: true,  },
      { key: "annualIncome", label: "Annual Income ($)", currency: true, hiddenOnMobile: true },
      { key: "monthlyExpense", label: "Monthly Expense ($)", currency: true, },
      { key: "annualExpense", label: "Annual Expense ($)", currency: true, hiddenOnMobile: true },
      { key: "netCashFlow", label: "Net Monthly Cash Flow($)", currency: true, editable, min: 0 },

    ];
  }
  else {
    return [
      { key: "year", label: "Year" },
      { key: "age", label: "Age" },
      { key: "monthlyRentalIncome", label: "Monthly Rental Income ($)", currency: true, editable, min: 0 },
      { key: "monthlyMortgage", label: "Monthly Mortgage Payment ($)", currency: true, editable, min: 1 },
      { key: "annualPropertyTax", label: "Annual Property Tax ($)", currency: true, editable, min: 0 },
      { key: "annualInsurance", label: "Annual Insurance ($)", currency: true, editable, min: 0 },
      { key: "monthlyHoaFee", label: "Monthly HOA Fee ($)", currency: true, editable, min: 0 },
    ];
  }
}

export const realEstateDataKeys: DataKeyOption<any>[] = [
  { key: "monthlyRentalIncome", label: "Annual Income ($)" },
] satisfies DataKeyOption<RealEstatePropertyProjectionRow>[];