# College Savings and Tuition Projection

## Purpose
**[Verified]** Estimate whether a college savings balance and annual contributions can cover tuition across a selected college period. [Calculator configuration](../../../src/configs/collegeTuition.ts) · [projection hook](../../../src/hooks/useCollegeTuitionProjection.ts)

## User
**[Inferred]** A parent or saver planning for a student's future college costs.

## Inputs
**[Verified]** Start year; child's birth year; first and last college years; starting savings balance; annual contribution; estimated annual yield; first-year tuition; and tuition inflation rate. Both college-year fields are editable. When birth year changes, the form derives the first college year as birth year plus 18. When first college year changes, it derives the last year as first year plus three. [Field configuration](../../../src/configs/collegeTuition.ts)

**[Verified]** Initial balance defaults to $20,000 and is user-editable. [Calculator configuration](../../../src/configs/collegeTuition.ts)

**[Confirmed product decision]** A four-year college span is the default, not a fixed duration; users can specify different first and last college years.

## Outputs
**[Verified]** A year-by-year table includes child's age, beginning balance, contribution, yield rate, estimated tuition, annual withdrawal, and ending balance. The chart can show ending balance or tuition withdrawal. A summary reports whether the projection covers tuition, the first shortfall year and total shortfall, and, when relevant, an approximate annual contribution increase.

## Workflow
**[Verified]** The user edits assumptions and selects **Calculate**. The projection covers the start year through one year after the last college year. The tool reports the projection; it does not automatically save the form as a college account. See [Calculator Experience](overview.md) for shared chart, table, persistence, and scenario behavior.

## Business rules
**[Verified]** Tuition is zero outside the inclusive first-to-last college-year range. In college years, tuition grows from the first-year estimate using the annual inflation rate. Contributions continue through the last college year and then become zero. For unedited rows, annual withdrawal is capped at available funds, so it cannot exceed the projected tuition or available balance. If the projection falls short, the summary estimates a required annual contribution by searching from $0 to $100,000. This $100,000 is the search ceiling for the suggested contribution, not the initial balance default. [Contribution helper](../../../src/hooks/useCollegeTuitionProjection.ts) · [projection rules](../../../node_modules/financial-calcs/dist/college/tuition.js)

**[Verified]** Engine validation requires the first college year to be later than birth year, last college year to be no earlier than first year, positive starting balance and first-year tuition, and yield/inflation no lower than -100%. The form itself sets some different bounds, so engine validation remains relevant.

## Edge cases
**[Verified]** A zero starting balance or zero tuition estimate fails engine validation even though the form allows zero for those fields. If projected funds are short, the tool reports the first year with a tuition deficit and sums the shortfalls across deficit years.

**[Inferred]** If the required annual contribution exceeds the helper's $100,000 search ceiling, the displayed estimate may not be sufficient to cover tuition; the result does not explicitly flag that ceiling.

## Dependencies
**[Verified]** Uses the shared calculator form/results experience and `financial-calcs`. The same calculation function is registered for saved college-savings assets, but the separate college-savings summary page currently renders only its heading/container in the inspected implementation. [Asset registry](../../../src/lib/assets/registry.ts) · [college-savings page](../../../src/app/%28DashboardLayout%29/college-savings/page.tsx)

## Current limitations
**[Verified]** The displayed assumptions state that annual contributions are simplified to a single yearly deposit at the beginning of the year, contributions stop after the final college year, and tuition withdrawals do not drive the balance below zero. The model does not expose a school, aid package, or separate room-and-board input.

## Evidence and questions
