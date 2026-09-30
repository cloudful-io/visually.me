# Retirement Savings and Withdrawal Projection

## Purpose
**[Verified]** Project retirement-account balances, contributions, investment yield, and withdrawals over time, including an optional required minimum distribution (RMD) estimate. [Calculator configuration](../../../src/configs/retirementSavings.tsx) · [projection hook](../../../src/hooks/useRetirementSavingsProjection.ts)

## User
**[Inferred]** A saver planning how contributions and withdrawals may affect a retirement balance over a chosen lifetime horizon.

## Inputs
**[Verified]** Start year, birth year, initial balance, initial annual contribution, estimated yield, withdrawal rate, contribution increase rate, whether the account is subject to RMD, withdrawal start age, and life expectancy age. Defaults include $200,000 initial balance, $23,000 contribution, 6% yield, 5% withdrawal rate, 2% contribution increase, and age 60 for withdrawals. [Field configuration](../../../src/configs/retirementSavings.tsx)

**[Confirmed product decision]** This calculator is intended for any type of retirement savings account, including Traditional or Roth IRAs and 401(k)s. Users specify whether the account is subject to RMD; applicability is not inferred from the account type.

## Outputs
**[Verified]** A yearly projection includes age, beginning and ending balance, contribution, yield, withdrawal rate, annual and monthly withdrawal, and RMD when enabled. The chart can compare ending balance and annual withdrawal. A summary warns when annual withdrawal first falls below the prior year; otherwise it reports the final projected withdrawal and balance.

## Workflow
**[Verified]** The user supplies assumptions and selects **Calculate**, then reviews the projection, summary, chart, or table. The scenario route supports comparing two sets of assumptions. See [Calculator Experience](overview.md) for shared form persistence, comparison, and export behavior.

**[Verified]** The same projection can power a saved Retirement Savings income source. In that workflow, account fields can inherit start year, birth year, life expectancy, and withdrawal start age from the user's profile, and year-specific results can be overridden. [Saved projections](saved-projections.md)

## Business rules
**[Verified]** The projection runs from the selected start year through the year matching life expectancy. Before the withdrawal-start age, contributions grow by the contribution-increase rate and withdrawals are zero. At and after that age, automatic contributions stop and the configured withdrawal rate is applied to the beginning balance. [Calculation package](../../../node_modules/financial-calcs/dist/retirement/savings.js)

**[Verified]** When RMD is enabled, a separate RMD amount is reported using a built-in distribution table and birth-year-based starting age. The code does not raise the modeled annual withdrawal to meet the RMD; the RMD column is informational. The installed table covers ages 72 through 120, clamping ages outside that range.

**[Verified]** The RMD cell is red when RMD exceeds the modeled annual withdrawal, green when the withdrawal meets or exceeds a nonzero RMD, and neutral when RMD is zero. [Table column configuration](../../../src/configs/retirementSavings.tsx)

**[Confirmed product decision]** RMD remains informational; it does not constrain the user's modeled withdrawal. Users may model a withdrawal below RMD and see the indicator; actual withdrawal choices may have tax consequences.

## Edge cases
**[Verified]** Engine validation rejects yields below -100%, negative withdrawal rates, contribution increases below -100%, invalid projection horizons, and life-expectancy years before the start year. The form has narrower bounds for some fields, including withdrawal start age 50–73 and yield at least 0%.

**[Verified]** A reported RMD can exceed the separately modeled annual withdrawal without an automatic correction or a summary warning; the RMD cell itself indicates this condition. The model does not calculate the tax consequences of a different withdrawal.

## Dependencies
**[Verified]** Uses shared calculator components and `financial-calcs`; saved income-source projections also use profile attributes and the Supabase-backed asset workflow. See [asset registry](../../../src/lib/assets/registry.ts).

## Current limitations
**[Verified]** The assumptions state that contributions increase by a fixed percentage, are added at year-end, and withdrawals use a fixed rate. The projection is annual and does not model contribution timing through the year, changing legal contribution caps, taxes, or individualized RMD account rules. The assumption note describes RMD applicability as a simplified rule. The user-selected RMD toggle is not validated against the selected account type.

**[Confirmed product decision]** Tax calculations are not part of this projection; actual tax consequences of withdrawal choices are outside the calculator's output.

## Evidence and questions
The all-account-type scope, user-selected RMD applicability, and informational RMD indicator are confirmed product decisions. Current policy and account-specific rules represented by the calculation engine remain simplified implementation behavior.
