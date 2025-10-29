# Phase 4 — Implementation Task Breakdown (IWM)

Date: 2025-10-29
Scope: 200+ hierarchical tasks grouped by epics with dependencies, acceptance criteria, files, endpoints, and testing requirements.

---

## Task Numbering Convention
- Epic: `E-{N}` (e.g., E-1, E-2)
- Epic Sub-task: `E-{N}.{M}` (e.g., E-1.1, E-1.2)
- Leaf task: `E-{N}.{M}.{K}` (e.g., E-1.1.1, E-1.1.2)

---

## Epic 1: Backend Infrastructure & API Enhancements (E-1)
Complexity: High | Duration: 3-4 weeks | Owner: Backend Team

### E-1.1: Create GET /api/v1/auth/me Endpoint
Complexity: Medium | Dependencies: None | Duration: 2-3 days

**E-1.1.1: Design endpoint response schema**
- Complexity: Low
- Acceptance Criteria:
  - Response includes: user_id, external_id, email, username, roles (array), has_critic_profile, has_talent_profile, has_industry_profile, default_role
  - Schema documented in OpenAPI
- Files: `apps/backend/src/routers/auth.py` (add docstring/schema)
- Testing: Manual curl test

**E-1.1.2: Implement GET /api/v1/auth/me endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Requires authentication (JWT)
  - Returns current user + roles from AdminUserMeta.roles
  - Checks for CriticProfile, TalentProfile, IndustryProfile existence
  - Returns 401 if unauthenticated
- Files: `apps/backend/src/routers/auth.py`
- Endpoints: `GET /api/v1/auth/me`
- Testing: API test (authenticated + unauthenticated)

**E-1.1.3: Generate TypeScript types from endpoint**
- Complexity: Low
- Acceptance Criteria:
  - Type exported to `packages/shared/types/auth.ts`
  - Includes AuthMeResponse interface
- Files: `packages/shared/types/auth.ts` (create)
- Testing: TypeScript compilation check

---

### E-1.2: Create user_role_profiles Table & Migration
Complexity: Medium | Dependencies: None | Duration: 2-3 days

**E-1.2.1: Design schema for user_role_profiles**
- Complexity: Low
- Acceptance Criteria:
  - Fields: id, user_id, role_type, enabled, visibility, is_default, handle, created_at, updated_at
  - Constraints: UNIQUE (user_id, role_type), FK user_id → users.id (CASCADE)
  - Indexes: (user_id, role_type), (visibility), (is_default WHERE enabled)
- Files: Schema doc (inline in migration)
- Testing: Schema review

**E-1.2.2: Create Alembic migration**
- Complexity: Medium
- Acceptance Criteria:
  - Migration creates table with all fields and constraints
  - Rollback tested
  - Seed default lover role for all existing users (enabled=true, visibility=public, is_default=true)
- Files: `apps/backend/alembic/versions/{timestamp}_create_user_role_profiles.py`
- Testing: Migration up/down test

**E-1.2.3: Add SQLAlchemy model UserRoleProfile**
- Complexity: Low
- Acceptance Criteria:
  - Model in `apps/backend/src/models.py`
  - Relationships: user (FK), role_type enum, visibility enum
  - Mapped columns with proper types
- Files: `apps/backend/src/models.py`
- Testing: Model instantiation test

---

### E-1.3: Create TalentProfile & IndustryProfile Tables
Complexity: Medium | Dependencies: E-1.2 | Duration: 3-4 days

**E-1.3.1: Design TalentProfile schema**
- Complexity: Low
- Acceptance Criteria:
  - Fields: id, user_id, role_profile_id, full_name, professional_name, primary_role (enum: actor|crew), headshot_url, reel_urls (JSONB), credits (JSONB), privacy_settings (JSONB), verification_status, created_at, updated_at
  - Constraints: FK user_id, FK role_profile_id, UNIQUE (user_id)
  - Indexes: (user_id), (role_profile_id), (verification_status)
- Files: Schema doc
- Testing: Schema review

**E-1.3.2: Create Alembic migration for TalentProfile**
- Complexity: Medium
- Acceptance Criteria:
  - Migration creates table with all fields
  - Rollback tested
- Files: `apps/backend/alembic/versions/{timestamp}_create_talent_profiles.py`
- Testing: Migration up/down test

**E-1.3.3: Add SQLAlchemy model TalentProfile**
- Complexity: Low
- Acceptance Criteria:
  - Model in `apps/backend/src/models.py`
  - Relationships: user, role_profile
  - JSONB fields properly typed
- Files: `apps/backend/src/models.py`
- Testing: Model instantiation test

**E-1.3.4: Design IndustryProfile schema**
- Complexity: Low
- Acceptance Criteria:
  - Fields: id, user_id, role_profile_id, company_name, role_title, projects (JSONB), casting_contact (JSONB), privacy_settings (JSONB), verification_status, created_at, updated_at
  - Constraints: FK user_id, FK role_profile_id, UNIQUE (user_id)
  - Indexes: (user_id), (role_profile_id), (verification_status)
- Files: Schema doc
- Testing: Schema review

**E-1.3.5: Create Alembic migration for IndustryProfile**
- Complexity: Medium
- Acceptance Criteria:
  - Migration creates table with all fields
  - Rollback tested
- Files: `apps/backend/alembic/versions/{timestamp}_create_industry_profiles.py`
- Testing: Migration up/down test

**E-1.3.6: Add SQLAlchemy model IndustryProfile**
- Complexity: Low
- Acceptance Criteria:
  - Model in `apps/backend/src/models.py`
  - Relationships: user, role_profile
  - JSONB fields properly typed
- Files: `apps/backend/src/models.py`
- Testing: Model instantiation test

---

### E-1.4: Add role_profile_id to CriticProfile
Complexity: Low | Dependencies: E-1.2 | Duration: 1-2 days

**E-1.4.1: Create migration to add role_profile_id column**
- Complexity: Low
- Acceptance Criteria:
  - Adds nullable role_profile_id column to critic_profiles
  - Backfill existing critic profiles with role_profile_id from user_role_profiles (critic role)
- Files: `apps/backend/alembic/versions/{timestamp}_add_role_profile_id_to_critic_profiles.py`
- Testing: Migration up/down test

**E-1.4.2: Update CriticProfile model**
- Complexity: Low
- Acceptance Criteria:
  - Add role_profile_id field and FK relationship
- Files: `apps/backend/src/models.py`
- Testing: Model instantiation test

---

### E-1.5: Create Role Management API Endpoints
Complexity: High | Dependencies: E-1.2, E-1.3, E-1.4 | Duration: 4-5 days

**E-1.5.1: Create GET /api/v1/roles endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Returns all user_role_profiles for current user
  - Includes enabled, visibility, is_default, role_type
  - Requires authentication
- Files: `apps/backend/src/routers/roles.py` (create)
- Endpoints: `GET /api/v1/roles`
- Testing: API test (authenticated + unauthenticated)

**E-1.5.2: Create PUT /api/v1/roles/{role_type} endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Updates enabled, visibility, is_default for a role
  - Validates only one is_default per user
  - Returns updated role profile
  - Requires authentication
- Files: `apps/backend/src/routers/roles.py`
- Endpoints: `PUT /api/v1/roles/{role_type}`
- Testing: API test (validation, constraints)

**E-1.5.3: Create POST /api/v1/roles/{role_type}/activate endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Activates a role (enabled=true)
  - Creates role-specific profile if needed (TalentProfile, IndustryProfile)
  - Returns onboarding wizard data
  - Requires authentication
- Files: `apps/backend/src/routers/roles.py`
- Endpoints: `POST /api/v1/roles/{role_type}/activate`
- Testing: API test (profile creation, state transitions)

**E-1.5.4: Create POST /api/v1/roles/{role_type}/deactivate endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Deactivates a role (enabled=false, visibility=private)
  - Preserves data (no deletion)
  - Prevents deactivating last enabled role
  - Requires authentication
- Files: `apps/backend/src/routers/roles.py`
- Endpoints: `POST /api/v1/roles/{role_type}/deactivate`
- Testing: API test (constraints, data preservation)

**E-1.5.5: Create GET /api/v1/roles/{role_type} endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Returns role profile details (CriticProfile, TalentProfile, IndustryProfile)
  - Includes role-specific fields
  - Requires authentication
- Files: `apps/backend/src/routers/roles.py`
- Endpoints: `GET /api/v1/roles/{role_type}`
- Testing: API test (all role types)

**E-1.5.6: Create PUT /api/v1/roles/{role_type} profile update endpoint**
- Complexity: Medium
- Acceptance Criteria:
  - Updates role-specific profile fields (e.g., TalentProfile.headshot_url)
  - Validates role-specific constraints
  - Returns updated profile
  - Requires authentication
- Files: `apps/backend/src/routers/roles.py`
- Endpoints: `PUT /api/v1/roles/{role_type}` (profile data)
- Testing: API test (per-role validation)

---

### E-1.6: Create Repositories for Role Management
Complexity: Medium | Dependencies: E-1.2, E-1.3, E-1.4 | Duration: 2-3 days

**E-1.6.1: Create RoleRepository class**
- Complexity: Medium
- Acceptance Criteria:
  - Methods: get_all_roles, get_role, update_role, activate_role, deactivate_role
  - Uses async SQLAlchemy queries
  - Proper error handling
- Files: `apps/backend/src/repositories/role_repository.py` (create)
- Testing: Unit tests for all methods

**E-1.6.2: Create TalentProfileRepository class**
- Complexity: Medium
- Acceptance Criteria:
  - Methods: get_profile, create_profile, update_profile, delete_profile
  - Uses async SQLAlchemy queries
  - Proper error handling
- Files: `apps/backend/src/repositories/talent_repository.py` (create)
- Testing: Unit tests for all methods

**E-1.6.3: Create IndustryProfileRepository class**
- Complexity: Medium
- Acceptance Criteria:
  - Methods: get_profile, create_profile, update_profile, delete_profile
  - Uses async SQLAlchemy queries
  - Proper error handling
- Files: `apps/backend/src/repositories/industry_repository.py` (create)
- Testing: Unit tests for all methods

---

### E-1.7: Update Notifications Preferences API
Complexity: Medium | Dependencies: None | Duration: 2-3 days

**E-1.7.1: Review existing NotificationPreference model**
- Complexity: Low
- Acceptance Criteria:
  - Confirm schema in `apps/backend/src/models.py`
  - Identify all preference fields
- Files: `apps/backend/src/models.py`
- Testing: Model review

**E-1.7.2: Create/Update GET /api/v1/notifications/preferences endpoint**
- Complexity: Low
- Acceptance Criteria:
  - Returns current user's notification preferences
  - Includes all channels and global settings
  - Requires authentication
- Files: `apps/backend/src/routers/notifications.py`
- Endpoints: `GET /api/v1/notifications/preferences`
- Testing: API test

**E-1.7.3: Create/Update PUT /api/v1/notifications/preferences endpoint**
- Complexity: Low
- Acceptance Criteria:
  - Updates notification preferences
  - Validates channel settings
  - Returns updated preferences
  - Requires authentication
- Files: `apps/backend/src/routers/notifications.py`
- Endpoints: `PUT /api/v1/notifications/preferences`
- Testing: API test (validation, persistence)

---

## Epic 2: Frontend Settings Architecture (E-2)
Complexity: High | Duration: 4-5 weeks | Owner: Frontend Team

### E-2.1: Route Protection & Middleware Updates
Complexity: Low | Dependencies: None | Duration: 1 day

**E-2.1.1: Add /settings to protected routes in middleware**
- Complexity: Low
- Acceptance Criteria:
  - `/settings` added to protectedRoutes array
  - Unauthenticated access redirects to `/login?redirect=/settings`
  - Authenticated access allowed
- Files: `middleware.ts`
- Testing: Playwright test (auth redirect, authenticated access)

---

### E-2.2: Shared Validation & Types
Complexity: Medium | Dependencies: E-1.1 | Duration: 2-3 days

**E-2.2.1: Create settings validation schemas in Zod**
- Complexity: Medium
- Acceptance Criteria:
  - Schemas: ProfileSchema, AccountSchema, PrivacySchema, DisplaySchema, PreferencesSchema, NotificationPrefsSchema
  - All schemas in `lib/validation/settings.ts`
  - Includes field-level validation (length, format, enum)
  - Reusable across both `/settings` and profile tab
- Files: `lib/validation/settings.ts` (create)
- Testing: Unit tests for all schemas

**E-2.2.2: Create TypeScript types for settings sections**
- Complexity: Low
- Acceptance Criteria:
  - Types in `packages/shared/types/settings.ts`
  - Includes: ProfileSettings, AccountSettings, PrivacySettings, DisplaySettings, PreferencesSettings, NotificationPreferences
  - Matches backend Pydantic models
- Files: `packages/shared/types/settings.ts` (create)
- Testing: TypeScript compilation check

**E-2.2.3: Create TypeScript types for role profiles**
- Complexity: Low
- Acceptance Criteria:
  - Types in `packages/shared/types/roles.ts`
  - Includes: UserRoleProfile, TalentProfile, IndustryProfile, CriticProfile
  - Matches backend models
- Files: `packages/shared/types/roles.ts` (create)
- Testing: TypeScript compilation check

---

### E-2.3: Shared Components & Hooks
Complexity: High | Dependencies: E-2.2 | Duration: 3-4 days

**E-2.3.1: Create useUnsavedChanges hook**
- Complexity: Medium
- Acceptance Criteria:
  - Tracks form state changes
  - Warns on page navigation if unsaved
  - Provides isDirty, reset, and save methods
  - Works with React Hook Form
- Files: `lib/hooks/useUnsavedChanges.ts` (create)
- Testing: Unit tests

**E-2.3.2: Create useSettingsSection hook**
- Complexity: Medium
- Acceptance Criteria:
  - Abstracts loading/saving logic for a settings section
  - Handles API calls, error states, success toasts
  - Provides data, isLoading, isSaving, error, onSave methods
  - Integrates with useUnsavedChanges
- Files: `lib/hooks/useSettingsSection.ts` (create)
- Testing: Unit tests

**E-2.3.3: Create SettingsFormField component**
- Complexity: Low
- Acceptance Criteria:
  - Reusable form field wrapper
  - Includes label, input, error message, help text
  - Accessible (aria-invalid, aria-describedby)
  - Works with React Hook Form
- Files: `components/settings/shared/SettingsFormField.tsx` (create)
- Testing: Storybook + unit tests

**E-2.3.4: Create SettingsSection component**
- Complexity: Low
- Acceptance Criteria:
  - Container for a settings section
  - Includes title, description, form, save button
  - Shows loading/error/success states
  - Accessible
- Files: `components/settings/shared/SettingsSection.tsx` (create)
- Testing: Storybook + unit tests

**E-2.3.5: Create SettingsSectionSkeleton component**
- Complexity: Low
- Acceptance Criteria:
  - Loading skeleton for settings sections
  - Matches SettingsSection layout
- Files: `components/settings/shared/SettingsSectionSkeleton.tsx` (create)
- Testing: Visual regression test

---

### E-2.4: Extract Components from Profile Settings Tab
Complexity: High | Dependencies: E-2.3 | Duration: 3-4 days

**E-2.4.1: Extract ProfileBasicsForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Extracted from `components/profile/sections/profile-settings.tsx`
  - Includes avatar, name, display name, bio fields
  - Uses shared SettingsFormField component
  - Uses ProfileSchema validation
  - Placed in `components/settings/shared/ProfileBasicsForm.tsx`
- Files: `components/settings/shared/ProfileBasicsForm.tsx` (create), `components/profile/sections/profile-settings.tsx` (update)
- Testing: Unit tests, Playwright test

**E-2.4.2: Extract AccountInfoForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Extracted from profile settings tab
  - Includes name, email, phone fields
  - Uses shared SettingsFormField component
  - Uses AccountSchema validation
  - Placed in `components/settings/shared/AccountInfoForm.tsx`
- Files: `components/settings/shared/AccountInfoForm.tsx` (create), `components/profile/sections/profile-settings.tsx` (update)
- Testing: Unit tests, Playwright test

**E-2.4.3: Extract PasswordChangeForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Extracted from profile settings tab
  - Includes current password, new password, confirm password fields
  - Password strength indicator
  - Uses shared SettingsFormField component
  - Uses AccountSchema validation
  - Placed in `components/settings/shared/PasswordChangeForm.tsx`
- Files: `components/settings/shared/PasswordChangeForm.tsx` (create), `components/profile/sections/profile-settings.tsx` (update)
- Testing: Unit tests, Playwright test

**E-2.4.4: Extract PreferencesForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Extracted from profile settings tab
  - Includes language, region, spoilers, excludedGenres, contentRating fields
  - Uses shared SettingsFormField component
  - Uses PreferencesSchema validation
  - Placed in `components/settings/shared/PreferencesForm.tsx`
- Files: `components/settings/shared/PreferencesForm.tsx` (create), `components/profile/sections/profile-settings.tsx` (update)
- Testing: Unit tests, Playwright test

**E-2.4.5: Extract DisplayForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Extracted from profile settings tab
  - Includes theme, fontSize, highContrastMode, reduceMotion fields
  - Uses shared SettingsFormField component
  - Uses DisplaySchema validation
  - Placed in `components/settings/shared/DisplayForm.tsx`
- Files: `components/settings/shared/DisplayForm.tsx` (create), `components/profile/sections/profile-settings.tsx` (update)
- Testing: Unit tests, Playwright test

**E-2.4.6: Extract PrivacyForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Extracted from profile settings tab
  - Includes profileVisibility, activitySharing, messageRequests, dataDownloadRequested fields
  - Uses shared SettingsFormField component
  - Uses PrivacySchema validation
  - Placed in `components/settings/shared/PrivacyForm.tsx`
- Files: `components/settings/shared/PrivacyForm.tsx` (create), `components/profile/sections/profile-settings.tsx` (update)
- Testing: Unit tests, Playwright test

---

### E-2.5: Update Profile Settings Tab to Use Shared Components
Complexity: Medium | Dependencies: E-2.4 | Duration: 2-3 days

**E-2.5.1: Refactor profile-settings.tsx to import shared components**
- Complexity: Medium
- Acceptance Criteria:
  - Imports all extracted form components
  - Removes duplicate code
  - Maintains existing functionality
  - All tests pass
- Files: `components/profile/sections/profile-settings.tsx`
- Testing: Playwright test (all tabs functional)

**E-2.5.2: Add "Open full settings" CTA to profile settings tab**
- Complexity: Low
- Acceptance Criteria:
  - Button/link to `/settings` visible in profile settings tab
  - Accessible and keyboard-navigable
- Files: `components/profile/sections/profile-settings.tsx`
- Testing: Playwright test

---

### E-2.6: Wire Global /settings Page to Real API
Complexity: High | Dependencies: E-2.4, E-2.5 | Duration: 4-5 days

**E-2.6.1: Create settings API client functions**
- Complexity: Medium
- Acceptance Criteria:
  - Functions: getProfileSettings, updateProfileSettings, getAccountSettings, updateAccountSettings, etc.
  - All in `lib/api/settings.ts`
  - Proper error handling and typing
  - Uses shared types from `packages/shared/types/settings.ts`
- Files: `lib/api/settings.ts` (update)
- Testing: Unit tests (mock API)

**E-2.6.2: Create global /settings page layout**
- Complexity: Medium
- Acceptance Criteria:
  - Page at `app/settings/page.tsx`
  - Sidebar navigation with section tabs
  - Main content area for active section
  - Responsive design
  - Accessible
- Files: `app/settings/page.tsx` (update)
- Testing: Playwright test (layout, navigation)

**E-2.6.3: Implement Profile section in /settings**
- Complexity: Medium
- Acceptance Criteria:
  - Uses ProfileBasicsForm component
  - Fetches data on mount using useSettingsSection hook
  - Saves changes to backend
  - Shows loading/error/success states
  - Unsaved changes guard
- Files: `components/settings/sections/ProfileSection.tsx` (create), `app/settings/page.tsx` (update)
- Testing: Playwright test (load, edit, save)

**E-2.6.4: Implement Account section in /settings**
- Complexity: Medium
- Acceptance Criteria:
  - Uses AccountInfoForm and PasswordChangeForm components
  - Fetches data on mount
  - Saves changes to backend
  - Shows loading/error/success states
  - Unsaved changes guard
- Files: `components/settings/sections/AccountSection.tsx` (create), `app/settings/page.tsx` (update)
- Testing: Playwright test (load, edit, save, password change)

**E-2.6.5: Implement Privacy section in /settings**
- Complexity: Medium
- Acceptance Criteria:
  - Uses PrivacyForm component
  - Fetches data on mount
  - Saves changes to backend
  - Shows loading/error/success states
  - Unsaved changes guard
- Files: `components/settings/sections/PrivacySection.tsx` (create), `app/settings/page.tsx` (update)
- Testing: Playwright test (load, edit, save)

**E-2.6.6: Implement Display section in /settings**
- Complexity: Medium
- Acceptance Criteria:
  - Uses DisplayForm component
  - Fetches data on mount
  - Saves changes to backend
  - Shows loading/error/success states
  - Unsaved changes guard
- Files: `components/settings/sections/DisplaySection.tsx` (create), `app/settings/page.tsx` (update)
- Testing: Playwright test (load, edit, save)

**E-2.6.7: Implement Preferences section in /settings**
- Complexity: Medium
- Acceptance Criteria:
  - Uses PreferencesForm component
  - Fetches data on mount
  - Saves changes to backend
  - Shows loading/error/success states
  - Unsaved changes guard
- Files: `components/settings/sections/PreferencesSection.tsx` (create), `app/settings/page.tsx` (update)
- Testing: Playwright test (load, edit, save)

---

### E-2.7: Implement Notifications Preferences in /settings
Complexity: Medium | Dependencies: E-1.7, E-2.6 | Duration: 2-3 days

**E-2.7.1: Create NotificationPreferencesForm component**
- Complexity: Medium
- Acceptance Criteria:
  - Form for notification preferences
  - Includes channel toggles (email, push, SMS)
  - Includes global settings (frequency, quiet hours)
  - Uses shared SettingsFormField component
  - Uses NotificationPrefsSchema validation
- Files: `components/settings/shared/NotificationPreferencesForm.tsx` (create)
- Testing: Unit tests, Storybook

**E-2.7.2: Create notifications API client functions**
- Complexity: Low
- Acceptance Criteria:
  - Functions: getNotificationPreferences, updateNotificationPreferences
  - In `lib/api/notifications.ts`
  - Proper error handling and typing
- Files: `lib/api/notifications.ts` (create)
- Testing: Unit tests (mock API)

**E-2.7.3: Implement Notifications section in /settings**
- Complexity: Medium
- Acceptance Criteria:
  - Uses NotificationPreferencesForm component
  - Fetches data on mount
  - Saves changes to backend
  - Shows loading/error/success states
  - Unsaved changes guard
- Files: `components/settings/sections/NotificationsSection.tsx` (create), `app/settings/page.tsx` (update)
- Testing: Playwright test (load, edit, save)

---

## Epic 3: Multi-Role Profile System (E-3)
Complexity: Very High | Duration: 6-8 weeks | Owner: Frontend + Backend Team

### E-3.1: Role Management API Integration (Backend)
Complexity: High | Dependencies: E-1.5, E-1.6 | Duration: 2-3 weeks

**E-3.1.1: Implement RoleRepository methods**
- Complexity: Medium
- Acceptance Criteria:
  - All CRUD methods implemented and tested
  - Proper async/await patterns
  - Error handling for edge cases
- Files: `apps/backend/src/repositories/role_repository.py`
- Testing: Unit tests (all methods)

**E-3.1.2: Implement TalentProfileRepository methods**
- Complexity: Medium
- Acceptance Criteria:
  - All CRUD methods implemented and tested
  - Proper async/await patterns
  - Error handling for edge cases
- Files: `apps/backend/src/repositories/talent_repository.py`
- Testing: Unit tests (all methods)

**E-3.1.3: Implement IndustryProfileRepository methods**
- Complexity: Medium
- Acceptance Criteria:
  - All CRUD methods implemented and tested
  - Proper async/await patterns
  - Error handling for edge cases
- Files: `apps/backend/src/repositories/industry_repository.py`
- Testing: Unit tests (all methods)

**E-3.1.4: Create role-aware query helpers**
- Complexity: Medium
- Acceptance Criteria:
  - Helpers to filter content by role_profile_id
  - Helpers to check role visibility (public/unlisted/private)
  - Helpers to enforce role ownership
- Files: `apps/backend/src/utils/role_queries.py` (create)
- Testing: Unit tests

**E-3.1.5: Add role_profile_id to Reviews table**
- Complexity: Medium
- Acceptance Criteria:
  - Migration adds nullable role_profile_id column
  - Backfill existing reviews with lover role
  - Update Review model with FK relationship
- Files: `apps/backend/alembic/versions/{timestamp}_add_role_profile_id_to_reviews.py`, `apps/backend/src/models.py`
- Testing: Migration test, model test

**E-3.1.6: Update review endpoints to be role-aware**
- Complexity: High
- Acceptance Criteria:
  - GET /api/v1/reviews filters by role_profile_id
  - POST /api/v1/reviews tags review with current role
  - PUT /api/v1/reviews/{id} validates role ownership
  - DELETE /api/v1/reviews/{id} validates role ownership
- Files: `apps/backend/src/routers/reviews.py`
- Endpoints: GET/POST/PUT/DELETE /api/v1/reviews
- Testing: API tests (role isolation, ownership)

---

### E-3.2: Role Management Frontend Components
Complexity: High | Dependencies: E-2.2, E-2.3 | Duration: 2-3 weeks

**E-3.2.1: Create RoleSwitcher component**
- Complexity: Medium
- Acceptance Criteria:
  - Displays enabled roles for current user
  - Allows switching between roles
  - Shows current role visually
  - Accessible (keyboard navigation, ARIA labels)
  - Responsive (dropdown on mobile, tabs on desktop)
- Files: `components/roles/RoleSwitcher.tsx` (create)
- Testing: Unit tests, Playwright test, Storybook

**E-3.2.2: Create RoleCard component**
- Complexity: Low
- Acceptance Criteria:
  - Displays role information (name, visibility, status)
  - Shows enable/disable toggle
  - Shows edit button
  - Accessible
- Files: `components/roles/RoleCard.tsx` (create)
- Testing: Unit tests, Storybook

**E-3.2.3: Create RoleOnboardingWizard component**
- Complexity: High
- Acceptance Criteria:
  - Multi-step wizard for role activation
  - Step 1: Role selection
  - Step 2: Basic profile info
  - Step 3: Visibility settings
  - Step 4: Confirmation
  - Saves to backend on completion
  - Accessible
- Files: `components/roles/RoleOnboardingWizard.tsx` (create)
- Testing: Unit tests, Playwright test

**E-3.2.4: Create PublicProfilesSection component**
- Complexity: High
- Acceptance Criteria:
  - Displays all user roles with enable/disable toggles
  - Shows visibility settings per role
  - Shows default role selector
  - Integrates with RoleOnboardingWizard
  - Uses useSettingsSection hook
  - Unsaved changes guard
- Files: `components/settings/sections/PublicProfilesSection.tsx` (create)
- Testing: Unit tests, Playwright test

**E-3.2.5: Add PublicProfilesSection to /settings page**
- Complexity: Low
- Acceptance Criteria:
  - PublicProfilesSection added to global /settings
  - Accessible from main navigation
  - Properly integrated with other sections
- Files: `app/settings/page.tsx` (update)
- Testing: Playwright test

---

### E-3.3: Profile Page Multi-Role Support
Complexity: High | Dependencies: E-3.2, E-1.5 | Duration: 2-3 weeks

**E-3.3.1: Update profile page routing to support role segments**
- Complexity: Medium
- Acceptance Criteria:
  - Route: `/profile/[username]/[role]`
  - `/profile/[username]` redirects to default role
  - 404 for disabled/private roles (unless owner)
  - Proper URL handling and deep-linking
- Files: `app/profile/[username]/[[...role]]/page.tsx` (create/update)
- Testing: Playwright test (routing, redirects, 404s)

**E-3.3.2: Create role-specific profile layouts**
- Complexity: High
- Acceptance Criteria:
  - Movie Lover: watchlist, collections, personal reviews
  - Critic: professional reviews, byline, publication
  - Talent: headshot, credits, reel, casting applications
  - Industry: company info, projects, casting calls
  - Each layout uses shared components where possible
- Files: `components/profile/layouts/LoverLayout.tsx`, `CriticLayout.tsx`, `TalentLayout.tsx`, `IndustryLayout.tsx` (create)
- Testing: Playwright test (each layout)

**E-3.3.3: Add role switcher to profile page header**
- Complexity: Medium
- Acceptance Criteria:
  - RoleSwitcher component in profile header
  - Visible only for multi-role users
  - Switches between enabled roles
  - Accessible
- Files: `components/profile/ProfileHeader.tsx` (update)
- Testing: Playwright test

**E-3.3.4: Implement role-specific sections in profile**
- Complexity: High
- Acceptance Criteria:
  - Critic: professional reviews section with badge
  - Talent: portfolio section (headshot, credits, reels)
  - Industry: projects and casting calls sections
  - Each section uses role-aware queries
  - Proper data isolation
- Files: `components/profile/sections/CriticSection.tsx`, `TalentSection.tsx`, `IndustrySection.tsx` (create)
- Testing: Playwright test (each section)

**E-3.3.5: Update profile Settings tab to show role-specific settings**
- Complexity: Medium
- Acceptance Criteria:
  - Settings tab shows role-specific fields
  - Critic: verification status, publication
  - Talent: headshot, primary role, privacy settings
  - Industry: company, role title, casting contact
  - Uses shared form components
- Files: `components/profile/sections/profile-settings.tsx` (update)
- Testing: Playwright test

---

### E-3.4: Role-Specific Settings Modules (Gated)
Complexity: High | Dependencies: E-3.2, E-2.7 | Duration: 2-3 weeks

**E-3.4.1: Create CriticSettingsSection component**
- Complexity: Medium
- Acceptance Criteria:
  - Gated by NEXT_PUBLIC_FEATURE_CRITIC_SETTINGS flag
  - Shows only if user has Critic role
  - Includes verification status, publication, byline
  - Uses shared form components
  - Integrates with /settings page
- Files: `components/settings/sections/CriticSettingsSection.tsx` (create)
- Testing: Unit tests, Playwright test

**E-3.4.2: Create TalentSettingsSection component**
- Complexity: Medium
- Acceptance Criteria:
  - Gated by NEXT_PUBLIC_FEATURE_TALENT_SETTINGS flag
  - Shows only if user has Talent role
  - Includes headshot, primary role, credits, reels
  - Uses shared form components
  - Integrates with /settings page
- Files: `components/settings/sections/TalentSettingsSection.tsx` (create)
- Testing: Unit tests, Playwright test

**E-3.4.3: Create IndustrySettingsSection component**
- Complexity: Medium
- Acceptance Criteria:
  - Gated by NEXT_PUBLIC_FEATURE_INDUSTRY_SETTINGS flag
  - Shows only if user has Industry Professional role
  - Includes company, role title, projects, casting contact
  - Uses shared form components
  - Integrates with /settings page
- Files: `components/settings/sections/IndustrySettingsSection.tsx` (create)
- Testing: Unit tests, Playwright test

**E-3.4.4: Add role-specific sections to /settings page**
- Complexity: Low
- Acceptance Criteria:
  - CriticSettingsSection, TalentSettingsSection, IndustrySettingsSection added to /settings
  - Conditionally rendered based on flags and user roles
  - Properly integrated with other sections
- Files: `app/settings/page.tsx` (update)
- Testing: Playwright test

---

## Epic 4: Testing & QA (E-4)
Complexity: High | Duration: 3-4 weeks | Owner: QA Team

### E-4.1: API Tests
Complexity: High | Dependencies: E-1 | Duration: 2-3 weeks

**E-4.1.1: Test GET /api/v1/auth/me endpoint**
- Complexity: Low
- Acceptance Criteria:
  - Test authenticated request returns user + roles
  - Test unauthenticated request returns 401
  - Test response schema matches OpenAPI
- Files: `apps/backend/tests/test_auth.py` (create/update)
- Testing: pytest

**E-4.1.2: Test role management endpoints**
- Complexity: Medium
- Acceptance Criteria:
  - Test GET /api/v1/roles returns all roles
  - Test PUT /api/v1/roles/{role_type} updates role
  - Test POST /api/v1/roles/{role_type}/activate creates profile
  - Test POST /api/v1/roles/{role_type}/deactivate preserves data
  - Test validation and constraints
- Files: `apps/backend/tests/test_roles.py` (create)
- Testing: pytest

**E-4.1.3: Test role-aware review endpoints**
- Complexity: Medium
- Acceptance Criteria:
  - Test reviews tagged with role_profile_id
  - Test role isolation (can't access other role's reviews)
  - Test ownership validation
  - Test visibility filtering
- Files: `apps/backend/tests/test_reviews_role_aware.py` (create)
- Testing: pytest

**E-4.1.4: Test notifications preferences endpoints**
- Complexity: Low
- Acceptance Criteria:
  - Test GET /api/v1/notifications/preferences returns preferences
  - Test PUT /api/v1/notifications/preferences updates preferences
  - Test validation
- Files: `apps/backend/tests/test_notifications.py` (create/update)
- Testing: pytest

**E-4.1.5: Contract tests for all settings endpoints**
- Complexity: Medium
- Acceptance Criteria:
  - Use schemathesis to test all /api/v1/settings* endpoints
  - Use schemathesis to test all /api/v1/roles* endpoints
  - Use schemathesis to test /api/v1/notifications/preferences
  - All tests pass
- Files: `apps/backend/tests/test_contract_settings.py` (create)
- Testing: schemathesis

---

### E-4.2: Frontend Component Tests
Complexity: High | Dependencies: E-2, E-3 | Duration: 2-3 weeks

**E-4.2.1: Test shared form components**
- Complexity: Medium
- Acceptance Criteria:
  - Test SettingsFormField renders correctly
  - Test SettingsSection renders correctly
  - Test form submission and error handling
  - Test accessibility (ARIA labels, keyboard navigation)
- Files: `components/settings/shared/__tests__/` (create)
- Testing: Jest + React Testing Library

**E-4.2.2: Test extracted form components**
- Complexity: Medium
- Acceptance Criteria:
  - Test ProfileBasicsForm, AccountInfoForm, etc.
  - Test form validation
  - Test form submission
  - Test error handling
- Files: `components/settings/shared/__tests__/` (create)
- Testing: Jest + React Testing Library

**E-4.2.3: Test role components**
- Complexity: Medium
- Acceptance Criteria:
  - Test RoleSwitcher renders correctly
  - Test RoleCard renders correctly
  - Test RoleOnboardingWizard flow
  - Test accessibility
- Files: `components/roles/__tests__/` (create)
- Testing: Jest + React Testing Library

**E-4.2.4: Test custom hooks**
- Complexity: Medium
- Acceptance Criteria:
  - Test useUnsavedChanges hook
  - Test useSettingsSection hook
  - Test error handling
  - Test state management
- Files: `lib/hooks/__tests__/` (create)
- Testing: Jest + React Testing Library

---

### E-4.3: Playwright GUI Tests
Complexity: High | Dependencies: E-2, E-3 | Duration: 2-3 weeks

**E-4.3.1: Test /settings page authentication**
- Complexity: Low
- Acceptance Criteria:
  - Test unauthenticated access redirects to login
  - Test authenticated access allowed
  - Test redirect back to /settings after login
- Files: `e2e/settings.spec.ts` (create)
- Testing: Playwright

**E-4.3.2: Test /settings page sections**
- Complexity: High
- Acceptance Criteria:
  - Test Profile section: load, edit, save
  - Test Account section: load, edit, save, password change
  - Test Privacy section: load, edit, save
  - Test Display section: load, edit, save
  - Test Preferences section: load, edit, save
  - Test Notifications section: load, edit, save
  - Test unsaved changes guard
  - Test error handling
- Files: `e2e/settings.spec.ts` (create)
- Testing: Playwright

**E-4.3.3: Test profile Settings tab**
- Complexity: Medium
- Acceptance Criteria:
  - Test all tabs load correctly
  - Test edit and save functionality
  - Test "Open full settings" CTA
  - Test unsaved changes guard
- Files: `e2e/profile-settings.spec.ts` (create)
- Testing: Playwright

**E-4.3.4: Test role management UI**
- Complexity: High
- Acceptance Criteria:
  - Test PublicProfilesSection loads
  - Test enable/disable role toggles
  - Test visibility settings
  - Test default role selection
  - Test RoleOnboardingWizard flow
  - Test role switcher on profile page
  - Test role-specific profile layouts
- Files: `e2e/roles.spec.ts` (create)
- Testing: Playwright

**E-4.3.5: Test multi-role profile pages**
- Complexity: High
- Acceptance Criteria:
  - Test /profile/[username]/lover page
  - Test /profile/[username]/critic page
  - Test /profile/[username]/talent page
  - Test /profile/[username]/industry page
  - Test /profile/[username] redirects to default role
  - Test 404 for disabled/private roles
  - Test role switcher functionality
  - Test role-specific sections
- Files: `e2e/profile-roles.spec.ts` (create)
- Testing: Playwright

**E-4.3.6: Test role-specific settings sections**
- Complexity: Medium
- Acceptance Criteria:
  - Test CriticSettingsSection (if flag enabled)
  - Test TalentSettingsSection (if flag enabled)
  - Test IndustrySettingsSection (if flag enabled)
  - Test feature flags work correctly
- Files: `e2e/role-settings.spec.ts` (create)
- Testing: Playwright

---

### E-4.4: Accessibility & Performance Tests
Complexity: Medium | Dependencies: E-2, E-3 | Duration: 1-2 weeks

**E-4.4.1: Accessibility audit for /settings page**
- Complexity: Medium
- Acceptance Criteria:
  - No WCAG 2.1 AA violations
  - Keyboard navigation works
  - Screen reader compatible
  - Color contrast sufficient
- Files: `e2e/accessibility.spec.ts` (create)
- Testing: Playwright + axe-core

**E-4.4.2: Accessibility audit for profile pages**
- Complexity: Medium
- Acceptance Criteria:
  - No WCAG 2.1 AA violations
  - Keyboard navigation works
  - Screen reader compatible
  - Color contrast sufficient
- Files: `e2e/accessibility.spec.ts` (update)
- Testing: Playwright + axe-core

**E-4.4.3: Performance tests for /settings page**
- Complexity: Medium
- Acceptance Criteria:
  - Page load time < 2s
  - First Contentful Paint < 1s
  - Largest Contentful Paint < 2.5s
  - Cumulative Layout Shift < 0.1
- Files: `e2e/performance.spec.ts` (create)
- Testing: Playwright + Web Vitals

**E-4.4.4: Performance tests for profile pages**
- Complexity: Medium
- Acceptance Criteria:
  - Page load time < 2s
  - First Contentful Paint < 1s
  - Largest Contentful Paint < 2.5s
  - Cumulative Layout Shift < 0.1
- Files: `e2e/performance.spec.ts` (update)
- Testing: Playwright + Web Vitals

---

## Epic 5: Documentation & Deployment (E-5)
Complexity: Medium | Duration: 1-2 weeks | Owner: DevOps + Tech Lead

### E-5.1: API Documentation
Complexity: Low | Dependencies: E-1 | Duration: 3-4 days

**E-5.1.1: Document role management endpoints in OpenAPI**
- Complexity: Low
- Acceptance Criteria:
  - All endpoints documented with request/response schemas
  - Examples provided
  - Error codes documented
- Files: OpenAPI spec (auto-generated or manual)
- Testing: OpenAPI validation

**E-5.1.2: Document settings endpoints in OpenAPI**
- Complexity: Low
- Acceptance Criteria:
  - All endpoints documented with request/response schemas
  - Examples provided
  - Error codes documented
- Files: OpenAPI spec (auto-generated or manual)
- Testing: OpenAPI validation

---

### E-5.2: Frontend Documentation
Complexity: Low | Dependencies: E-2, E-3 | Duration: 3-4 days

**E-5.2.1: Document shared components in Storybook**
- Complexity: Low
- Acceptance Criteria:
  - All shared components have Storybook stories
  - Stories include examples and props documentation
  - Accessibility notes included
- Files: `components/**/*.stories.tsx` (create)
- Testing: Storybook build

**E-5.2.2: Document custom hooks**
- Complexity: Low
- Acceptance Criteria:
  - All custom hooks documented with JSDoc
  - Usage examples provided
  - Error handling documented
- Files: `lib/hooks/**/*.ts` (update)
- Testing: TypeScript compilation

---

### E-5.3: Deployment & Rollout
Complexity: Medium | Dependencies: E-4 | Duration: 1-2 weeks

**E-5.3.1: Create feature flag configuration**
- Complexity: Low
- Acceptance Criteria:
  - Feature flags defined in .env files
  - Defaults set per environment (dev/staging/prod)
  - Documentation on how to toggle flags
- Files: `.env.example`, `.env.local` (update)
- Testing: Manual verification

**E-5.3.2: Create deployment checklist**
- Complexity: Low
- Acceptance Criteria:
  - Step-by-step deployment guide
  - Database migration steps
  - Feature flag rollout plan
  - Rollback procedures
- Files: `docs/DEPLOYMENT.md` (create)
- Testing: Manual review

**E-5.3.3: Deploy to staging environment**
- Complexity: Medium
- Acceptance Criteria:
  - All code deployed to staging
  - All tests passing
  - Feature flags configured
  - Manual QA completed
- Files: CI/CD pipeline (update)
- Testing: Manual verification

**E-5.3.4: Deploy to production**
- Complexity: Medium
- Acceptance Criteria:
  - All code deployed to production
  - All tests passing
  - Feature flags configured (role settings flags OFF initially)
  - Monitoring and alerts configured
  - Rollback plan ready
- Files: CI/CD pipeline (update)
- Testing: Manual verification

---

## Summary Statistics

| Epic | Tasks | Complexity | Duration | Owner |
|------|-------|-----------|----------|-------|
| E-1: Backend Infrastructure | 35+ | High | 3-4 weeks | Backend |
| E-2: Frontend Settings | 40+ | High | 4-5 weeks | Frontend |
| E-3: Multi-Role System | 30+ | Very High | 6-8 weeks | Frontend + Backend |
| E-4: Testing & QA | 25+ | High | 3-4 weeks | QA |
| E-5: Documentation & Deployment | 10+ | Medium | 1-2 weeks | DevOps + Tech Lead |
| **TOTAL** | **140+** | **High** | **12-16 weeks** | **Cross-functional** |

---

## Parallel Work Streams

- **Stream A (Backend):** E-1 tasks can run in parallel (migrations, models, repositories, endpoints)
- **Stream B (Frontend Settings):** E-2 tasks depend on E-1.1 (auth/me endpoint) but can otherwise run in parallel
- **Stream C (Multi-Role):** E-3 tasks depend on E-1 and E-2 completion; can start after E-1.2 (user_role_profiles table)
- **Stream D (Testing):** E-4 tasks can run in parallel with E-1, E-2, E-3 (test-driven development)
- **Stream E (Deployment):** E-5 tasks run after E-4 completion

---

## Next Steps

1. ✅ Review and approve this task breakdown
2. ⏳ Assign tasks to team members
3. ⏳ Create GitHub issues from tasks
4. ⏳ Begin implementation (Stream A: Backend Infrastructure)
5. ⏳ Track progress and adjust timeline as needed

