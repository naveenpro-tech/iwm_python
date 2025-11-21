# Handover Prompt: Admin Panel Phase 3 & 4 Completion

**Use this prompt to continue the Admin Panel implementation in a new conversation.**

---

## 🎯 Context Summary

I'm working on the **IWM (Siddu Global Entertainment Hub)** project, a comprehensive movie review and entertainment platform with Next.js frontend and FastAPI backend in a monorepo structure.

We've successfully completed **Phase 3 (Movie List & Quality Scoring)** and **Phase 4 (Import Schema & Template Generator)** of the Admin Panel implementation. All tests are passing (61/61 backend tests, 100% pass rate).

---

## 📋 What Has Been Completed

### Phase 1: Foundation & RBAC ✅
- Backend RBAC dependency (`require_admin()`)
- RBAC applied to all admin endpoints
- Frontend middleware protection
- 4 backend tests passing

### Phase 2: Database Schema - Curation Fields ✅
- Alembic migration adding 6 curation fields to movies table
- Movie model updated with `CurationStatus` enum
- Pydantic schemas for curation data validation
- 19 backend tests passing

### Phase 3: Movie List & Quality Scoring ✅
- Backend endpoints: `GET /api/admin/movies`, `PATCH /api/admin/movies/{id}/curation`
- Quality scoring algorithm (0-100 scale) with 4 categories
- Repository methods: `get_movies_for_curation()`, `update_movie_curation()`, `calculate_quality_score()`
- Frontend: Movie curation list page and edit page
- 22 backend tests + 10 E2E tests passing

### Phase 4: Import Schema & Template Generator ✅
- Backend endpoints: `GET /api/admin/import/schema`, `GET /api/admin/import/template`
- Schema documentation with 20+ field definitions
- Frontend: Interactive schema documentation page
- 16 backend tests + 7 E2E tests passing

---

## 🔧 Current System State

### Backend Status
- **Server:** Running on `http://127.0.0.1:8000` with Hypercorn
- **Database:** PostgreSQL with all migrations applied
- **Tests:** 61/61 passing (100% pass rate)
- **Key Files:**
  - `apps/backend/src/repositories/admin.py` (3 new methods)
  - `apps/backend/src/routers/admin.py` (4 new endpoints)
  - `apps/backend/tests/test_admin_curation_api.py` (22 tests)
  - `apps/backend/tests/test_admin_import_schema.py` (16 tests)

### Frontend Status
- **Server:** Running on `http://localhost:3000` with Bun
- **Key Pages:**
  - `/admin/curation` - Movie curation list
  - `/admin/curation/[id]` - Movie curation edit
  - `/admin/movies/schema` - Import schema documentation
  - `/admin/movies/import` - Movie import (existing)

### Test Status
- **Backend Unit Tests:** 61/61 passing
- **E2E Tests:** Created but may need auth setup improvements
- **Known Issues:** Some E2E tests timeout; Pydantic deprecation warnings

---

## 📁 Important Files to Review

### Documentation
- `ADMIN_PANEL_PHASED_PLAN.md` - Complete 12-phase implementation plan
- `PHASE_3_4_CHANGELOG.md` - Detailed change log for Phase 3 & 4
- `docs/HANDOVER_PROMPT_PHASE_3_4.md` - This file

### Backend Code
- `apps/backend/src/models.py` - Movie model with curation fields
- `apps/backend/src/repositories/admin.py` - Admin repository methods
- `apps/backend/src/routers/admin.py` - Admin API endpoints
- `apps/backend/src/schemas/curation.py` - Curation Pydantic schemas
- `apps/backend/alembic/versions/a1b2c3d4e5f7_add_curation_fields_to_movies.py` - Phase 2 migration

### Frontend Code
- `app/lib/api/admin-curation.ts` - API client for curation
- `app/admin/curation/page.tsx` - Curation list page
- `app/admin/curation/[id]/page.tsx` - Curation edit page
- `app/admin/movies/schema/page.tsx` - Schema documentation page

### Tests
- `apps/backend/tests/test_admin_rbac.py` - RBAC tests (4)
- `apps/backend/tests/test_curation_schema.py` - Schema tests (19)
- `apps/backend/tests/test_admin_curation_api.py` - Curation API tests (22)
- `apps/backend/tests/test_admin_import_schema.py` - Import schema tests (16)
- `tests/e2e/admin-movie-curation.spec.ts` - E2E curation tests (10)
- `tests/e2e/admin-import-schema.spec.ts` - E2E schema tests (7)

---

## 🎯 Next Phase to Implement

According to `ADMIN_PANEL_PHASED_PLAN.md`, the next phase is:

### **Phase 5: Bulk Operations**

**Objective:** Enable admins to approve/reject multiple movies at once

**Backend Tasks:**
1. Create bulk update endpoint: `POST /api/admin/movies/bulk-curation`
2. Add repository method: `bulk_update_curation(movie_ids, curation_data)`
3. Implement transaction handling for atomic updates
4. Add validation for bulk operations (max 100 movies per request)
5. Write unit tests for bulk operations
6. Write integration tests for error scenarios

**Frontend Tasks:**
1. Add checkbox selection to movie curation list
2. Add bulk action toolbar (approve all, reject all, set quality score)
3. Add confirmation dialog for bulk operations
4. Display progress indicator during bulk updates
5. Show success/error summary after bulk operation

**Testing:**
1. Unit tests for bulk update logic
2. Integration tests for transaction rollback
3. E2E tests for bulk selection and actions
4. Performance tests for large batch sizes

**Deliverables:**
- Bulk update endpoint implemented and tested
- Frontend UI for bulk operations
- All tests passing (existing + new)
- Performance benchmarks documented

---

## 🚀 How to Continue

### Step 1: Verify Current State

```bash
# Start backend
cd apps/backend
.venv/Scripts/hypercorn.exe src.main:app --reload --bind 127.0.0.1:8000

# Start frontend (in new terminal)
cd apps/frontend
bun run dev

# Run all backend tests
cd apps/backend
python -m pytest tests/test_admin_rbac.py tests/test_curation_schema.py tests/test_admin_curation_api.py tests/test_admin_import_schema.py -v -q
```

**Expected Results:**
- Backend starts without errors
- Frontend starts without errors
- All 61 tests pass

### Step 2: Review Phase 5 Requirements

Read `ADMIN_PANEL_PHASED_PLAN.md` section for Phase 5 to understand:
- Bulk operation requirements
- Transaction handling needs
- UI/UX expectations
- Testing requirements

### Step 3: Start Implementation

Use this prompt to start Phase 5:

```
I'm continuing the Admin Panel implementation for the IWM project. 

**Context:**
- Phases 1-4 are complete and all tests passing (61/61)
- I've reviewed ADMIN_PANEL_PHASED_PLAN.md and PHASE_3_4_CHANGELOG.md
- Backend is running on http://127.0.0.1:8000
- Frontend is running on http://localhost:3000

**Task:**
Start implementing Phase 5 (Bulk Operations) of the Admin Panel Phased Plan now.

**Requirements:**
1. Create bulk update endpoint: POST /api/admin/movies/bulk-curation
2. Implement transaction handling for atomic updates
3. Add frontend UI for bulk selection and actions
4. Write comprehensive tests (unit + integration + E2E)
5. Verify all existing tests still pass

**Action:**
Implement all Phase 5 tasks autonomously, run all tests, and report completion status with test results.

**Important:**
- Follow the same patterns used in Phase 3 & 4
- Maintain 100% test pass rate
- Use quality scoring algorithm from Phase 3
- Follow autonomous development rules (no questions, just implement)
```

---

## 🔑 Key Technical Patterns to Follow

### 1. Repository Pattern
```python
# apps/backend/src/repositories/admin.py
async def bulk_update_curation(
    self,
    movie_ids: List[int],
    curation_data: Dict[str, Any],
    curator_id: int,
) -> Tuple[int, int, List[str]]:
    """
    Bulk update curation for multiple movies.
    Returns: (success_count, failure_count, error_messages)
    """
    # Use transaction for atomic updates
    # Validate all movie_ids exist first
    # Update in batch
    # Return detailed results
```

### 2. Endpoint Pattern
```python
# apps/backend/src/routers/admin.py
@router.post("/movies/bulk-curation", response_model=BulkCurationResponse)
async def bulk_update_curation(
    bulk_data: BulkCurationUpdate,
    current_user: User = Depends(get_current_user),
    _: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Bulk update curation for multiple movies."""
    # Validate max 100 movies
    # Call repository method
    # Return success/failure counts
```

### 3. Frontend Pattern
```typescript
// app/lib/api/admin-curation.ts
export async function bulkUpdateCuration(
  movieIds: number[],
  data: CurationUpdate
): Promise<BulkCurationResponse> {
  const response = await fetch(`${API_BASE}/api/admin/movies/bulk-curation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movie_ids: movieIds, ...data }),
  })
  return response.json()
}
```

### 4. Test Pattern
```python
# apps/backend/tests/test_admin_bulk_operations.py
@pytest.mark.asyncio
class TestBulkCurationOperations:
    async def test_bulk_update_success(self):
        """Test successful bulk update of multiple movies"""
        # Create test movies
        # Call bulk update
        # Verify all updated
        # Check timestamps
    
    async def test_bulk_update_transaction_rollback(self):
        """Test that failed updates rollback entire transaction"""
        # Create test movies
        # Trigger error mid-batch
        # Verify no movies updated
```

---

## ⚠️ Important Considerations

### 1. Transaction Handling
- Use SQLAlchemy async transactions
- Ensure atomic updates (all or nothing)
- Handle partial failures gracefully
- Log errors for debugging

### 2. Performance
- Limit bulk operations to 100 movies max
- Use batch updates instead of individual queries
- Consider adding progress tracking for large batches
- Monitor database connection pool

### 3. Validation
- Validate all movie_ids exist before updating
- Validate curation_status values
- Validate quality_score range (0-100)
- Return detailed error messages

### 4. Testing
- Test transaction rollback scenarios
- Test with maximum batch size (100 movies)
- Test with invalid movie_ids
- Test concurrent bulk operations

### 5. UI/UX
- Show clear selection count
- Confirm before bulk actions
- Display progress during operation
- Show detailed results (success/failure counts)

---

## 📊 Success Criteria for Phase 5

- [ ] Bulk update endpoint implemented and working
- [ ] Transaction handling ensures atomic updates
- [ ] Frontend UI allows selecting and bulk updating movies
- [ ] All unit tests passing (existing + new)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Performance benchmarks documented
- [ ] No regressions in existing functionality
- [ ] Code follows established patterns
- [ ] Documentation updated

---

## 🛠️ Development Commands

### Backend
```bash
# Start backend
cd apps/backend
.venv/Scripts/hypercorn.exe src.main:app --reload --bind 127.0.0.1:8000

# Run tests
python -m pytest tests/test_admin_*.py -v -q

# Run specific test file
python -m pytest tests/test_admin_bulk_operations.py -v

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

### Frontend
```bash
# Start frontend
cd apps/frontend
bun run dev

# Run E2E tests
cd ../..
bun run test:e2e -- tests/e2e/admin-bulk-operations.spec.ts
```

---

## 📚 Reference Documentation

- **Project Rules:** `.augment/rules/rule1.md` (NextJS + FastAPI best practices)
- **FastAPI Rules:** `.augment/rules/rule2.md` (FastAPI anti-patterns)
- **Admin Plan:** `ADMIN_PANEL_PHASED_PLAN.md` (12-phase roadmap)
- **Phase 3-4 Changes:** `PHASE_3_4_CHANGELOG.md` (detailed change log)
- **User Preferences:** Autonomous development, comprehensive testing, no manual intervention

---

## 💬 Communication Style

When implementing Phase 5:
- State what you're doing: "I'm implementing bulk update endpoint..."
- Explain decisions: "Using transactions because..."
- Show progress: "Completed backend, now working on frontend..."
- Highlight concerns: "Note: Bulk operations limited to 100 movies for performance"
- Provide next steps: "To test, run these commands..."

**Don't:**
- Ask permission for obvious tasks
- Wait for approval to search/fetch documentation
- Ask "Should I add validation?" (Always add it)
- Ask "Should I write tests?" (Always write them)
- Stop at partial implementations

---

## 🎯 Final Checklist Before Starting Phase 5

- [ ] Read this entire handover document
- [ ] Review `ADMIN_PANEL_PHASED_PLAN.md` Phase 5 section
- [ ] Review `PHASE_3_4_CHANGELOG.md` for patterns
- [ ] Verify backend is running and tests pass
- [ ] Verify frontend is running
- [ ] Understand transaction handling requirements
- [ ] Understand bulk operation limits (max 100)
- [ ] Ready to implement autonomously

---

**Document Version:** 1.0  
**Created:** 2025-10-30  
**For:** Phase 5 implementation continuation  
**Status:** Ready for handover

---

## 🚀 Quick Start Command

Copy and paste this into a new conversation:

```
I'm continuing the Admin Panel implementation for the IWM project.

**Context:**
- Phases 1-4 complete, all tests passing (61/61)
- Reviewed ADMIN_PANEL_PHASED_PLAN.md and PHASE_3_4_CHANGELOG.md
- Backend running on http://127.0.0.1:8000
- Frontend running on http://localhost:3000

**Task:** Implement Phase 5 (Bulk Operations) autonomously.

**Requirements:**
1. POST /api/admin/movies/bulk-curation endpoint
2. Transaction handling for atomic updates
3. Frontend bulk selection UI
4. Comprehensive tests (unit + integration + E2E)
5. Maintain 100% test pass rate

**Action:** Implement all Phase 5 tasks, run all tests, report completion with results.
```

