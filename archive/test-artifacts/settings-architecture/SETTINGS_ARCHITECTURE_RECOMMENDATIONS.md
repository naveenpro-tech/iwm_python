# Phase 2 — Strategic Analysis & Recommendations: Settings Architecture (IWM)

Date: 2025-10-29
Scope: Strategy only. No code changes. Builds on Phase 1 analysis in `SETTINGS_ARCHITECTURE_ANALYSIS.md`.

## Executive Summary (TL;DR)
- Recommend Option C: Hybrid Architecture.
- Make `/settings` the canonical, complete settings hub (single source of truth) for all account-, privacy-, display-, preferences-, notifications-, and role-specific settings.
- Keep the Profile page “Settings” tab as a curated, context-only quick-edit surface for public-facing profile attributes and a few convenient toggles.
- Introduce role-specific settings modules under the global hub (e.g., Critic, Talent, Industry Pro), conditionally visible based on `AdminUserMeta.roles` and specialized profile existence (e.g., `CriticProfile`).
- Ensure both surfaces use the same API client and shared UI building blocks to avoid duplication.
- Add route protection for `/settings` and wire the global components to real APIs in a staged migration.

Rationale: This balances UX (edit-in-context + comprehensive hub), reduces confusion, scales for multi-role users, and cleanly supports future service decomposition.

---

## Section A: Architecture Options Comparison

### Option A — Profile-Embedded Only (remove global `/settings`)
- Pros:
  - Strong in-context editing experience (“edit what you see”).
  - Minimal navigation overhead; fewer distinct pages.
  - Fastest short-term if profile tab already wired to API.
- Cons:
  - Conflates public persona with account/security/notifications; discoverability suffers.
  - Struggles with multi-role complexity; profile tab becomes bloated.
  - Hard to fit specialized modules (Critic/Talent/Industry) into a single profile page IA.
  - Long-term maintainability risk; harder to scale and organize.
- UX impact: Good for quick edits, poor for comprehensive settings and role depth.
- Implementation complexity: Low now; rises steeply as features/roles grow.
- Maintenance burden: High over time (UI bloat, duplication of concerns).
- Future scalability: Poor; not well-suited to multiple roles and domains.

### Option B — Global `/settings` Only (remove profile tab)
- Pros:
  - Single canonical location; clear discoverability from nav/profile dropdown.
  - Strong organization potential; easy to add new categories/modules.
  - Simplifies contracts and testing (one surface for all editing).
  - Microservices-ready: map modules to dedicated services later.
- Cons:
  - Loses “edit-in-context” convenience; users must leave profile to tweak visuals.
  - Some friction for small, frequent edits (bio, avatar, display name).
- UX impact: Clear, comprehensive, but less contextual.
- Implementation complexity: Moderate (wire up APIs, IA design) but linear.
- Maintenance burden: Lower than A; clear ownership of modules.
- Future scalability: Good; easy to grow roles/modules.

### Option C — Hybrid (recommended)
- Pros:
  - Best of both worlds: quick profile edits in context + full canonical hub.
  - Clear separation of concerns; better IA and scalability for multi-role users.
  - Allows role-specific settings modules to live under the global hub.
  - With shared components/contracts, duplication is minimized.
- Cons:
  - Requires discipline and initial component extraction to avoid divergence.
  - Slightly more upfront work to wire `/settings` and protect route.
- UX impact: Excellent overall—fast edits plus comprehensive control.
- Implementation complexity: Moderate-high initially; pays off long-term.
- Maintenance burden: Low if shared components and API client are enforced.
- Future scalability: Excellent; plug-in style modules per role/domain.

---

## Section B: Multi-Role User Scenario

“How do we manage a user who logs in with email but acts as movie lover AND critic AND talent pro?”

### Organizing principles
- Layered settings model:
  1) Account & Security (applies to all roles): email, password, 2FA, phone, login notifications.
  2) Global Personalization (applies across app): language, region, display theme, spoiler settings, content maturity, notifications.
  3) Public Profile (persona exposed to others): display name, bio, avatar, social links, public visibility.
  4) Role-Specific Modules (conditional): Critic, Talent, Industry Pro, Moderator/Admin—each with its own subsettings.

### Placement
- Global `/settings` hub:
  - Account, Privacy, Display, Preferences, Notifications (canonical).
  - Role-specific sections: “Critic Settings”, “Talent Settings”, “Industry Pro Settings” tabs/panels, shown only if the user has the role or a CTA to apply/verify.
- Profile “Settings” tab:
  - Curated subset: public-facing attributes and a few convenience toggles related to the profile page (display name, bio, avatar/banner, profile visibility, link to full settings).
  - Avoid account/security/notifications here to prevent confusion.

### Concrete examples of role modules
- Critic: Publication/byline, rating scale preferences, verification status & docs, review syndication toggles, professional links, display signature.
- Talent: Portfolio links, availability, representation contact, headshots/banner, casting visibility preferences.
- Industry Pro: Company affiliation, role/department, press/industry badge, collaboration contact, portfolio/showcase links.

### Data model guidance
- Generic preferences remain in `UserSettings` JSONB sections (profile, preferences, display, privacy).
- Role-specific profiles remain in dedicated tables (e.g., `CriticProfile`) for structural/relational data; role-specific “options” can be:
  - A) Additional JSONB sub-objects under `UserSettings.role_settings.{role}` for lightweight preferences, OR
  - B) JSONB columns on the role’s own table (e.g., `critic_profiles.settings`) if tightly-coupled to that domain.
- Notifications use `NotificationPreference` as today; surface it under the global hub.

---

## Section C: Recommended Architecture (Option C — Hybrid)

### Separation of concerns
- Canonical hub: `/settings`.
  - Contains all account-wide, privacy, display, preferences, notifications, and role-specific settings.
  - Shows context-aware modules based on `AdminUserMeta.roles` and presence of specialized profiles (e.g., `CriticProfile`).
- Profile tab “Settings”: curated quick-edit subset strictly for public-facing profile attributes and a few visibility toggles + a “Open full settings” CTA.

### Settings hierarchy (proposed IA)
- Settings
  - Account & Security
  - Privacy
  - Display
  - Preferences
  - Notifications
  - Roles
    - Critic
    - Talent
    - Industry Professional
    - Moderator/Admin (if applicable)

### Navigation and discoverability
- Primary access via profile dropdown -> “Settings” (always goes to global hub).
- Secondary in-context access via `/profile/[username]?section=settings` for quick persona edits; include a persistent banner link “For advanced settings, go to Settings”.
- Role-specific surfaces may add entry points (e.g., Admin/Talent Hub settings) but point to the same underlying modules/types.

### Single source of truth
- Both surfaces consume a shared API client and shared UI atoms/molecules, ensuring consistent validation, error handling, and copy.
- Contracts and types centralized in `packages/shared` (backend OpenAPI → generated TS types) as per monorepo policy.

---

## Section D: Future-Proofing Strategy
- Role growth: Add new role modules under the global hub with feature-flagged visibility and runtime checks against `roles`.
- Microservice readiness: Settings APIs remain versioned under `/api/v1`. Later, role modules can be split into services; frontend continues to import types from `packages/shared`.
- Contract stability: Schema-first approach; CI generates TypeScript types from OpenAPI and runs contract tests.
- Extensibility: Encapsulate each role module as a self-contained component bundle reusing shared form primitives and validators.
- Observability: Add structured logs and metrics for settings changes; support audit events in future.

---

## Section E: Implementation Considerations (no changes yet)

### Route protection
- Add `/settings` to `middleware.ts` protected routes (requires `access_token`). Redirect unauthenticated users to `/login`.

### API integration
- Wire global `/settings` components to the real API:
  - Reuse `lib/api/settings.ts` for `profile`, `account`, `privacy`, `display`, `preferences`.
  - Add a small client for `NotificationPreference` endpoints (if present) or extend the router accordingly.
- Ensure `credentials: 'include'`, robust error handling, and toast/inline validation parity with the profile tab.

### Component reuse strategy
- Extract shared form sections (e.g., ProfileBasicsForm, PrivacyToggles, DisplayTheme, LanguageRegionPicker) used by both profile-tab and `/settings` pages.
- Centralize validation schemas (Zod/Yup) and messages so both surfaces behave identically.
- Store shared types in `packages/shared`; generate from OpenAPI in CI.

### Migration path (staged; low risk)
1) Protect `/settings` route (middleware).
2) Component extraction: factor shared sections out of `components/profile/sections/profile-settings.tsx` into reusables.
3) Wire global `/settings` categories to API using shared components.
4) Remove mock/local state from global components; ensure toasts, loading, and error states are consistent.
5) Introduce Notifications wiring via `NotificationPreference` API.
6) Add role modules to global hub; hide behind role checks and feature flags.
7) QA & tests: API tests, Playwright flows covering both entry points; contract tests in CI.

### Risks and mitigations
- Divergence risk between two surfaces → Mitigate by shared components/types and a canonical hub owning advanced settings.
- User confusion → Clear copy and CTA from profile tab to global hub; consistent naming.
- Backward compatibility → Maintain both entry points; no breaking changes to URLs; incremental rollout.

---

## Discussion Points for Approval
1) Confirm Option C (Hybrid) as the target architecture.
2) Approve adding `/settings` to protected routes.
3) Approve wiring `/settings` components to the real API and extracting shared components.
4) Confirm role modules to stage first (Critic, Talent, Industry Pro) and any feature flags.
5) Confirm the Notifications preferences scope and API endpoints.

If approved, I will prepare Phase 3: a step-by-step migration plan with tasks, owners, and tests.

