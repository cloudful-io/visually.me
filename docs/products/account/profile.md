# Account Profile

## Purpose
**[Verified]** The account profile lets a signed-in user view and update their display name and profile picture. It is available from the header's user menu at **My Profile**. [Profile menu](../../../src/app/components/Profile.tsx) · [Profile page](../../../src/app/%28DashboardLayout%29/profile/page.tsx)

## User
**[Verified]** A user with an authenticated Supabase session.

## Inputs
**[Verified]** Display name and an image file selected for the profile picture. The image picker accepts image files. [Profile widget implementation](../../../node_modules/supabase-auth-lib/dist/components/UserProfile.js)

## Outputs
**[Verified]** The page displays the current profile picture and display name, with a success notification after saving the name or uploading an avatar. The header user menu shows the profile avatar/name and includes My Profile and logout controls.

## Workflow
**[Verified]** The profile page loads `UserProfile` from `supabase-auth-lib`. It loads profile data by user ID, with auth metadata as fallback. The user can save a non-empty display name or upload an avatar to the `avatars` storage bucket; the returned public URL is saved to `user_profiles` and used in the header.

## Business rules
**[Verified]** Display name cannot be saved when blank. Avatar upload stores a public URL. The profile schema includes display name, avatar URL, and bio, but the rendered profile editor exposes only display name and avatar.

## Edge cases
**[Verified]** While profile data loads, the widget shows a loading indicator. Save/upload failures are logged; the visible success notification is only shown on success. If no saved profile is found, display name and avatar fall back to Supabase user metadata and the configured default avatar.

## Dependencies
**[Verified]** Uses Supabase Auth, the `user_profiles` table, Supabase Storage bucket `avatars`, and the `UserProfile`/`UserProfileService` implementation from `supabase-auth-lib`. The SQL schema permits public profile reads and self-owned insert/update.

## Current limitations
**[Verified]** The profile editor does not expose email, password, or bio editing. Avatar removal is not offered. The UI package is an external dependency rather than a component implemented in this repository.

## Evidence and questions
**[Needs human confirmation]** Is a public avatar URL and publicly readable profile an intended product behavior?

**[Needs human confirmation]** Should users be able to edit profile fields beyond display name and avatar?
