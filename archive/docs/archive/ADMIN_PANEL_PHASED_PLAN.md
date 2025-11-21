# Admin Panel Implementation Plan - Phased Approach

**Project:** IWM (Siddu Global Entertainment Hub) - Admin Dashboard
**Architecture:** Next.js Frontend + FastAPI Backend (Monorepo)
**Approach:** Small, incremental phases - each phase delivers working functionality
**Date:** 2025-01-30

---

## 🎯 **OVERVIEW**

This plan breaks down the Admin Panel implementation into **12 small phases**, each delivering working, testable functionality. Each phase builds on the previous one and can be deployed independently.

**Core Principles:**
- ✅ Each phase is fully functional and tested
- ✅ No phase exceeds 2-3 days of work
- ✅ Backend + Frontend + Tests delivered together
- ✅ RBAC enforced from Phase 1
- ✅ Real API integration (no mocks after Phase 1)

---

## 📋 **PHASE BREAKDOWN**

### **PHASE 1: Foundation & RBAC** ⚡ (Day 1)
**Goal:** Secure admin routes and establish authentication foundation

**Backend Tasks:**
- [ ] Create `require_admin` dependency in `src/dependencies.py`
- [ ] Apply RBAC to all `/api/v1/admin/*` endpoints
- [ ] Add admin role check middleware
- [ ] Test: Unit test for RBAC enforcement (403 for non-admin)

**Frontend Tasks:**
- [ ] Add `/admin/*` route protection in `middleware.ts`
- [ ] Redirect non-admin users to `/login` with error message
- [ ] Add admin role check in layout
- [ ] Test: Playwright test for unauthorized access

**Deliverables:**
- ✅ All admin routes require `RoleType.ADMIN`
- ✅ Frontend redirects non-admin users
- ✅ Tests pass for both authorized and unauthorized access

**Files Modified:**
- `apps/backend/src/dependencies.py` (new)
- `apps/backend/src/routers/admin.py`
- `middleware.ts`
- `app/admin/layout.tsx`

---

### **PHASE 2: Database Schema - Curation Fields** ⚡ (Day 1-2)
**Goal:** Add curation and quality tracking to movies table

**Backend Tasks:**
- [ ] Create Alembic migration for curation fields:
  - `is_featured` (boolean, default false)
  - `is_trending` (boolean, default false)
  - `platform_rating` (integer 0-100, nullable)
  - `curator_notes` (text, nullable)
  - `featured_until` (timestamp, nullable)
  - `is_published` (boolean, default false)
  - `data_quality_score` (integer 0-100, nullable)
  - `verification_status` (enum: unverified, needs_review, verified)
  - `import_source` (string, nullable)
  - `import_date` (timestamp, nullable)
- [ ] Run migration on dev database
- [ ] Update `Movie` model in `models.py`
- [ ] Test: Verify schema changes with `alembic current`

**Deliverables:**
- ✅ Database schema updated
- ✅ Migration reversible
- ✅ Model reflects new fields

**Files Modified:**
- `alembic/versions/XXXXX_add_curation_fields.py` (new)
- `apps/backend/src/models.py`

---

### **PHASE 3: Movie List API Enhancement** ⚡ (Day 2)
**Goal:** Add filtering, sorting, and pagination for admin movie list

**Backend Tasks:**
- [ ] Create `GET /api/v1/admin/movies` endpoint with filters:
  - `q` (search by title)
  - `status` (published/unpublished)
  - `featured` (boolean)
  - `trending` (boolean)
  - `verification_status` (enum)
  - `quality_score_min` (integer)
  - `page`, `limit` (pagination)
- [ ] Add sorting: `sort_by` (title, year, quality_score, created_at)
- [ ] Return total count for pagination
- [ ] Test: API tests for all filter combinations

**Frontend Tasks:**
- [ ] Wire `/admin/movies` page to real API
- [ ] Add filter UI (search, status, featured, trending)
- [ ] Add pagination controls
- [ ] Add loading states and error handling
- [ ] Test: Playwright test for filtering and pagination

**Deliverables:**
- ✅ Admin can list, filter, and search movies
- ✅ Pagination works correctly
- ✅ Real-time search implemented

**Files Modified:**
- `apps/backend/src/routers/admin.py`
- `app/admin/movies/page.tsx`
- `lib/api/admin.ts` (new)

---

### **PHASE 4: Data Quality Scoring System** ⚡ (Day 2-3)
**Goal:** Implement automatic quality scoring for movie imports

**Backend Tasks:**
- [ ] Create `calculate_quality_score()` function in `src/services/quality.py`:
  - Basic metadata (40%): title, year, synopsis, runtime
  - People (15%): directors, cast
  - Media (10%): poster, backdrop
  - Streaming (10%): streaming options
  - Awards (10%): awards data
  - Trivia (7.5%): trivia items
  - Timeline (7.5%): timeline events
- [ ] Auto-set `verification_status` based on score:
  - < 80%: `needs_review`
  - >= 80%: `unverified`
  - >= 90%: eligible for auto-publish
- [ ] Test: Unit tests for scoring logic

**Frontend Tasks:**
- [ ] Display quality score badge on movie list
- [ ] Add quality score filter
- [ ] Show score breakdown on movie detail
- [ ] Test: Visual regression test for score display

**Deliverables:**
- ✅ Quality scores calculated automatically
- ✅ Verification status set based on score
- ✅ Admin can filter by quality

**Files Modified:**
- `apps/backend/src/services/quality.py` (new)
- `apps/backend/src/routers/admin.py`
- `app/admin/movies/page.tsx`
- `components/admin/movies/quality-badge.tsx` (new)

---

### **PHASE 5: Movie Import Schema Enhancement** ⚡ (Day 3)
**Goal:** Extend import schema with comprehensive nested structures

**Backend Tasks:**
- [ ] Extend `MovieImportIn` Pydantic model with:
  - `CastMember` (name, character, order, profile_url)
  - `CrewMember` (name, role, department, profile_url)
  - `TimelineEvent` (date, event_type, description)
  - `TriviaItem` (category, content, source)
  - `Award` (name, category, year, won, nominated)
  - `StreamingOption` (platform, type, quality, url)
  - `ImportMeta` (source, import_date, quality_score, verification_status)
  - `PlatformCuration` (is_featured, is_trending, platform_rating, curator_notes)
- [ ] Update import endpoint to accept new schema
- [ ] Test: Schema validation tests

**Shared Package Tasks:**
- [ ] Create `packages/shared/types/movie-import.ts`
- [ ] Create Zod schema for client-side validation
- [ ] Test: Type alignment test (TS types match Pydantic)

**Deliverables:**
- ✅ Comprehensive import schema defined
- ✅ TypeScript types generated
- ✅ Validation works on both client and server

**Files Modified:**
- `apps/backend/src/routers/admin.py`
- `packages/shared/types/movie-import.ts` (new)
- `packages/shared/schemas/movie-import.zod.ts` (new)

---

### **PHASE 6: Template Generator Page** ⚡ (Day 3-4)
**Goal:** Create UI for generating JSON templates and LLM prompts

**Backend Tasks:**
- [ ] Create `GET /api/v1/admin/movies/template` endpoint
- [ ] Return canonical JSON template with all fields
- [ ] Include field descriptions and examples
- [ ] Test: API test for template endpoint

**Frontend Tasks:**
- [ ] Create `/admin/movies/template` page
- [ ] Display canonical JSON template
- [ ] Add "Copy to Clipboard" button
- [ ] Add "Download JSON" button
- [ ] Create Prompt Builder:
  - Input: movie title, year
  - Output: LLM prompts for Gemini, ChatGPT, Claude
- [ ] Test: Playwright test for template generation

**Deliverables:**
- ✅ Admin can generate JSON templates
- ✅ LLM prompts auto-generated
- ✅ Copy/download functionality works

**Files Modified:**
- `apps/backend/src/routers/admin.py`
- `app/admin/movies/template/page.tsx` (new)
- `components/admin/movies/template-generator.tsx` (new)
- `components/admin/movies/prompt-builder.tsx` (new)

---

### **PHASE 7: Enhanced Import Page with Validation** ⚡ (Day 4)
**Goal:** Real-time validation and preview for JSON imports

**Frontend Tasks:**
- [ ] Enhance `/admin/movies/import` page:
  - Integrate Zod schema validation
  - Real-time error highlighting (line numbers)
  - Preview panel showing parsed summary
  - Quality score preview
  - Disable import button until valid
- [ ] Add JSON editor with syntax highlighting
- [ ] Show validation errors inline
- [ ] Test: Playwright test for import validation

**Backend Tasks:**
- [ ] Enhance import endpoint error responses
- [ ] Return detailed validation errors with field paths
- [ ] Test: API test for validation errors

**Deliverables:**
- ✅ Real-time JSON validation
- ✅ Clear error messages
- ✅ Preview before import

**Files Modified:**
- `app/admin/movies/import/page.tsx`
- `components/admin/movies/json-editor.tsx` (new)
- `components/admin/movies/import-preview.tsx` (new)
- `apps/backend/src/routers/admin.py`

---

### **PHASE 8: Duplicate Detection** ⚡ (Day 4-5)
**Goal:** Prevent duplicate movie imports

**Backend Tasks:**
- [ ] Add duplicate detection logic:
  - Check by `external_id` (unique index)
  - Fallback: title + year similarity (fuzzy match)
- [ ] Return warning if potential duplicate found
- [ ] Allow admin to force import or merge
- [ ] Test: Unit tests for duplicate detection

**Frontend Tasks:**
- [ ] Show duplicate warning modal
- [ ] Display existing movie details
- [ ] Options: Cancel, Force Import, Merge
- [ ] Test: Playwright test for duplicate flow

**Deliverables:**
- ✅ Duplicates detected automatically
- ✅ Admin can review and decide
- ✅ Data integrity maintained

**Files Modified:**
- `apps/backend/src/services/deduplication.py` (new)
- `apps/backend/src/routers/admin.py`
- `components/admin/movies/duplicate-warning-modal.tsx` (new)

---

### **PHASE 9: Movie Edit Page - Basic Fields** ⚡ (Day 5)
**Goal:** Enable editing of basic movie metadata

**Backend Tasks:**
- [ ] Create `GET /api/v1/admin/movies/{id}` endpoint
- [ ] Create `PUT /api/v1/admin/movies/{id}` endpoint
- [ ] Validate all fields on update
- [ ] Test: API tests for CRUD operations

**Frontend Tasks:**
- [ ] Enhance `/admin/movies/[id]` page:
  - Tab 1: Basic Info (title, year, synopsis, runtime, rating)
  - Form validation with Zod
  - Save button with loading state
  - Success/error toasts
- [ ] Test: Playwright test for editing

**Deliverables:**
- ✅ Admin can edit basic movie fields
- ✅ Changes saved to database
- ✅ Validation prevents invalid data

**Files Modified:**
- `apps/backend/src/routers/admin.py`
- `app/admin/movies/[id]/page.tsx`
- `components/admin/movies/edit-basic-tab.tsx` (new)

---

### **PHASE 10: Movie Edit Page - Advanced Tabs** ⚡ (Day 5-6)
**Goal:** Enable editing of people, media, streaming, awards

**Frontend Tasks:**
- [ ] Add tabs to `/admin/movies/[id]`:
  - Tab 2: People (cast, crew with add/remove)
  - Tab 3: Media (poster, backdrop URLs)
  - Tab 4: Streaming (platforms, types, quality)
  - Tab 5: Awards (add/edit/remove)
- [ ] Each tab saves independently
- [ ] Test: Playwright test for each tab

**Backend Tasks:**
- [ ] Enhance update endpoint to handle nested updates
- [ ] Upsert logic for related entities (genres, people)
- [ ] Test: Integration tests for nested updates

**Deliverables:**
- ✅ Full movie editing capability
- ✅ Related entities managed correctly
- ✅ UI is intuitive and responsive

**Files Modified:**
- `app/admin/movies/[id]/page.tsx`
- `components/admin/movies/edit-people-tab.tsx` (new)
- `components/admin/movies/edit-media-tab.tsx` (new)
- `components/admin/movies/edit-streaming-tab.tsx` (new)
- `components/admin/movies/edit-awards-tab.tsx` (new)

---

### **PHASE 11: Curation Tab & Visibility Controls** ⚡ (Day 6)
**Goal:** Enable curation and publishing controls

**Backend Tasks:**
- [ ] Create `PATCH /api/v1/admin/movies/{id}/toggle-visibility` endpoint
- [ ] Update curation fields endpoint
- [ ] Test: API tests for curation

**Frontend Tasks:**
- [ ] Add Tab 6: Curation to movie edit page:
  - Featured toggle
  - Trending toggle
  - Platform rating slider (0-100)
  - Curator notes textarea
  - Featured until date picker
  - Publish/Unpublish button
- [ ] Add bulk actions to movie list:
  - Bulk publish/unpublish
  - Bulk feature/unfeature
- [ ] Test: Playwright test for curation

**Deliverables:**
- ✅ Admin can curate movies
- ✅ Publish/unpublish controls work
- ✅ Bulk actions functional

**Files Modified:**
- `apps/backend/src/routers/admin.py`
- `components/admin/movies/edit-curation-tab.tsx` (new)
- `components/admin/movies/bulk-actions.tsx` (new)

---

### **PHASE 12: Import History & Audit Log** ⚡ (Day 6-7)
**Goal:** Track all imports and provide audit trail

**Backend Tasks:**
- [ ] Create `import_logs` table:
  - id, admin_user_id, movie_id, action, status, error_details, quality_score, timestamp
- [ ] Log all import attempts
- [ ] Create `GET /api/v1/admin/movies/import-history` endpoint
- [ ] Test: API tests for import history

**Frontend Tasks:**
- [ ] Create `/admin/movies/import-history` page:
  - List of imports with filters
  - Status badges (success, failed, duplicate)
  - Error details modal
  - Quality score display
- [ ] Test: Playwright test for import history

**Deliverables:**
- ✅ All imports logged
- ✅ Admin can review import history
- ✅ Error debugging easier

**Files Modified:**
- `alembic/versions/XXXXX_add_import_logs.py` (new)
- `apps/backend/src/models.py`
- `apps/backend/src/routers/admin.py`
- `app/admin/movies/import-history/page.tsx` (new)

---

## 🧪 **TESTING STRATEGY**

Each phase includes:
1. **Unit Tests** (Backend): Business logic, validation, scoring
2. **API Tests** (Backend): Endpoint contracts, error handling
3. **Integration Tests** (Backend): Database operations, transactions
4. **Playwright Tests** (Frontend): User flows, UI interactions
5. **Contract Tests** (CI): OpenAPI spec alignment

**Test Coverage Target:** 80%+ for all new code

---

## 📊 **PROGRESS TRACKING**

| Phase | Status | Backend | Frontend | Tests | Days |
|-------|--------|---------|----------|-------|------|
| 1. RBAC | ⏳ Pending | 0% | 0% | 0% | 1 |
| 2. Schema | ⏳ Pending | 0% | 0% | 0% | 1 |
| 3. List API | ⏳ Pending | 0% | 0% | 0% | 1 |
| 4. Quality | ⏳ Pending | 0% | 0% | 0% | 1 |
| 5. Schema | ⏳ Pending | 0% | 0% | 0% | 1 |
| 6. Template | ⏳ Pending | 0% | 0% | 0% | 1 |
| 7. Import | ⏳ Pending | 0% | 0% | 0% | 1 |
| 8. Dedup | ⏳ Pending | 0% | 0% | 0% | 1 |
| 9. Edit Basic | ⏳ Pending | 0% | 0% | 0% | 1 |
| 10. Edit Adv | ⏳ Pending | 0% | 0% | 0% | 1 |
| 11. Curation | ⏳ Pending | 0% | 0% | 0% | 1 |
| 12. History | ⏳ Pending | 0% | 0% | 0% | 1 |

**Total Estimated Time:** 7-12 days (depending on complexity)

---

## 🚀 **DEPLOYMENT STRATEGY**

- Each phase can be deployed independently
- Feature flags for gradual rollout
- Rollback plan for each phase
- Database migrations are reversible

---

## 📝 **NEXT STEPS**

**Ready to start Phase 1?** 
Say "Start Phase 1" and I will:
1. Create RBAC dependency
2. Apply to all admin endpoints
3. Add frontend route protection
4. Write and run tests
5. Verify everything works

**Questions before starting?**
- Which phase should we prioritize?
- Any modifications to the plan?
- Should we combine or split any phases?

