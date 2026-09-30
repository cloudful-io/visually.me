# Mortgage Amortization

## Purpose
**[Verified]** Show how a fixed-rate mortgage payment is divided between principal and interest, and how extra monthly payments change the remaining balance. [Calculator configuration](../../../src/configs/mortgageAmortization.ts) · [projection hook](../../../src/hooks/useMortgageAmortization.ts)

## User
**[Inferred]** A borrower or homebuyer comparing repayment timelines and monthly principal reduction.

## Inputs
**[Verified]** Loan amount, annual interest rate, term in years, extra monthly payment, and mortgage start date. Defaults are a $300,000 loan, 6% annual rate, 30-year term, no extra payment, and the current date. [Field configuration](../../../src/configs/mortgageAmortization.ts)

## Outputs
**[Verified]** A monthly amortization schedule gives payment date, total payment, principal, interest, and remaining balance. The table can display monthly rows or yearly totals; the chart displays remaining balance by loan year. CSV export contains the monthly projection rows.

## Workflow
**[Verified]** The user enters loan assumptions and selects **Calculate**. The chart and table appear with the schedule; the user may hide the chart, change the table aggregation, export CSV, or use the scenario route to compare two loan assumptions. See [Calculator Experience](overview.md) for shared behavior.

## Business rules
**[Verified]** The engine calculates a fixed monthly principal-and-interest payment using the standard amortization formula. At a zero interest rate, the base payment is the loan amount divided by the number of months. Each month, interest is calculated on the outstanding balance; the extra payment is applied to principal, and the final payment is capped at the remaining principal. [Calculation package](../../../node_modules/financial-calcs/dist/mortgage/amortization.js)

**[Verified]** Engine validation requires a positive loan amount and term, non-negative annual interest, and non-negative extra payment. The configured form permits a term up to 50 years.

## Edge cases
**[Verified]** The schedule stops once the balance is at most one cent or the configured number of monthly payments has elapsed. A zero-rate loan is supported. Extra payments can shorten the schedule; the last payment is limited to the remaining balance plus that month's interest.

## Dependencies
**[Verified]** Uses `financial-calcs` for monthly amortization and yearly grouping, and shared calculator form, chart, table, CSV, and scenario components. It is not registered as a saved income or asset type. [Registry](../../../src/lib/calculators/registry.tsx) · [schema asset types](../../../sql/schema.sql)

## Current limitations
**[Verified]** The displayed assumptions specify that the rate remains fixed, the regular payment remains constant, the loan begins immediately with the first payment one month after the start date, and extra principal has no penalty or restriction. Taxes, homeowner insurance, HOA fees, and PMI are excluded from the payment calculation.

**[Inferred]** Scenario comparison operates on monthly projection rows keyed by loan year and presents the last row for each year as that year's balance; it does not provide a comparison of total interest paid or payoff-date savings.

## Evidence and questions
**[Needs human confirmation]** Should the comparison explicitly emphasize interest savings and payoff date, or is balance-by-year the intended comparison?

**[Needs human confirmation]** Are additional loan types, fees, escrow, or variable interest rates in scope for the current product?
