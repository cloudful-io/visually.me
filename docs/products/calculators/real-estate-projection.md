# Real-Estate Property Projection

## Purpose
**[Verified]** Estimate rental income, recurring homeownership expenses, and net cash flow for a saved property. This is calculator-related functionality in the Real Estate area, not a standalone entry in the `/calculators` registry. [Property projection configuration](../../../../src/configs/realEstate.ts) · [real-estate page](../../../../src/app/%28DashboardLayout%29/real-estate/%5Bid%5D/page.tsx)

## User
**[Inferred]** A homeowner or landlord comparing projected rental income with mortgage, tax, insurance, and HOA costs.

## Inputs
**[Verified]** The saved-property dialog asks for a required name, optional address, owner (user or spouse when available), and property type (Primary Home or Rental Property). Projection fields include start/birth years, monthly mortgage and end year, annual property tax and increase rate, annual insurance and increase rate, monthly HOA fee and increase rate, monthly rental income and increase rate, and life expectancy. [Property dialog](../../../../src/app/%28DashboardLayout%29/components/dashboard/EditDialogs/EditRealEstateDialog.tsx) · [field configuration](../../../../src/configs/realEstate.ts)

## Outputs
**[Verified]** A property's detail page shows read-only assumptions, a yearly projection table, and a chart in either Summary or Detail mode. Summary displays net monthly cash flow. Detail breaks out monthly mortgage, property tax, insurance, HOA, and rental income. The Real Estate overview can combine properties into annual income/expense or net-cash-flow charts and a combined table. [Detail page](../../../../src/app/%28DashboardLayout%29/real-estate/%5Bid%5D/page.tsx) · [overview page](../../../../src/app/%28DashboardLayout%29/real-estate/page.tsx)

## Workflow
**[Verified]** From Real Estate, a user can add a property, open its projection, edit or delete it, and change supported yearly values in the table. The property dialog validates the name and projection fields before saving. Per-year overrides are preserved when the base property assumptions are edited. A user can revert a year to the default projection. [Property list](../../../../src/app/%28DashboardLayout%29/components/dashboard/RealEstateDetailedList.tsx)

## Business rules
**[Verified]** The engine projects from start year through birth year plus life expectancy. Property tax, insurance, HOA, and rental income increase annually beginning in the second projected year. Mortgage payments stop after the configured mortgage end year. Monthly expenses combine mortgage, annual tax, annual insurance, and monthly HOA; net monthly cash flow is rental income minus monthly expenses. [Calculation package](../../../../node_modules/financial-calcs/dist/real-estate/property.js)

**[Verified]** `propertyType` is collected and stored but is not read by the calculation function. Both property types use the same projection logic; rental income is used as entered.

## Edge cases
**[Verified]** The engine rejects a start year before 1900, negative mortgage/tax/insurance/increase values, invalid life expectancy, or a life-expectancy year before the start year. It does not explicitly validate every displayed field, including mortgage end year, HOA increase, or rental-income increase.

**[Inferred]** A Primary Home can still have nonzero rental income in the calculation, and a Rental Property with zero entered rental income is treated as having none; the property type does not change these outcomes.

## Dependencies
**[Verified]** Uses `financial-calcs`, the asset registry and property hooks, user profile attributes, `/api/assets`, and the Supabase `assets` table. Property values are saved as asset data and computed into projection rows when loaded. [Asset registry](../../../../src/lib/assets/registry.ts) · [assets API](../../../../src/app/api/assets/route.ts) · [schema](../../../../sql/schema.sql)

## Current limitations
**[Verified]** The model has no property appreciation, purchase/sale value, vacancy, repairs, maintenance, utilities, or tax treatment inputs. It estimates cash flow from the listed recurring items only. Property type currently has no computational effect. The page uses the profile target retirement year only as a chart marker, not as the end of the property projection.

## Evidence and questions
**[Needs human confirmation]** Should Primary Home and Rental Property use different income/expense rules, or is the property type currently only a label?

**[Needs human confirmation]** Which omitted costs and ownership events are intended to be included in the product's definition of property cash flow?
