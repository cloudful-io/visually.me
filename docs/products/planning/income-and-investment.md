# Income and Investment Management

## Purpose
**[Verified]** Let an authenticated user maintain modeled retirement income sources and investment balances, then review their combined projection over time. [Income summary page](../../../src/app/%28DashboardLayout%29/income/page.tsx)

## User
**[Inferred]** A user organizing projected pension, Social Security, and retirement-savings income, with optional spouse-owned records.

## Inputs
**[Verified]** Users can add, edit, and remove labeled records for FERS Pension, Uniformed Service Pension, Retirement Savings, or Social Security. Each type uses its matching calculator fields; when a spouse profile exists, the dialog lets the user assign the record to themselves or the spouse. [Income editor](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditIncomeSourcesDialog.tsx) · [add menu](../../../src/app/%28DashboardLayout%29/components/dashboard/AddIncomeCard.tsx)

## Outputs
**[Verified]** Source cards show individual records and link to a detail projection. The combined page provides an annual income-by-source chart or a retirement-savings-balance chart, plus a table with year, user age, optional spouse age, monthly and annual income, and investment balance. The chart marks target retirement years. [Income detail page](../../../src/app/%28DashboardLayout%29/income/%5Bid%5D/page.tsx)

## Workflow
**[Verified]** From Income and Investment, the user adds a source using the type menu, supplies a label and assumptions, and saves. Existing records can be edited or deleted after confirmation. A detail view allows editable projection values to be saved as year-specific overrides and reverted. More on shared saved-account behavior is in [Saved calculator projections](../calculators/saved-projections.md).

## Business rules
**[Verified]** Source calculations are selected by asset type. Profile start year, birth year, and life expectancy are merged into the calculation inputs; FERS also receives the profile target retirement age, and retirement-savings records receive target retirement age as their withdrawal start age. Combined income is the sum of each source's configured annual income field. Retirement savings balances are aggregated separately. [Asset registry](../../../src/lib/assets/registry.ts) · [combined projections](../../../src/lib/assets/useCombinedProjections.ts)

**[Verified]** Selecting the header's spouse toggle includes or excludes spouse-tagged records in combined income/property views. Its value is stored in browser local storage.

## Edge cases
**[Verified]** A source may have no projection rows if required profile attributes are missing or calculation fails. The detail page displays an unknown-asset or missing-calculator error if the stored type cannot be resolved. Deleting a source requires confirmation.

## Dependencies
**[Verified]** Uses `financial-calcs`, the asset registry, profile attributes, `/api/assets`, encrypted asset storage, chart/table components, and the spouse inclusion context. The saved asset API requires authentication. [Assets API](../../../src/app/api/assets/route.ts) · [asset service](../../../src/lib/assets/service.ts)

## Current limitations
**[Verified]** Only four saved income types are available in the add-source menu. Mortgage Amortization is not a saved income/asset type. Standalone calculator values are separate browser-local forms; they do not automatically create an income source. The checked-in SQL still defines a separate `income_sources` table, while the active service reads and writes `assets`.

**[Needs human confirmation]** The active asset service uses a `spouse` column not present in the checked-in `assets` SQL definition; deployed schema behavior is unknown.

## Evidence and questions
**[Needs human confirmation]** Should creating a saved income source also create or populate a standalone calculator form, or are these intentionally separate workflows?

**[Needs human confirmation]** Are any other income or investment types currently intended to be available beyond the four shown in the Add menu?
