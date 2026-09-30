# Account Onboarding

## Purpose
**[Verified]** New-user setup currently consists of an account agreements/profile flow followed by a separate retirement-income setup flow. The two routes are `/new` and `/onboarding`. [Account onboarding](../../../src/app/%28BlankLayout%29/new/page.tsx) · [income setup](../../../src/app/%28DashboardLayout%29/onboarding/page.tsx)

## User
**[Verified]** The agreements/profile flow is for a signed-in user whose account is not marked onboarding-complete. The income setup screen is presented to users adding initial retirement sources.

## Inputs
**[Verified]** At `/new`, the user continues through Terms of Use and Privacy Policy, then enters display name, birth year, projection start year, target retirement age, and life expectancy age. Defaults are display name from auth metadata when present, birth year 1970, current year, retirement age 62, and life expectancy age 85. [Profile step](../../../src/app/%28BlankLayout%29/components/OnboardingProfileStep.tsx)

**[Verified]** At `/onboarding`, the checklist offers FERS pension, Uniformed Service pension, Retirement Savings, and Social Security source types, each added through the matching saved-income form.

## Outputs
**[Verified]** Saving the first flow marks the user onboarding-complete, updates the profile display name, saves financial attributes, and redirects to `/onboarding`. The second screen displays whether each of the four source types exists and offers Add actions for missing types; a Proceed to Dashboard button appears when at least one source exists.

## Workflow
**[Verified]** The landing page checks onboarding status and sends incomplete users to `/new`. The first flow has Agreements and Profile steps. Saving profile data marks completion, then routes to the income checklist. The user can add income sources and proceed to Dashboard when the source list is nonempty. [Onboarding check](../../../src/hooks/useCheckOnboarding.ts) · [landing route](../../../src/app/%28PublicLayout%29/components/LandingContent.tsx)

## Business rules
**[Verified]** Birth year must be between 1900 and the current year minus 18. Start year must be 1900 through current year; retirement age 40–80; life expectancy 1–150. Required values are saved before onboarding is marked complete.

**[Verified]** The income screen's copy requests one of each listed source, but the Proceed button condition checks only whether the user has any saved source. The status list shows which types are missing but does not disable proceeding for missing types.

**[Inferred]** Product-owner-confirmed requirement: the user is expected to add all four listed source types before entering Dashboard. The current implementation does not enforce that requirement; it permits proceeding when any one source exists.

## Edge cases
**[Verified]** If there is no signed-in user when profile Save is selected, the page routes to the public home. API calls for saved assets require authentication. A previously onboarded user visiting `/new` is redirected to Dashboard.

**[Inferred]** Because the account-complete flag is set before completing the separate income setup screen, a user can have a completed account onboarding state while still missing some or all of the listed income types.

## Dependencies
**[Verified]** Uses `supabase-auth-lib` agreement/profile and user services, user profile and financial attribute persistence, saved income assets, and route navigation. SQL defines `users`, `user_profiles`, and `user_attributes`, though the checked-in user-attributes shape differs from the active service fields.

## Current limitations
**[Verified]** The checked-in SQL `user_attributes` table has `id` as its sole primary key and defines `years_to_project_enc`; active code filters/upserts a `spouse` field and reads/writes `life_expectancy_age_enc`. The deployed schema needed for the active behavior is not established by this SQL file.

**[Verified]** The onboarding income checklist does not enforce all four types despite its wording. College savings and real estate are not included in the initial checklist.

## Evidence and questions
**[Needs human confirmation]** Is the checked-in user-attributes schema stale relative to the deployed schema and the spouse/life-expectancy features?
