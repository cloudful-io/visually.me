# FERS Pension Projection

## Purpose
**[Verified]** Project federal employee salary and pension income under a selected FERS retirement type, including a simplified survivor-benefit reduction and post-retirement COLA. [Calculator configuration](../../../../src/configs/fersPension.ts) · [projection hook](../../../../src/hooks/useFersPensionProjection.ts)

## User
**[Inferred]** A current or former federal employee estimating a future or deferred pension.

## Inputs
**[Verified]** Start year, birth year, retirement type, service start/end years, retirement age, current salary and salary growth, High-3 salary for deferred retirement, COLA, pension multiplier, survivor-benefit option, and life expectancy. Retirement types shown are Immediate (Regular), MRA + 10, Early (Involuntary), and Deferred. Salary fields change with retirement type: deferred mode asks for High-3 salary; other modes ask for current salary and growth. [Field configuration](../../../../src/configs/fersPension.ts)

## Outputs
**[Verified]** Annual rows include age, salary, salary growth, COLA, annual pension, and monthly pension. The chart compares annual salary and pension. A summary estimates the first and last pension ages, years receiving a pension, and total lifetime pension in the projection.

## Workflow
**[Verified]** The user enters assumptions and selects **Calculate**. Scenario mode compares two retirement assumptions. The same projection can back a saved FERS income source, where profile target retirement age is used and editable yearly overrides can be saved. See [Calculator Experience](../overview.md) and [Saved calculator projections](../saved-projections.md).

**[Verified]** The standalone FERS calculator exposes retirement age as an editable input, as confirmed by the product owner. In saved-income editing, the retirement-age field is hidden and the profile target retirement age is supplied to the calculation.

## Business rules
**[Verified]** The engine projects salary growth until retirement, derives a High-3 average from the final three projected salary years except for deferred retirement, and estimates pension using years of service, selected multiplier, retirement-type reduction, and survivor reduction. It applies the selected COLA to pension rows after age 62 according to the calculation package. Eligibility checks vary by retirement type, age, and service years. [Calculation package](../../../../node_modules/financial-calcs/dist/pension/fers.js)

**[Verified]** Deferred mode uses service start/end years to calculate service, requires a positive supplied High-3 salary, and hides current salary and salary growth. The form's selected age range is 40–80. Engine validation also checks service eligibility and requires the modeled life-expectancy year to reach the start year.

## Edge cases
**[Verified]** A selected retirement type or service history can fail engine eligibility validation even when individual fields are within their displayed bounds. The configured form allows zero current salary, but the engine requires current salary greater than zero. Deferred users need a High-3 salary; non-deferred users use projected salary history instead.

## Dependencies
**[Verified]** Uses `financial-calcs`, shared calculator forms and charts, and (for saved income assets) user attributes and the `assets` data workflow. The global calculator counter is incremented on eligible Calculate actions. [Asset registry](../../../../src/lib/assets/registry.ts)

## Current limitations
**[Verified]** The displayed assumptions call this a simplified model and note that actual FERS calculations may include additional retirement-type and survivor-benefit factors. The projection uses a fixed salary-growth assumption and user-entered COLA; it is not an official eligibility determination or agency estimate.

**[Inferred]** Saved-income mode therefore follows the profile retirement-age assumption rather than a per-source retirement age; this is distinct from the standalone calculator's editable retirement-age input.

## Evidence and questions
**[Needs human confirmation]** Are the modeled eligibility thresholds, special provisions, and survivor reductions intended to represent official FERS policy or only illustrative scenarios?

**[Needs human confirmation]** In saved-income mode, should profile target retirement age remain authoritative, or should users be able to override it for an individual FERS source?
