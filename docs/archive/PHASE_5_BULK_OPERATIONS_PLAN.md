# Phase 5: Bulk Operations Implementation Plan

**Date:** 2025-10-30  
**Goal:** Enable bulk operations for movie curation (bulk update, bulk publish, bulk feature)

---

## 📋 OVERVIEW

Phase 5 adds bulk operation capabilities to the admin movie curation system, allowing admins to:
- Select multiple movies at once
- Apply bulk actions (publish, unpublish, feature, unfeature, update status)
- See progress and results of bulk operations

---

## 🎯 REQUIREMENTS

### Backend Requirements
1. **Bulk Update Endpoint** - `POST /api/admin/movies/bulk-update`
   - Accept array of movie IDs
   - Accept curation updates to apply
   - Return success/failure count
   - Handle partial failures gracefully

2. **Bulk Publish Endpoint** - `POST /api/admin/movies/bulk-publish`
   - Accept array of movie IDs
   - Set `curation_status` to `approved`
   - Return success count

3. **Bulk Feature Endpoint** - `POST /api/admin/movies/bulk-feature`
   - Accept array of movie IDs
   - Toggle featured status
   - Return success count

### Frontend Requirements
1. **Multi-Select UI** - Checkboxes on movie list
2. **Bulk Action Toolbar** - Appears when movies selected
3. **Bulk Action Modals** - Confirm bulk operations
4. **Progress Indicators** - Show bulk operation progress
5. **Result Notifications** - Toast notifications for results

---

## 🔧 IMPLEMENTATION DETAILS

### Backend Implementation

#### 1. Pydantic Schemas
**File:** `apps/backend/src/schemas/curation.py`

```python
class BulkUpdateRequest(BaseModel):
    movie_ids: list[int]
    curation_data: CurationUpdate

class BulkUpdateResponse(BaseModel):
    success_count: int
    failure_count: int
    failed_ids: list[int]
    message: str

class BulkPublishRequest(BaseModel):
    movie_ids: list[int]
    publish: bool  # True = publish, False = unpublish

class BulkFeatureRequest(BaseModel):
    movie_ids: list[int]
    featured: bool  # True = feature, False = unfeature
```

#### 2. Repository Methods
**File:** `apps/backend/src/repositories/admin.py`

```python
async def bulk_update_movies(
    self,
    movie_ids: list[int],
    curation_data: dict,
    curator_id: int
) -> tuple[int, int, list[int]]:
    """
    Bulk update movies with curation data.
    Returns: (success_count, failure_count, failed_ids)
    """
    
async def bulk_publish_movies(
    self,
    movie_ids: list[int],
    publish: bool,
    curator_id: int
) -> int:
    """
    Bulk publish/unpublish movies.
    Returns: success_count
    """
    
async def bulk_feature_movies(
    self,
    movie_ids: list[int],
    featured: bool,
    curator_id: int
) -> int:
    """
    Bulk feature/unfeature movies.
    Returns: success_count
    """
```

#### 3. API Endpoints
**File:** `apps/backend/src/routers/admin.py`

```python
@router.post("/movies/bulk-update", response_model=BulkUpdateResponse)
async def bulk_update_movies(
    request: BulkUpdateRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> BulkUpdateResponse:
    """Bulk update movie curation fields"""
    
@router.post("/movies/bulk-publish", response_model=BulkUpdateResponse)
async def bulk_publish_movies(
    request: BulkPublishRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> BulkUpdateResponse:
    """Bulk publish/unpublish movies"""
    
@router.post("/movies/bulk-feature", response_model=BulkUpdateResponse)
async def bulk_feature_movies(
    request: BulkFeatureRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(require_admin),
) -> BulkUpdateResponse:
    """Bulk feature/unfeature movies"""
```

### Frontend Implementation

#### 1. Bulk Selection State
**File:** `app/admin/curation/page.tsx`

```typescript
const [selectedMovies, setSelectedMovies] = useState<Set<number>>(new Set())
const [bulkActionInProgress, setBulkActionInProgress] = useState(false)

const toggleMovieSelection = (movieId: number) => {
  const newSelection = new Set(selectedMovies)
  if (newSelection.has(movieId)) {
    newSelection.delete(movieId)
  } else {
    newSelection.add(movieId)
  }
  setSelectedMovies(newSelection)
}

const selectAll = () => {
  const allIds = movies.map(m => m.id)
  setSelectedMovies(new Set(allIds))
}

const clearSelection = () => {
  setSelectedMovies(new Set())
}
```

#### 2. Bulk Action Toolbar Component
**File:** `components/admin/movies/bulk-action-toolbar.tsx`

```typescript
interface BulkActionToolbarProps {
  selectedCount: number
  onPublish: () => void
  onUnpublish: () => void
  onFeature: () => void
  onUnfeature: () => void
  onClearSelection: () => void
  isLoading: boolean
}

export function BulkActionToolbar({ ... }: BulkActionToolbarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-4">
        <span className="font-medium">{selectedCount} selected</span>
        <Button onClick={onPublish} disabled={isLoading}>Publish</Button>
        <Button onClick={onUnpublish} disabled={isLoading}>Unpublish</Button>
        <Button onClick={onFeature} disabled={isLoading}>Feature</Button>
        <Button onClick={onUnfeature} disabled={isLoading}>Unfeature</Button>
        <Button onClick={onClearSelection} variant="ghost">Clear</Button>
      </div>
    </div>
  )
}
```

#### 3. API Client Methods
**File:** `app/lib/api/admin-curation.ts`

```typescript
export async function bulkUpdateMovies(
  movieIds: number[],
  curationData: Partial<CurationUpdate>
): Promise<BulkUpdateResponse> {
  const response = await fetch(`${API_BASE}/api/admin/movies/bulk-update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movie_ids: movieIds, curation_data: curationData })
  })
  return response.json()
}

export async function bulkPublishMovies(
  movieIds: number[],
  publish: boolean
): Promise<BulkUpdateResponse> {
  const response = await fetch(`${API_BASE}/api/admin/movies/bulk-publish`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movie_ids: movieIds, publish })
  })
  return response.json()
}

export async function bulkFeatureMovies(
  movieIds: number[],
  featured: boolean
): Promise<BulkUpdateResponse> {
  const response = await fetch(`${API_BASE}/api/admin/movies/bulk-feature`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movie_ids: movieIds, featured })
  })
  return response.json()
}
```

---

## 🧪 TESTING STRATEGY

### Backend Tests
**File:** `apps/backend/tests/test_admin_bulk_operations.py`

```python
def test_bulk_update_movies_success()
def test_bulk_update_movies_partial_failure()
def test_bulk_update_movies_unauthorized()
def test_bulk_publish_movies()
def test_bulk_unpublish_movies()
def test_bulk_feature_movies()
def test_bulk_unfeature_movies()
def test_bulk_operations_empty_list()
def test_bulk_operations_invalid_ids()
```

### E2E Tests
**File:** `tests/e2e/admin-bulk-operations.spec.ts`

```typescript
test('should select multiple movies')
test('should show bulk action toolbar when movies selected')
test('should bulk publish movies')
test('should bulk unpublish movies')
test('should bulk feature movies')
test('should clear selection')
test('should show success notification after bulk operation')
test('should handle bulk operation errors')
```

---

## 📊 SUCCESS CRITERIA

- ✅ Backend endpoints accept bulk requests
- ✅ Partial failures handled gracefully
- ✅ Frontend shows checkboxes for selection
- ✅ Bulk action toolbar appears when movies selected
- ✅ Bulk operations execute successfully
- ✅ Progress indicators show during operations
- ✅ Success/error notifications displayed
- ✅ All tests passing (backend + E2E)

---

## 🚀 IMPLEMENTATION ORDER

1. **Backend Schemas** - Define request/response models
2. **Repository Methods** - Implement bulk operation logic
3. **API Endpoints** - Create bulk operation endpoints
4. **Backend Tests** - Write and run unit tests
5. **Frontend State** - Add selection state management
6. **Bulk Toolbar Component** - Create toolbar UI
7. **API Client** - Add bulk operation API calls
8. **Frontend Integration** - Wire up UI to API
9. **E2E Tests** - Write and run E2E tests
10. **Documentation** - Update docs with bulk operations

---

**Ready to implement!** 🎯

