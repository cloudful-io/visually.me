# Retirement Savings and Withdrawal Projection

## Purpose
**[Verified]** Project retirement-account balances, contributions, investment yield, and withdrawals over time, including an optional required minimum distribution (RMD) estimate. [Calculator configuration](../../../src/configs/retirementSavings.tsx) · [projection hook](../../../src/hooks/useRetirementSavingsProjection.ts)

## User
**[Inferred]** A saver planning how contributions and withdrawals may affect a retirement balance over a chosen lifetime horizon.

## Inputs
**[Verified]** Start year, birth year, initial balance, initial annual contribution, estimated yield, withdrawal rate, contribution increase rate, whether the account is subject to RMD, withdrawal start age, and life expectancy age. Defaults include $200,000 initial balance, $23,000 contribution, 6% yield, 5% withdrawal rate, 2% contribution increase, and age 60 for withdrawals. [Field configuration](../../../src/configs/retirementSavings.tsx)

## Outputs
**[Verified]** A yearly projection includes age, beginning and ending balance, contribution, yield, withdrawal rate, annual and monthly withdrawal, and RMD when enabled. The chart can compare ending balance and annual withdrawal. A summary warns when annual withdrawal first falls below the prior year; otherwise it reports the final projected withdrawal and balance.

## Workflow
**[Verified]** The user supplies assumptions and selects **Calculate**, then reviews the projection, summary, chart, or table. The scenario route supports comparing two sets of assumptions. See [Calculator Experience](overview.md) for shared form persistence, comparison, and export behavior.

**[Verified]** The same projection can power a saved Retirement Savings income source. In that workflow, account fields can inherit start year, birth year, life expectancy, and withdrawal start age from the user's profile, and year-specific results can be overridden. [Saved projections](saved-projections.md)

## Business rules
**[Verified]** The projection runs from the selected start year through the year matching life expectancy. Before the withdrawal-start age, contributions grow by the contribution-increase rate and withdrawals are zero. At and after that age, automatic contributions stop and the configured withdrawal rate is applied to the beginning balance. [Calculation package](../../../node_modules/financial-calcs/dist/retirement/savings.js)

**[Verified]** When RMD is enabled, a separate RMD amount is reported using a built-in distribution table and birth-year-based starting age. The code does not raise the modeled annual withdrawal to meet the RMD; the RMD column is informational. The installed table covers ages 72 through 120, clamping ages outside that range.

## Edge cases
**[Verified]** Engine validation rejects yields below -100%, negative withdrawal rates, contribution increases below -100%, invalid projection horizons, and life-expectancy years before the start year. The form has narrower bounds for some fields, including withdrawal start age 50–73 and yield at least 0%.

**[Inferred]** A reported RMD can exceed the separately modeled annual withdrawal without an automatic correction or a dedicated warning in the summary.

## Dependencies
**[Verified]** Uses shared calculator components and `financial-calcs`; saved income-source projections also use profile attributes and the Supabase-backed asset workflow. See [asset registry](../../../src/lib/assets/registry.ts).

## Current limitations
**[Verified]** The assumptions state that contributions increase by a fixed percentage, are added at year-end, and withdrawals use a fixed rate. The projection is annual and does not model contribution timing through the year, changing legal contribution caps, taxes, or individualized RMD account rules. The assumption note describes RMD applicability as a simplified rule.

## Evidence and questions
**[Needs human confirmation]** Should the RMD output remain informational, or is it expected to constrain the withdrawal recommendation?

**[Needs human confirmation]** Which account types and current RMD eligibility rules should the product represent?
