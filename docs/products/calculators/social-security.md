# Social Security Benefit Projection

## Purpose
**[Verified]** Estimate monthly and annual Social Security retirement benefits from average annual income, planned claiming age, and a user-supplied cost-of-living adjustment (COLA). [Calculator configuration](../../../src/configs/socialSecurityBenefits.ts) · [projection hook](../../../src/hooks/useSocialSecurityBenefitProjection.ts)

## User
**[Inferred]** A person comparing benefit estimates at different claiming ages or COLA assumptions.

## Inputs
**[Verified]** Start year, birth year, planned claiming age, average annual income, average COLA, and life expectancy age. Defaults are current start year, birth year 1970, claiming age 67, $100,000 average income, 2.5% COLA, and age 85. The claiming-age form range is 62–70. [Field configuration](../../../src/configs/socialSecurityBenefits.ts)

## Outputs
**[Verified]** A yearly projection shows age, COLA applied, monthly benefit, and annual benefit. The chart plots annual benefit. The summary reports the first and last ages with positive benefits, years receiving benefits, and the sum of projected lifetime benefits.

## Workflow
**[Verified]** The user enters assumptions and selects **Calculate**. The scenario route compares two sets of assumptions and reports yearly benefit differences. The same calculation can power a saved Social Security income source. See [Calculator Experience](overview.md) and [Saved calculator projections](saved-projections.md).

## Business rules
**[Verified]** Benefit rows are zero until the claiming year. The engine estimates monthly PIA from one average annual income value, caps that income at $176,100, and uses fixed 2025 bend points and progressive percentages. It adjusts for claiming age relative to estimated full retirement age, then applies COLA in later claiming years. Annual and monthly benefit values are rounded to whole dollars. [Calculation package](../../../node_modules/financial-calcs/dist/socialSecurity/benefit.js)

**[Verified]** Engine validation requires average income greater than zero, claiming age of at least 62, non-negative COLA, and a projection that extends beyond the start year. The code caps delayed-retirement credits at age 70.

## Edge cases
**[Verified]** The form allows average income of $0, but the calculation engine rejects zero. The form caps COLA at 10%, while the engine's validation only rejects negative values. A claim age after 70 is not offered by the form; the engine's adjustment also stops increasing after 70.

## Dependencies
**[Verified]** Uses `financial-calcs`, shared calculator UI, and the global calculation counter. Saved-income mode also uses profile attributes and the Supabase-backed asset workflow. [Asset registry](../../../src/lib/assets/registry.ts)

## Current limitations
**[Verified]** The visible assumptions describe the formula as simplified and exclude taxes, spousal benefits, and income-related reductions. The implementation uses one average-income amount; it does not calculate an earnings record using a user's actual 35 highest indexed years. The installed package contains an AIME helper, but the projection calls the single-income estimate instead. The bend points and taxable maximum are fixed 2025 values in the installed dependency.

## Evidence and questions
**[Needs human confirmation]** Should the displayed estimate follow current SSA parameters at runtime, or is a fixed-year illustrative estimate intentional?

**[Needs human confirmation]** Should the product collect earnings history, spousal details, or tax assumptions, or are these exclusions intentional?
