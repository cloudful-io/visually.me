# Military Pension Projection

## Purpose
**[Verified]** Estimate annual and monthly military pension from service dates, a selected retirement system, High-36 monthly basic pay, and COLA assumptions. [Calculator configuration](../../../../src/configs/militaryPension.ts) · [projection hook](../../../../src/hooks/useMilitaryPensionProjection.ts)

## User
**[Inferred]** An active-duty service member estimating pension income after qualifying service.

## Inputs
**[Verified]** Start year, birth year, service start and end years, High-36 average monthly basic pay, COLA estimate, life expectancy, and retirement system. Choices are High-36 and Blended Retirement System (BRS). The default is BRS, with $5,000 High-36 monthly pay and 2% COLA. [Field configuration](../../../../src/configs/militaryPension.ts)

## Outputs
**[Verified]** Yearly rows include age, COLA, annual pension, and monthly pension. The chart shows pension over time. The summary estimates the first/last ages receiving a positive pension and total lifetime pension across projected rows.

## Workflow
**[Verified]** The user supplies service and pay assumptions and selects **Calculate**. Scenario mode compares two assumption sets. The same projection can be used for a saved Uniformed Service income source, with editable year-specific overrides. See [Calculator Experience](../overview.md) and [Saved calculator projections](../saved-projections.md).

## Business rules
**[Verified]** The engine calculates years of service as service end year minus service start year and requires at least 20 years. It requires service to begin at age 17 or later and a positive High-36 pay value. The starting monthly pension uses 2.5% per service year for High-36 or 2% for BRS, multiplied by the supplied High-36 monthly pay. Annual pension is monthly pension times 12. COLA applies in retirement years after the service-end year. [Calculation package](../../../../node_modules/financial-calcs/dist/pension/military.js)

## Edge cases
**[Verified]** The form's salary helper identifies High-36 pay as monthly, although its field label only says dollars. A service period shorter than 20 years fails engine validation. If the projection starts after service ends, the engine applies intervening COLA increases before the first projected year.

## Dependencies
**[Verified]** Uses `financial-calcs`, shared calculator forms/charts, and the saved-asset workflow when configured as an income source. [Asset registry](../../../../src/lib/assets/registry.ts)

## Current limitations
**[Verified]** The displayed assumptions explicitly say REDUX and disability retirement are unsupported and the calculator supports only active-duty retirement. The model does not request reserve component service or break service details. It is a simplified estimate, not an official military retirement determination.

## Evidence and questions
**[Needs human confirmation]** Is the High-36 input intended to always be monthly basic pay, including for saved accounts?

**[Needs human confirmation]** Are reserve-component retirement, disability, or REDUX estimates intentionally out of scope?
