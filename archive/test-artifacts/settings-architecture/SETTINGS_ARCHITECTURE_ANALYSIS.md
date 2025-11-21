# Settings Architecture Analysis (Phase 1) — IWM (I Watch Movies)

Date: 2025-10-29
Scope: Deep read-only analysis of current settings architecture across frontend (Next.js) and backend (FastAPI). No code changes were made.

## TL;DR (Findings Only — no recommendations yet)
- Both a global Settings page (`/settings`) and a Profile-embedded Settings tab (`/profile/[username]?section=settings`) exist.
- Backend provides a unified, authenticated settings API under `/api/v1/settings/*` backed by a single `user_settings` table (JSONB columns per section).
- Profile-embedded Settings is wired to real API (lib/api/settings.ts). Global `/settings` page currently uses mock/local state (not integrated) and is not protected by middleware.
- Roles are multi-valued; users can simultaneously be "User", "Talent", "Industry Professional", etc. Additional per-role profiles exist (e.g., CriticProfile).
- Result: duplicated UX surfaces, partial integration divergence, and route protection gap for `/settings`.

---

## 1) Current Frontend Structure

### 1.1 Global Settings Page
- Route: `app/settings/page.tsx`
- Categories: Account, Profile, Privacy, Notifications, Display, Preferences
- Uses UI components under `components/settings/*` (AccountSettings, ProfileSettings, PrivacySettings, NotificationSettings, DisplaySettings, PreferencesSettings)
- Observation: These components hold mock state and console/alert stubs, not calling real API.

Evidence:
- `components/settings/account-settings.tsx` shows mock `userData` and no API calls.
- `components/settings/privacy-settings.tsx` manages local `useState`, `alert`, and simulated network delay.

### 1.2 Profile-Embedded Settings Tab
- Component: `components/profile/sections/profile-settings.tsx`
- Tabs: Profile, Account, Preferences, Display, Privacy
- Status: Recently implemented with full realtime API integration via `lib/api/settings.ts` (GET/PUT per section)

Evidence:
- Tabs for five sections are rendered; handlers call `lib/api/settings.ts` functions.

### 1.3 Navigation & Protection
- Navbar exposes a link to `/settings` in profile dropdown: `components/navigation/profile-dropdown.tsx`
- Middleware route protection in `middleware.ts` includes: `/dashboard`, `/profile`, `/watchlist`, `/favorites`, `/collections`, `/reviews/new`, `/pulse`, `/notifications`.
- Observation: `/settings` is NOT in `protectedRoutes`. A user without `access_token` could load the page (even though components are mock-only today).

---

## 2) Backend Settings Architecture

### 2.1 Router
- File: `apps/backend/src/routers/settings.py`
- Auth: All routes depend on `get_current_user` (JWT-based auth).
- Endpoints: `GET/PUT /settings`, `/settings/{account|profile|privacy|display|preferences}`

### 2.2 Persistence
- Table: `UserSettings` in `apps/backend/src/models.py`
- JSONB columns: `account, profile, privacy, display, preferences, security, integrations, data` with `updated_at`.
- System-wide settings also exist via `SystemSettings` (separate from per-user).

### 2.3 Frontend API Client (integrated in Profile tab)
- File: `lib/api/settings.ts`
- Implements: `get/update {all, profile, account, privacy, display, preferences}` with `credentials: 'include'` and `NEXT_PUBLIC_API_BASE_URL`.

---

## 3) Users, Roles, and Specialized Profiles

### 3.1 Roles & Status Metadata
- Model: `AdminUserMeta` with fields `roles` (JSONB array), `status`, `profile_type`, `verification_status`, `account_type`, `phone_number`, `location`.
- Interpretation: A single user can have multiple roles concurrently (e.g., regular user + talent + critic).

### 3.2 Specialized Profiles
- Model: `CriticProfile` for verified critics; includes fields like `username`, `display_name`, `bio`, verification attributes, and analytics counters.
- Observation: The domain anticipates role-based profile extensions beyond generic user info.

---

## 4) Duplication and Divergence Snapshot

| Aspect | Profile Settings Tab | Global /settings Page |
|---|---|---|
| Integration | Real API via `lib/api/settings.ts` | Mock/local state (no API) |
| Sections | Profile, Account, Preferences, Display, Privacy | Account, Profile, Privacy, Notifications, Display, Preferences |
| Route Protection | Yes (profile is protected by middleware) | No (not in middleware protected list) |
| Navigation Entry | From profile tabs | Profile dropdown -> Settings |
| Consistency | Reflects backend schema | Diverges (Notifications UI exists but backend settings here are not wired) |

Implication: Users have two different places to change settings; one persists, the other currently does not. Potential for confusion and data drift if both are wired independently without a single-source-of-truth strategy.

---

## 5) Information Architecture Observations (Findings)

- The backend contract intentionally groups settings by section (JSONB per section) allowing flexible growth per category.
- The frontend currently has duplicated presentation for the same categories, but with different integration levels.
- There is an additional domain precedent for specialized settings pages (e.g., `app/admin/talent-hub/settings/page.tsx`), suggesting future role-based settings areas (Talent, Industry Pro, Critic) are expected.
- Middleware omits `/settings` from protected routes. Even if the page is UI-only today, it should align with the rest of protected user areas when integrated.
- Notification preferences appear modeled in backend as `NotificationPreference` (separate table), indicating that “Notifications” under `/settings` likely needs its own API wiring distinct from `UserSettings`.

---

## 6) Concrete Evidence (file and line references)

- Global page: `app/settings/page.tsx` — categories declared (lines ~15–22) and content switched via local state; no API calls in the page itself.
- Mock components: `components/settings/account-settings.tsx` (lines 17–25 mock userData), `components/settings/privacy-settings.tsx` (useState + alert stubs).
- Profile settings: `components/profile/sections/profile-settings.tsx` — 5 `TabsTrigger` values: `profile`, `account`, `preferences`, `display`, `privacy` and handlers use `lib/api/settings.ts`.
- API client: `lib/api/settings.ts` — implements GET/PUT for each section with `credentials: 'include'`.
- Router: `apps/backend/src/routers/settings.py` — all endpoints depend on `get_current_user`.
- Models: `apps/backend/src/models.py` — `UserSettings` JSONB columns; `AdminUserMeta` roles array; `NotificationPreference` separate; `CriticProfile` specialized profile.
- Middleware: `middleware.ts` — `/settings` not included in `protectedRoutes`.

---

## 7) Gaps and Risks (as-is)

- Route protection gap for `/settings` (not in protected list).
- UX duplication: two entry points with overlapping categories; only one persists changes today.
- Inconsistency: Notifications appears in `/settings` UI but not wired to backend preferences yet.
- Maintainability: risk of divergent validation, copy, and flows between duplicate UIs if both are maintained in parallel without shared components/contracts.
- Future roles: No explicit partitioning today for role-specific settings (Talent, Critic, Industry Pro), despite backend support for role metadata and specialized profiles.

---

## 8) Clarifications Inferred from Code (no assumptions beyond code)

- The project already anticipates domain-specific settings pages (admin talent hub), which supports the need for scoped settings beyond generic account/profile.
- The backend’s sectioned JSONB model is compatible with both a single global settings UI and multiple context-specific UIs, provided they share the same contract.

---

## 9) Ready for Phase 2

This analysis compiles the code-level state and discrepancies. Next (Phase 2), we will present architecture options (Profile-only, Global-only, Hybrid), compare trade-offs, address multi-role user scenarios (e.g., a single user acting as movie lover + critic + talent pro), and provide a reasoned recommendation with a future-proof organization strategy. No changes will be made until you approve a direction.

