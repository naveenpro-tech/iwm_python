# Phase 3 — Implementation Plan: Hybrid Settings Architecture (IWM)

Date: 2025-10-29
Scope: Detailed, step-by-step plan to implement the Hybrid Settings architecture approved in Phase 2. Strategy only; no code changes in this document.

## 0) Executive Summary
Implement the Hybrid model:
- Global `/settings` as canonical hub (Account, Privacy, Display, Preferences, Notifications, Role-specific)
- Profile page Settings tab: quick-edit of public persona fields only
- Shared components, validation, and API client across both surfaces
- Add route protection for `/settings`
- Stage role-specific settings (Critic/Talent/Industry) behind role checks and feature flags

---

## 1) Implementation Sequence (ordered with dependencies)
1. Route Protection (middleware)
   - Add `/settings` to `protectedRoutes` and verify redirect-to-login on missing token.
2. Shared Contracts & Types
   - Confirm types for settings sections in `packages/shared` (generated from OpenAPI in CI or manually synced for now).
   - Align `lib/api/settings.ts` types with shared ones.
3. Component Extraction (from profile tab)
   - Extract sub-forms and primitives into `components/settings/shared/*`.
   - Centralize validation and error toasts.
4. Wire Global `/settings` to Real API
   - Replace mock/local state with real fetch/update per section.
   - Add consistent loading/success/error states and unsaved change guards.
5. Notifications Preferences
   - Create small API client for `/api/v1/notifications/preferences` (GET/PUT) and wire UI.
6. Role-Specific Settings (Gated)
   - Conditionally render Critic/Talent/Industry sections based on roles (`AdminUserMeta.roles`) and profile existence (e.g., `CriticProfile`).
   - Feature-flag for staged rollout.
7. QA & Testing
   - API tests for all settings endpoints and notifications.
   - Playwright GUI flows for both `/settings` and profile quick-edit.
   - Contract tests in CI (schemathesis or pytest-openapi).
8. Rollout
   - Dev → Staging (feature flags on) → Production; gradual enablement of role modules.

---

## 2) Component Extraction Strategy
Source: `components/profile/sections/profile-settings.tsx` (integrated implementation)

Extract these logical sections into reusable components:
- ProfileBasicsForm (avatar, name/display name, bio)
- AccountInfoForm (name/email/phone)
- PasswordChangeForm (current/new/confirm with strength + confirmation checks)
- PreferencesForm (language, region, spoilers, excludedGenres, contentRating)
- DisplayForm (theme, fontSize, highContrastMode, reduceMotion)
- PrivacyForm (profileVisibility, activitySharing, messageRequests, dataDownloadRequested)

Placement & conventions:
- UI: `components/settings/shared/` (atoms/molecules) + `components/settings/sections/` (feature sections)
- Validation: `lib/validation/settings.ts` (Zod schemas) — single source reused by both pages
- Types: `packages/shared` (generated from OpenAPI or Pydantic→TS), imported by FE
- State utils: `lib/settings/state.ts` — normalize defaults, deep-merge helpers

---

## 3) API Integration Tasks (Global `/settings`)
Page: `app/settings/page.tsx`
- Fetch on mount per category using `lib/api/settings.ts` (already integrated in profile tab)
- Replace mock components under `components/settings/*` to consume shared sections
- Implement onSave handlers that call the corresponding PUT endpoints
- Surface success toasts and inline errors consistently

Endpoints (already present):
- `GET/PUT /api/v1/settings` (all)
- `GET/PUT /api/v1/settings/{profile|account|privacy|display|preferences}`
Notifications (separate domain):
- `GET/PUT /api/v1/notifications/preferences`

Example integration pattern (Account):
- on mount: `const data = await getAccountSettings()` → set form state
- on save: `await updateAccountSettings(form)` → success toast, refetch or optimistic update

---

## 4) Route Protection Updates
File: `middleware.ts`
- Add `"/settings"` to `protectedRoutes`
- Behavior: if unauthenticated, redirect to `/login?redirect=/settings`
- Validate no conflicts with `publicRoutes`

---

## 5) Shared Component Architecture
- Shared UI primitives (labeled form fields, select, toggle rows, section containers)
- Shared validation (Zod) for each section: `AccountSchema`, `ProfileSchema`, `PrivacySchema`, `DisplaySchema`, `PreferencesSchema` (+ `NotificationPrefsSchema`)
- Shared hooks: `useSettingsSection(sectionId)` to abstract loading/saving logic
- Error handling: standard `try/catch` with typed errors, toast on failures, inline field errors via Zod resolver
- Accessibility: proper labels, aria-invalid, keyboard navigation; dark-mode friendly

---

## 6) Role-Specific Settings Modules (Critic, Talent, Industry)
- Visibility logic:
  - Fetch current user + roles (`AdminUserMeta.roles`) and presence of specialized profiles (e.g., `CriticProfile` via `/api/v1/critics` or a dedicated “me” endpoint)
  - Conditionally render: `Settings → Roles → Critic/Talent/Industry`
- Feature flags: `NEXT_PUBLIC_FEATURE_CRITIC_SETTINGS`, `..._TALENT_SETTINGS`, `..._INDUSTRY_SETTINGS`
- Each module uses shared primitives (forms, toasts, schema validation) and their own API clients (to be implemented during domain rollout)

---

## 7) Testing Requirements
API tests:
- Settings: GET/PUT for profile/account/privacy/display/preferences (happy + validation errors)
- Notifications: GET/PUT preferences; verify defaults and updates persisted
- Auth: middleware behavior for `/settings`

Playwright GUI tests:
- `/settings` landing requires auth; redirect flow when unauthenticated
- Each section loads data, allows change, persists, shows success toast, and reloads with values
- Profile quick-edit: update public fields; CTA navigates to `/settings`
- Visual regression (critical forms)

Contract tests:
- Schemathesis against `/api/v1/settings*` and `/api/v1/notifications/preferences`

---

## 8) Risk Assessment & Mitigation
- Divergence between profile tab and `/settings`
  - Mitigation: shared components + schemas; profile tab imports the same modules
- Inconsistent validation across surfaces
  - Mitigation: single Zod schemas used everywhere
- Route protection regressions
  - Mitigation: targeted middleware tests; manual QA paths
- API error handling differences
  - Mitigation: shared hook `useSettingsSection` centralizes fetch/save/error patterns
- Notifications model mismatch
  - Mitigation: small adapter in API client to map `{channels, global}` consistently

---

## 9) Rollout Strategy
- Phase A: Protect `/settings`, extract components, wire Profile + Account sections
- Phase B: Wire Privacy, Display, Preferences; add unsaved-change guards
- Phase C: Integrate Notifications preferences
- Phase D: Introduce role-specific settings sections behind flags (Critic → Talent → Industry)
- Phase E: Hardening: E2E + contract + a11y checks; collect feedback

Environments:
- Dev (feature flags on)
- Staging (limited beta users)
- Production (progressive rollout of role modules)

---

## 10) Success Criteria
- `/settings` requires auth; loads and saves all sections with zero console errors
- Profile tab and `/settings` render identical values for overlapping fields
- Notifications preferences persist and reflect defaults correctly
- >95% automated test pass rate; no blocking accessibility violations
- No duplicated validation logic in codebase (single schemas)

---

## 11) Discussion Points (pre-implementation)
- Confirm storage of validation schemas (repo location) and type generation flow (OpenAPI → TS)
- Confirm how to fetch roles: do we expose a `GET /api/v1/auth/me` including `roles` and profile presence, or compose from existing endpoints?
- Confirm copy, labels, and empty states (content design)
- Confirm feature flags naming and default states per environment
- Confirm unsaved changes guard across all settings sections

