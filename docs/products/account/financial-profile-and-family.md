# Financial Profile and Family Planning Records

## Purpose
**[Verified]** Dashboard users can maintain planning assumptions for themselves and an optional spouse, as well as child records used to show future college-start milestones. [User attributes card](../../../src/app/%28DashboardLayout%29/components/dashboard/UserAttributes.tsx) · [child card](../../../src/app/%28DashboardLayout%29/components/dashboard/ChildListCard.tsx)

## User
**[Inferred]** An authenticated user planning retirement individually or with a spouse and recording children's education timing.

## Inputs
**[Verified]** A financial profile includes birth year, target retirement age, projection start year, and life expectancy age. A spouse profile stores corresponding planning fields. A child record includes name, birth year, first and last college years, estimated first-year tuition, and tuition inflation rate. [Profile dialog](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditUserAttributesDialog.tsx) · [child dialog](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditUserChildDialog.tsx)

## Outputs
**[Verified]** The profile card shows birth year, target retirement age, life expectancy, and a progress bar/countdown to retirement. A spouse profile card appears if spouse attributes exist. Child cards show name, birth year, and college-year range. The Dashboard timeline uses spouse retirement/life-expectancy years and children's first college years.

## Workflow
**[Verified]** The user opens Dashboard and edits their financial profile, adds or edits a spouse planning profile, or adds/edits/deletes child records. Adding a spouse profile creates a second profile record in the current application flow; deleting it removes that record after confirmation. Child records can be maintained from the child card and deleted after confirmation. When a spouse profile exists, saved income and property forms let the user designate each record as belonging to themselves or the spouse. The header's Include Spouse's Asset switch controls inclusion of spouse-designated records and persists its setting in local storage.

## Business rules
**[Verified]** Profile fields enforce birth year 1900–current year, retirement age 40–80, start year 1900–current year, and life expectancy 1–150. The child dialog derives college start/end defaults as birth year +18/+21 and re-derives those values when a new child's birth year changes. Child college end year cannot precede start year; tuition must be non-negative; tuition inflation is 0–100%.

**[Confirmed product decision]** A spouse designation is an account-level ownership label; it does not provide a linked partner access to the user's assets. Linked partners cannot view one another's assets.

**[Verified]** The inspected application code contains no active partner invitation/acceptance workflow, even though `partner_links` exists in SQL.

## Edge cases
**[Verified]** A child is included in the Financial Timeline at its college start year. The child record is not connected to the College Savings calculator/account projection in the inspected code. The child dialog lets users set the first-year tuition and inflation fields, but these values are not consumed by the Dashboard timeline.

**[Inferred]** Editing an existing child's birth year does not re-derive college years because the derivation effect runs only while adding a new child.

## Dependencies
**[Verified]** Uses `/api/user-attributes` and `/api/user-children`, encryption helpers, user profile context, Dashboard cards, timeline, and the browser-local spouse-asset inclusion preference. [Attribute API](../../../src/app/api/user-attributes/route.ts) · [child API](../../../src/app/api/user-children/route.ts)

## Current limitations
**[Verified]** The checked-in SQL defines `user_attributes` without a `spouse` column or `life_expectancy_age_enc`, and uses a single-column primary key; the active service filters and upserts by `(id, spouse)` and uses the life-expectancy field. The `user_children` table used by the service is not defined in `sql/schema.sql`. Deployed schema behavior is not established by the repository.

**[Verified]** Partner links in SQL are not surfaced in these profile controls. The checked-in assets RLS policy grants linked-partner reads, which conflicts with the confirmed product behavior; deployed schema behavior is not established by the checked-in SQL.

## Evidence and questions
**[Needs human confirmation]** Is a user-children schema/migration missing from the repository, and what access rules apply to those records?

**[Needs human confirmation]** Should child tuition assumptions feed an active college-savings projection, or are they currently informational only?
