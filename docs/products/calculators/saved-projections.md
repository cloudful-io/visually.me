# Saved Calculator Projections

## Purpose
**[Verified]** Some calculator engines also power account-like assets saved to a user's profile. These projections connect financial assumptions to the Income and Real Estate dashboard views; they are separate from standalone calculator forms. [Asset registry](../../../src/lib/assets/registry.ts) · [assets workflow](../../../src/lib/assets/useAssets.ts)

## User
**[Inferred]** An authenticated user managing income sources, retirement accounts, or real-estate properties and labeling each record as belonging to themselves or their spouse.

## Inputs
**[Verified]** Income assets have a type, required label, projection fields, and optionally an owner designation of user or spouse. Property assets also have an optional address and property-specific fields. The supported saved income types are FERS pension, Military pension, Retirement Savings, and Social Security. Real Estate is a property category. College Savings exists in the asset registry and database enum, but there is no working saved-college-savings list flow in the inspected page implementation.

**[Confirmed product decision]** College Savings has not been completely implemented as a saved-account workflow.

## Outputs
**[Verified]** Saved records are computed into year-by-year projection rows. Income-source detail shows the saved fields, chart, editable projection table, and edit/delete actions. Real Estate has per-property and combined views. Some income projections merge profile attributes such as birth year, start year, and life expectancy; FERS also uses profile target retirement age. [Income detail](../../../src/app/%28DashboardLayout%29/income/%5Bid%5D/page.tsx) · [property projection](related/real-estate-projection.md)

## Workflow
**[Verified]** Asset forms save through `/api/assets`, which requires an authenticated user. An edit can update base assumptions while preserving existing year overrides. In detail views, changing an editable yearly projection column saves an override; the user can revert an overridden year to the default calculation. Deleting requires confirmation. [Assets API](../../../src/app/api/assets/route.ts) · [income editor](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditIncomeSourcesDialog.tsx)

## Business rules
**[Verified]** User profile attributes are merged into saved asset fields before calculation. The asset service fetches records using the current user's `asset_keys` and the UI allows each account/property to be assigned to the user or spouse. [Asset service](../../../src/lib/assets/service.ts) · [income editor](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditIncomeSourcesDialog.tsx) · [property editor](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditRealEstateDialog.tsx)

**[Confirmed product decision]** A linked partner cannot view the other partner's assets. The user/spouse owner field identifies whose planning assumptions apply to a record within the current user's workspace; it does not grant another account access.

**[Verified]** The active asset service encrypts the JSON payload into `assets.data_enc` and wraps a content key for the user's `asset_keys` row; reads retrieve and decrypt those values. It uses the unified `assets` table, not the separate `real_estate` table also present in the SQL schema. [Asset service](../../../src/lib/assets/service.ts)

**[Verified]** The checked-in SQL defines a `linked_partner_read_access` policy for `assets`, but does not declare the `spouse` column used by the active asset service. [Schema](../../../sql/schema.sql)

**[Needs human confirmation]** The checked-in policy conflicts with the confirmed product rule that linked partners cannot view one another's assets. The repository does not establish whether the deployed schema has been updated to match that rule.

**[Verified]** Profile values override corresponding values in saved asset fields during computation: start year, birth year, and life expectancy are taken from the selected user's profile; FERS retirement age and Retirement Savings withdrawal start age are also taken from profile target retirement age. [Asset registry](../../../src/lib/assets/registry.ts)

**[Confirmed product decision]** These profile values remain authoritative in saved-projection mode. Users do not override them on an individual saved account; standalone calculator forms have their own editable inputs.

**[Verified]** Year overrides are stored with asset data and passed to the corresponding `financial-calcs` projection-with-overrides function. The income detail page edits projection columns configured as editable; the standalone calculator route does not enable those edits.

## Edge cases
**[Verified]** If required profile fields are unavailable, income projection computation can produce no rows. Calculation exceptions are logged and the computed asset is returned with empty rows. The API returns unauthorized for unauthenticated GET, POST, or DELETE requests.

**[Inferred]** A saved asset can appear without a usable projection if profile assumptions are incomplete or its stored fields fail engine validation; the page does not surface a dedicated calculation error summary for the computed-asset fallback.

## Dependencies
**[Verified]** Uses the asset registry, profile attributes, `financial-calcs`, `/api/assets`, Supabase storage/RLS, and category-specific dashboard pages. The SQL schema defines asset types for FERS, Military, Social Security, Retirement Savings, Real Estate, and College Savings.

## Current limitations
**[Verified]** Standalone calculator inputs and scenarios remain in browser local storage; saving an asset is a separate workflow. Mortgage Amortization has no saved-asset type. The College Savings summary page currently renders its title/container while its detailed list component is commented out, and the assets API returns an empty list for the `college-savings` category.

**[Verified]** The global calculator counter does not record individual saved assets, inputs, results, or users.

## Evidence and questions
The incomplete College Savings workflow, authoritative profile attributes in saved projections, and prohibition on cross-account partner asset access are confirmed product decisions. The checked-in SQL still defines a linked-partner asset-read policy and omits the service's `spouse` field; deployed schema behavior remains unverified.
