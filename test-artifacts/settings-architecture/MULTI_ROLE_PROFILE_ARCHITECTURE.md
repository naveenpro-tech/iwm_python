# Multi-Role Profile Architecture  Strategic Plan (IWM)

Date: 2025-10-29
Scope: Formalizes the approved multi-role profile strategy. Strategy only; no code changes in this document.

## 1) Executive Summary (TL;DR)
- Single account identity; multiple public personas per role (Movie Lover, Critic, Talent Professional, Industry Professional). Moderator/Admin are non-public.
- Routing: `/profile/[username]/[role]` (e.g., `/profile/naveen/critic`), with `/profile/[username]` redirecting to the user-configured default role.
- Data isolation: Strict role scoping using role-specific profiles (existing `CriticProfile`, new `TalentProfile`, `IndustryProfile`) and a `user_role_profiles` table to manage enablement, visibility, and defaults.
- Settings integration: Global `/settings` adds "Public Profiles (Roles)" to enable/disable roles, set visibility (Public/Unlisted/Private), choose default role, and launch onboarding wizards.
- Migration: Default existing content to Movie Lover; preserve data when disabling roles; maintain backward-compatible URLs via redirect.

---

## 2) Routing & URL Architecture
- Canonical routes:
  - Movie Lover (default): `/profile/[username]/lover` (alias of base persona)
  - Critic: `/profile/[username]/critic`
  - Talent Professional: `/profile/[username]/talent`
  - Industry Professional: `/profile/[username]/industry`
- Default redirect:
  - `/profile/[username]`  redirects (302) to `/profile/[username]/{defaultRole}`
- 404 vs visibility:
  - If role disabled or `visibility=private`, show 404 (or 403 for authenticated owner/admin). `visibility=unlisted` renders page but not discoverable/searchable.
- Deep-links & tabs:
  - Section selection via query param remains (e.g., `?section=reviews` on lover; `?section=portfolio` on talent). Route param for role + query param for section is compatible.

---

## 3) Profile Page UI/UX Design
- Role Switcher (perceived as account-level control):
  - If user has >1 enabled roles: a segmented control or dropdown to switch personas. Accessible and keyboard-focusable.
  - For visitors: show role tabs only for roles with `visibility=public` (or unlisted via direct link).
- Visual differentiation:
  - Role badge, color accents, and role-specific header fields (e.g., Critic byline/publication; Talent headshot + primary role; Industry company info).
- Navigation patterns:
  - Preserve existing sections; add role-specific sections only in relevant personas (e.g., Talent: Portfolio, Credits, Reels; Industry: Projects, Casting Calls).
- CTA to full settings:
  - In-owner view, a persistent link to `Open full settings` points to `/settings`.

---

## 4) Data Isolation Strategy
- Role ownership:
  - Each role persona owns its content domain. Avoid cross-role leakage by tagging content with `role_profile_id` (or table-specific FK) and enforcing role-aware queries.
- Tables and queries:
  - Shared content tables (e.g., `reviews`) include `role_profile_id` (nullable short-term default to lover). For specialized domains, use distinct tables tied to the role profile.
- Access control:
  - Visitors can view only content for the role persona they are visiting, subject to that role's visibility. Owner/admin bypasses via authenticated checks.

---

## 5) Settings Integration (Global `/settings` Hub)
- New section: `Public Profiles (Roles)`
  - Enable/Disable toggles per role
  - Visibility per role: `public | unlisted | private`
  - Default role selection (radio)
  - Onboarding wizards (e.g., Critic verification, Talent profile setup)
- Shared validations and UI component reuse with other settings sections.

---

## 6) Database Schema Proposal
Base linkage:
- `users` (existing)  `user_role_profiles` (new)  role-specific profile tables

### 6.1 user_role_profiles (new)
- id: PK
- user_id: FK  users.id (CASCADE)
- role_type: enum/string (`lover|critic|talent|industry`)
- enabled: bool (default true)
- visibility: enum/string (`public|unlisted|private`, default `public`)
- is_default: bool (only one true per user)
- handle/slug: string (optional override if role needs specific slug)
- created_at / updated_at: timestamps
- UNIQUE (user_id, role_type)

### 6.2 TalentProfile (new)
- id: PK
- user_id: FK  users.id (CASCADE)
- role_profile_id: FK  user_role_profiles.id
- full_name, professional_name
- primary_role: enum (`actor|crew`)
- headshot_url, reel_urls: JSONB
- credits: JSONB (list of roles/projects)
- privacy_settings: JSONB (contact visibility, profile visibility overrides)
- verification_status: enum (`pending|verified|rejected|unverified`)
- created_at / updated_at
- UNIQUE (user_id) for 1:1 mapping (or allow N:1 if future requires multiple talent personas)

### 6.3 IndustryProfile (new)
- id: PK
- user_id: FK  users.id (CASCADE)
- role_profile_id: FK  user_role_profiles.id
- company_name, role_title
- projects: JSONB
- casting_contact: JSONB (email, phone, links)
- privacy_settings: JSONB
- verification_status: enum
- created_at / updated_at
- UNIQUE (user_id)

### 6.4 Existing CriticProfile (reference)
- Keep current `critic_profiles` table and add `role_profile_id` nullable column during migration for alignment.

Indexes:
- user_role_profiles: (user_id, role_type), (visibility), (is_default WHERE enabled)
- talent_profiles: (user_id), (role_profile_id)
- industry_profiles: (user_id), (role_profile_id)

---

## 7) User Flows & Onboarding
- Activate role:
  1) User toggles role ON in `/settings`
  2) If first-time: launch onboarding wizard (fields minimal to publish)
  3) Save & set visibility; if verification required (Critic), mark pending
- Deactivate role:
  1) Toggle OFF  visibility becomes private; role pages 404 to visitors
  2) Data preserved; option to permanently delete specific domains (irreversible)
- Visitor experience:
  - Discover public roles via profile header tabs; role switch changes persona and content context.

---

## 8) Edge Cases & Trade-offs
- Cross-posting content across roles
  - Default: disabled (avoid leakage). If allowed, require explicit per-item role selection; UI warns about visibility differences.
- Performance with role scoping
  - Add appropriate indexes; lazy-load heavy sections (portfolio, credits, reels) and cache public pages.
- Role conflicts
  - Verified status vs visibility; precedence rules: verification does not override private visibility.
- Migration complexity
  - Start with mapping all existing content to `lover` persona; backfill `user_role_profiles` with enabled=TRUE for lover.

---

## 9) Integration with Existing Features
- Reviews: add `role_profile_id` (default lover) to ensure critic reviews are distinct if desired by domain rules.
- Collections/Watchlist/Favorites: remain under lover persona unless later expanded; ensure UI clarifies persona context.
- Social (follow/notifications): clarify whether follows are account-wide or per persona; recommendation: account-wide follows, persona-aware notifications.
- Search & discovery: index public role pages separately; include role badge in results.

---

## 10) Concrete User Scenarios
- Talent only (Naveen as Talent): `/profile/naveen/talent` public; `/profile/naveen` redirects to talent if default set; lover disabled or unlisted.
- Critic + Talent: two personas; switcher visible; critic verification flow; content strictly scoped.
- Industry only: `/profile/naveen/industry` with company + casting calls; unlisted possible during setup.
- All roles: `/profile/naveen/{lover|critic|talent|industry}` all available; default chosen in settings.

---

## 11) Implementation Roadmap (High-level)
- Phase 0: Data model prep  add `user_role_profiles`; wire migrations but ship disabled (behind flags)
- Phase 1: Routing infra  introduce role segment handling with default redirect; no persona UI yet
- Phase 2: Settings  implement "Public Profiles (Roles)" management
- Phase 3: Persona UIs  Critic (align with existing table), then Talent, then Industry
- Phase 4: Content scoping  add `role_profile_id` to shared domains as needed
- Phase 5: Search/indexing  role-aware discoverability and SEO

---

## 12) Discussion Points (need final approval before implementation)
- Role slugs: confirm canonical values (`lover|critic|talent|industry`) and allowed aliases
- Following/notifications: account-wide vs per persona
- Critic domain rule: should critic reviews be isolated from lover reviews or unified with a badge?
- Data model multiplicity: allow more than one talent persona per user in the future?
- SEO strategy: index role pages distinctly; robots rules for unlisted/Private

