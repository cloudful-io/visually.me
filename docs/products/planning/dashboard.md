# Financial Dashboard

## Purpose
**[Verified]** The Dashboard combines profile assumptions, saved income/investment assets, real-estate projections, children, and optional spouse data into a retirement-planning view. Its visible sections include financial profile cards, a Financial Timeline, income and investment breakdowns, and an overall income/expense/net cash-flow chart. [Dashboard page](../../../src/app/%28DashboardLayout%29/dashboard/page.tsx)

## User
**[Inferred]** An authenticated user reviewing modeled household income, investments, expenses, and dated financial milestones.

## Inputs
**[Verified]** The dashboard loads the user's profile attributes; saved income and property assets; optional spouse attributes/assets; and child records. A user can select the age for the income and investment breakdowns. The target retirement age defaults to 60 in component state and is replaced by the saved profile value when available. [Breakdown components](../../../src/app/%28DashboardLayout%29/components/dashboard/IncomeBreakdown.tsx) · [asset aggregation](../../../src/lib/assets/useCombinedProjections.ts)

## Outputs
**[Verified]** Income and investment cards show a per-source breakdown at the selected age and compare the selected value with the year before target retirement age. The line chart aggregates annual income and real-estate expenses into net cash flow. The timeline can show current year, user/spouse retirement and life-expectancy years, first positive income years, property mortgage payoff years, and children's first college years. [Timeline](../../../src/app/%28DashboardLayout%29/components/dashboard/FinancialTimeline.tsx) · [cash-flow calculation](../../../src/lib/dashboard/util.ts)

## Workflow
**[Verified]** A user opens Dashboard, reviews profile and child cards, edits those records in dialogs, and selects an age in the breakdown cards. The spouse asset toggle in the desktop header filters spouse-tagged income sources on Dashboard; its selection is stored in browser local storage. Dashboard loads real-estate properties with the default joint setting regardless of this toggle. The separate Real Estate page applies the toggle to properties. [Header](../../../src/app/%28DashboardLayout%29/layout/header/Header.tsx) · [dashboard data hooks](../../../src/app/%28DashboardLayout%29/dashboard/page.tsx) · [spouse toggle state](../../../src/contexts/IncludeSpouseContext.tsx)

## Business rules
**[Verified]** Combined income sums the configured income key(s) for each income-source asset. Retirement Savings contributes its ending balance to investment balances. Real estate contributes annual income and expense; dashboard net cash flow is annual income minus annual expense. Combined projection rows are produced only when a primary birth year and projection rows are available. [Asset registry](../../../src/lib/assets/registry.ts) · [combined projections](../../../src/lib/assets/useCombinedProjections.ts)

**[Verified]** The dashboard timeline derives retirement and life-expectancy years by adding ages to birth years. It uses each income asset's first positive year, property mortgage end year, and a child's college start year as timeline events.

## Edge cases
**[Verified]** If no combined projection rows or primary birth year are available, age breakdowns can render no selected row and combined tables can be empty. Spouse profile details appear only when a spouse attribute record exists. The spouse toggle is hidden on mobile in the header.

## Dependencies
**[Verified]** Depends on profile and child APIs, asset loading/computation, income and property calculation engines, local-storage spouse preference, and shared chart/timeline components. Data APIs return unauthorized for unauthenticated requests. [User attributes API](../../../src/app/api/user-attributes/route.ts) · [children API](../../../src/app/api/user-children/route.ts) · [assets API](../../../src/app/api/assets/route.ts)

## Current limitations
**[Verified]** Dashboard figures are calculated projections from saved assumptions, not imported financial-account balances. The timeline shows a child's college start milestone but does not generate or connect a college-savings projection. The spouse toggle controls asset inclusion; it does not establish a linked account relationship.

**[Inferred]** Because the dashboard combines every loaded asset row with a matching year, totals can omit years when an asset projection has no row for that year.

## Evidence and questions
**[Needs human confirmation]** Should age breakdown comparisons always use the year immediately before the saved target retirement age, or is that comparison intended to vary with selected age?

**[Needs human confirmation]** Should children and spouse records be included in the same dashboard projection model as the primary user, and should the spouse asset toggle be available on mobile?
