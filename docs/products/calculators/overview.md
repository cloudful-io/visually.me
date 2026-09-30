# Calculator Experience

## Purpose
**[Verified]** The calculator area provides financial projections from user-entered assumptions. The six registered tools are College Savings & Tuition, FERS Pension, Military Pension, Mortgage Amortization, Retirement Savings & Withdrawal, and Social Security Benefit. They appear on the calculator index in title order and open from their own routes. [Calculator index](../../../src/app/%28DashboardLayout%29/calculators/page.tsx) · [registry](../../../src/lib/calculators/registry.tsx)

## User
**[Inferred]** People exploring possible future education costs, retirement income, pension benefits, or mortgage repayment. The tools accept estimates and display modeled outcomes; the implementation does not establish a user’s eligibility for benefits or provide individualized financial advice.

## Inputs
**[Verified]** Each tool presents a form configured for its subject. Values generally include years, ages, balances, rates, salaries, benefit assumptions, or loan terms. Inputs use numeric, currency, date, select, and boolean controls as appropriate. Field-level minimums and maximums are configured per calculator. See the individual calculator documents for fields and rules.

## Outputs
**[Verified]** After calculation, a tool can show a summary message, chart, and projection table. Charts start visible and can be hidden; the table highlights the current calendar year where applicable. The Mortgage Amortization table can switch between monthly rows and yearly aggregates. CSV export is available after rows exist and exports the current projection rows. Assumption notes are displayed when configured. [Calculator page](../../../src/app/%28DashboardLayout%29/calculators/%5Bid%5D/page.tsx)

## Workflow
**[Verified]** A user opens a calculator, edits fields, selects **Calculate**, then reviews its summary, chart, and table. Inputs are persisted in browser `localStorage` under a calculator-specific key; this is not a saved account record. Form values can remain visible after edits until the user calculates again. The calculation engine is the `financial-calcs` package. [Form persistence](../../../src/hooks/usePersistedForm.ts) · [dependency](../../../package.json)

**[Verified]** Each registered calculator also has a scenario route. Scenario 1 begins with defaults or the browser-persisted values. The user can copy Scenario 1 into Scenario 2, edit Scenario 2, and select **Compare Scenarios**. Results include a comparison chart and table; where multiple metrics are available, a control changes the chart metric. Reset returns both forms to their configured initial values. Scenario inputs use separate local-storage keys. [Scenario page](../../../src/app/%28DashboardLayout%29/calculators/%5Bid%5D/scenario/page.tsx)

## Business rules
**[Verified]** The form's configured field bounds can block the Calculate button. The calculation package also performs its own validation and returns errors for display. Standalone projections are generated on demand, not continuously as fields change.

**[Verified]** A calculator action calls the `increment_calc_count` Supabase RPC when the form has no field errors. The SQL schema defines a global `calculator_stats` count, not a per-user calculation history. The call is initiated without waiting for the calculation engine's result. [Stats service](../../../src/services/calculator-stats-service.ts) · [schema](../../../sql/schema.sql)

**[Inferred]** Because the statistics call is gated by form-field errors rather than calculation-engine success, an input that passes field-level checks but fails cross-field engine validation may still increment the global counter.

## Edge cases
**[Verified]** An unknown calculator ID resolves to a not-found page. Invalid calculator-engine inputs produce an error summary and no projection rows. A malformed saved local-storage value falls back to the configured initial values. Scenario comparison is disabled until Scenario 2 is present and both forms pass field-level checks.

## Dependencies
**[Verified]** The calculator index and routes use the registry, per-calculator field/column configuration, shared form/chart/table components, browser local storage, `financial-calcs`, and Supabase only for the global calculation counter. The underlying calculations do not read a calculator-specific Supabase record.

## Current limitations
**[Verified]** Standalone calculator values are saved in the current browser's local storage, not associated with an account in Supabase. Scenario mode has no CSV export. Standalone result tables pass non-editable columns, while editable year overrides are part of saved-asset workflows described in [Saved calculator projections](saved-projections.md).

**[Verified]** The standalone routes pass `isAuthenticated: false` to conditional field visibility, regardless of the actual session state. This affects fields whose configuration hides them for authenticated use.

## Evidence and questions
**[Needs human confirmation]** Should calculator inputs remain browser-local, or should users expect their standalone assumptions and scenarios to follow their account across devices?

**[Needs human confirmation]** Is the global calculation counter intended to count button attempts or only successful projections?
