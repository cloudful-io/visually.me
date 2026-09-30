# Saved Calculator Projections

## Purpose
**[Verified]** Some calculator engines also power account-like assets saved to a user's profile. These projections connect financial assumptions to the Income and Real Estate dashboard views; they are separate from standalone calculator forms. [Asset registry](../../../src/lib/assets/registry.ts) · [assets workflow](../../../src/lib/assets/useAssets.ts)

## User
**[Inferred]** An authenticated user managing income sources, retirement accounts, or real-estate properties, optionally including a linked spouse's assets.

## Inputs
**[Verified]** Income assets have a type, required label, projection fields, and optionally a user/spouse owner. Property assets also have an optional address and property-specific fields. The supported saved income types are FERS pension, Military pension, Retirement Savings, and Social Security. Real Estate is a property category. College Savings exists in the asset registry and database enum, but there is no working saved-college-savings list flow in the inspected page implementation.

## Outputs
**[Verified]** Saved records are computed into year-by-year projection rows. Income-source detail shows the saved fields, chart, editable projection table, and edit/delete actions. Real Estate has per-property and combined views. Some income projections merge profile attributes such as birth year, start year, and life expectancy; FERS also uses profile target retirement age. [Income detail](../../../src/app/%28DashboardLayout%29/income/%5Bid%5D/page.tsx) · [property projection](related/real-estate-projection.md)

## Workflow
**[Verified]** Asset forms save through `/api/assets`, which requires an authenticated user. An edit can update base assumptions while preserving existing year overrides. In detail views, changing an editable yearly projection column saves an override; the user can revert an overridden year to the default calculation. Deleting requires confirmation. [Assets API](../../../src/app/api/assets/route.ts) · [income editor](../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditIncomeSourcesDialog.tsx)

## Business rules
**[Verified]** User profile attributes are merged into saved asset fields before calculation. Asset ownership and linked-partner read access are represented by RLS policies on the `assets` table; the owner has full access and a linked partner can read but cannot modify the owner's asset. Asset payloads use `data_enc` and per-user records are represented in `asset_keys`. [Schema](../../../sql/schema.sql)

**[Verified]** The active asset service encrypts the JSON payload into `assets.data_enc` and wraps a content key for the user's `asset_keys` row; reads retrieve and decrypt those values. It uses the unified `assets` table, not the separate `real_estate` table also present in the SQL schema. [Asset service](../../../src/lib/assets/service.ts)

**[Verified]** The checked-in SQL definition of `assets` does not declare a `spouse` column, but the asset service selects, filters, and upserts `spouse`. Whether the deployed Supabase schema has this column is not established by the repository schema.

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
**[Needs human confirmation]** Should College Savings be a complete saved-account workflow, and is the currently empty category intentional?

**[Needs human confirmation]** Should profile attributes always override account-specific start year, birth year, life expectancy, or retirement age in saved projections?

**[Needs human confirmation]** Is the checked-in `assets` schema missing the `spouse` column expected by the active service, and should linked partners be able to decrypt and view each other's assets?
