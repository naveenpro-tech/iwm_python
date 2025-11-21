# Admin Panel - Complete Endpoint Inventory

**Date:** November 7, 2025  
**Status:** 🔍 Audit Complete  
**Purpose:** Comprehensive list of all backend admin API endpoints and their UI implementation status

---

## 📊 Summary

| Category | Total Endpoints | Has UI | Missing UI | Priority |
|----------|----------------|--------|------------|----------|
| User Management | 1 | ✅ 1 | ❌ 0 | HIGH |
| Moderation | 4 | ✅ 4 | ❌ 0 | HIGH |
| System Settings | 2 | ✅ 2 | ❌ 0 | MEDIUM |
| Analytics | 1 | ✅ 1 | ❌ 0 | MEDIUM |
| Movie Import (JSON) | 1 | ✅ 1 | ❌ 0 | HIGH |
| Movie Enrichment | 3 | ✅ 3 | ❌ 0 | HIGH |
| Movie Curation | 6 | ✅ 6 | ❌ 0 | HIGH |
| TMDB Admin | 3 | ✅ 3 | ❌ 0 | HIGH |
| Movie Export/Import | 3 | ✅ 3 | ❌ 0 | MEDIUM |
| Critic Verification | 2 | ✅ 2 | ❌ 0 | HIGH |
| Feature Flags | 3 | ✅ 3 | ❌ 0 | MEDIUM |
| **TOTAL** | **29** | **✅ 29** | **❌ 0** | - |

---

## 🎯 Admin Endpoints by Category

### 1. User Management (`/api/v1/admin/users`)

#### ✅ GET `/api/v1/admin/users`
**Purpose:** List all users with search, filter, and pagination  
**UI Status:** ✅ **HAS UI** - `/admin/users` page  
**Parameters:**
- `search` (optional): Search by name or email
- `role` (optional): Filter by role
- `status` (optional): Filter by status
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Items per page

**Response:** List of `AdminUserOut`
```typescript
{
  id: string
  name: string
  email: string
  roles: string[]
  status: string
  joinedDate: string
  lastLogin?: string
  profileType?: string
  verificationStatus?: string
  accountType?: string
  phoneNumber?: string
  location?: string
}
```

**UI Location:** `app/admin/users/page.tsx`  
**API Client:** `lib/api/admin/users.ts`

---

### 2. Content Moderation (`/api/v1/admin/moderation`)

#### ✅ GET `/api/v1/admin/moderation/items`
**Purpose:** List all moderation items (reported content)  
**UI Status:** ✅ **HAS UI** - `/admin/moderation` page  
**Parameters:**
- `status` (optional): Filter by status
- `contentType` (optional): Filter by content type
- `search` (optional): Search query
- `page` (default: 1): Page number
- `limit` (default: 20, max: 100): Items per page

**Response:** List of `ModerationItemOut`

**UI Location:** `app/admin/moderation/page.tsx`

#### ✅ POST `/api/v1/admin/moderation/items/{itemId}/approve`
**Purpose:** Approve a moderation item  
**UI Status:** ✅ **HAS UI** - Approve button in moderation table  
**Body:** `{ reason?: string }`

#### ✅ POST `/api/v1/admin/moderation/items/{itemId}/reject`
**Purpose:** Reject a moderation item  
**UI Status:** ✅ **HAS UI** - Reject button in moderation table  
**Body:** `{ reason?: string }`

---

### 3. System Settings (`/api/v1/admin/system`)

#### ✅ GET `/api/v1/admin/system/settings`
**Purpose:** Get system settings  
**UI Status:** ✅ **HAS UI** - `/admin/settings` page  
**Response:** System settings object

#### ✅ PUT `/api/v1/admin/system/settings`
**Purpose:** Update system settings  
**UI Status:** ✅ **HAS UI** - Settings form  
**Body:** `{ data: Record<string, any> }`

---

### 4. Analytics (`/api/v1/admin/analytics`)

#### ✅ GET `/api/v1/admin/analytics/overview`
**Purpose:** Get analytics overview dashboard data  
**UI Status:** ✅ **HAS UI** - `/admin` dashboard  
**Response:**
```typescript
{
  totalUsers: number
  contentViews: number
  avgRating: number
  systemHealth: number
  changes: Record<string, number>
}
```

**UI Location:** `app/admin/page.tsx`

---

### 5. Movie Import - JSON (`/api/v1/admin/movies`)

#### ✅ POST `/api/v1/admin/movies/import`
**Purpose:** Bulk import movies from JSON  
**UI Status:** ✅ **HAS UI** - `/admin/import` page  
**Body:** Array of `MovieImportIn` objects  
**Response:**
```typescript
{
  imported: number
  updated: number
  failed: number
  errors: string[]
}
```

**UI Location:** `app/admin/import/page.tsx`  
**Features:**
- JSON editor with syntax highlighting
- Template download
- Schema documentation
- Import validation
- Progress tracking

---

### 6. Movie Enrichment (`/api/v1/admin/movies/enrich`)

#### ✅ POST `/api/v1/admin/movies/enrich`
**Purpose:** Enrich a single movie using Gemini/TMDB  
**UI Status:** ✅ **HAS UI** - `/admin/enrich` page  
**Body:**
```typescript
{
  query: string
  provider?: "gemini" | "tmdb"
}
```

**Response:**
```typescript
{
  external_id: string
  updated: boolean
  provider_used: string
}
```

#### ✅ POST `/api/v1/admin/movies/enrich/bulk`
**Purpose:** Bulk enrich multiple movies  
**UI Status:** ✅ **HAS UI** - Bulk enrich form  
**Body:** `{ queries: string[] }`

#### ✅ POST `/api/v1/admin/movies/enrich-existing`
**Purpose:** Re-enrich an existing movie  
**UI Status:** ✅ **HAS UI** - Movie detail page  
**Body:**
```typescript
{
  external_id: string
  query?: string
}
```

---

### 7. Movie Curation (`/api/v1/admin/movies`)

#### ✅ GET `/api/v1/admin/movies`
**Purpose:** Get paginated movies for curation  
**UI Status:** ✅ **HAS UI** - `/admin/curation` page  
**Parameters:**
- `page` (default: 1): Page number
- `page_size` (default: 25, max: 100): Items per page
- `curation_status` (optional): draft | pending_review | approved | rejected
- `sort_by` (default: curated_at): quality_score | curated_at
- `sort_order` (default: desc): asc | desc

**Response:**
```typescript
{
  items: MovieCurationResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
```

**UI Location:** `app/admin/curation/page.tsx`

#### ✅ PATCH `/api/v1/admin/movies/{movie_id}/curation`
**Purpose:** Update movie curation status and quality score  
**UI Status:** ✅ **HAS UI** - Curation form  
**Body:**
```typescript
{
  curation_status?: "draft" | "pending_review" | "approved" | "rejected"
  quality_score?: number  // 0-100
  curator_notes?: string
}
```

#### ✅ POST `/api/v1/admin/movies/bulk-update`
**Purpose:** Bulk update movie curation  
**UI Status:** ✅ **HAS UI** - Bulk actions menu  
**Body:**
```typescript
{
  movie_ids: number[]
  curation_data: CurationUpdate
}
```

#### ✅ POST `/api/v1/admin/movies/bulk-publish`
**Purpose:** Bulk publish/unpublish movies  
**UI Status:** ✅ **HAS UI** - Bulk publish button  
**Body:**
```typescript
{
  movie_ids: number[]
  publish: boolean
}
```

#### ✅ POST `/api/v1/admin/movies/bulk-feature`
**Purpose:** Bulk feature/unfeature movies  
**UI Status:** ✅ **HAS UI** - Bulk feature button  
**Body:**
```typescript
{
  movie_ids: number[]
  featured: boolean
}
```

#### ✅ GET `/api/v1/admin/import/schema`
**Purpose:** Get movie import JSON schema  
**UI Status:** ✅ **HAS UI** - Schema documentation page  
**Response:** Complete schema with field definitions

#### ✅ GET `/api/v1/admin/import/template`
**Purpose:** Get movie import template  
**UI Status:** ✅ **HAS UI** - Template download button  
**Response:** Sample JSON template

---

### 8. TMDB Admin (`/api/v1/admin/tmdb`)

#### ✅ GET `/api/v1/admin/tmdb/new-releases`
**Purpose:** Browse TMDB new releases  
**UI Status:** ✅ **HAS UI** - `/admin/tmdb` page  
**Parameters:**
- `category`: now_playing | upcoming | popular | top_rated
- `page` (default: 1): Page number

**UI Location:** `app/admin/tmdb/page.tsx`

#### ✅ GET `/api/v1/admin/tmdb/search`
**Purpose:** Search TMDB movies  
**UI Status:** ✅ **HAS UI** - TMDB search form  
**Parameters:**
- `query`: Search query
- `year` (optional): Release year
- `page` (default: 1): Page number

#### ✅ POST `/api/v1/admin/tmdb/import/{tmdb_id}`
**Purpose:** Import a movie from TMDB  
**UI Status:** ✅ **HAS UI** - Import button on search results  
**Response:**
```typescript
{
  movie_id: number
  external_id: string
  title: string
  message: string
}
```

---

### 9. Movie Export/Import (`/api/v1/admin/movies/{id}`)

#### ✅ GET `/api/v1/admin/movies/{id}/export`
**Purpose:** Export single movie as JSON  
**UI Status:** ✅ **HAS UI** - Export button on movie page  
**Response:** Complete movie JSON

#### ✅ GET `/api/v1/admin/movies/export/bulk`
**Purpose:** Bulk export movies as ZIP  
**UI Status:** ✅ **HAS UI** - Bulk export button  
**Parameters:** `movie_ids`: Comma-separated IDs  
**Response:** ZIP file with JSON files

#### ✅ POST `/api/v1/admin/movies/{id}/import`
**Purpose:** Import/update movie from JSON  
**UI Status:** ✅ **HAS UI** - Import form  
**Body:** Complete movie JSON

---

### 10. Critic Verification (`/api/v1/critic-verification/admin`)

#### ✅ GET `/api/v1/critic-verification/admin/applications`
**Purpose:** List all critic verification applications  
**UI Status:** ✅ **HAS UI** - `/admin/critic-applications` page  
**Parameters:**
- `status_filter` (optional): pending | approved | rejected
- `limit` (default: 50): Max results
- `offset` (default: 0): Pagination offset

**UI Location:** `app/admin/critic-applications/page.tsx`

#### ✅ PUT `/api/v1/critic-verification/admin/applications/{application_id}`
**Purpose:** Approve or reject critic application  
**UI Status:** ✅ **HAS UI** - Approve/Reject buttons  
**Body:**
```typescript
{
  status: "approved" | "rejected"
  verification_level?: "verified" | "professional" | "expert"
  admin_notes?: string
}
```

---

### 11. Feature Flags (`/api/v1/admin/feature-flags`)

#### ✅ GET `/api/v1/admin/feature-flags`
**Purpose:** Get all feature flags with full details  
**UI Status:** ✅ **HAS UI** - `/admin/feature-flags` page  
**Parameters:**
- `category` (optional): Filter by category

**UI Location:** `app/admin/feature-flags/page.tsx`

#### ✅ PUT `/api/v1/admin/feature-flags/{feature_key}`
**Purpose:** Update single feature flag  
**UI Status:** ✅ **HAS UI** - Toggle switches  
**Body:**
```typescript
{
  is_enabled: boolean
  description?: string
}
```

#### ✅ PUT `/api/v1/admin/feature-flags/bulk`
**Purpose:** Bulk update feature flags  
**UI Status:** ✅ **HAS UI** - Bulk toggle button  
**Body:**
```typescript
{
  updates: Record<string, boolean>
}
```

---

## ✅ All Endpoints Have UI

**Status:** 🎉 **COMPLETE**

All 29 admin endpoints have corresponding UI components in the admin panel. The admin panel is fully functional with:

- ✅ User management
- ✅ Content moderation
- ✅ System settings
- ✅ Analytics dashboard
- ✅ Movie import (JSON & TMDB)
- ✅ Movie enrichment (Gemini/TMDB)
- ✅ Movie curation workflow
- ✅ Critic verification
- ✅ Feature flag management

---

## 🚀 Next Steps

Since all endpoints have UI, the focus should be on:

1. **Enhanced User Management** (NEW FEATURE)
   - User details page with full profile
   - Role management UI
   - Account status management
   - User activity tracking
   - Bulk user actions

2. **UI/UX Improvements**
   - Better search and filtering
   - Improved pagination
   - Better error handling
   - Loading states
   - Success/failure notifications

3. **Additional Features**
   - Audit logs
   - Admin activity tracking
   - Advanced analytics
   - Bulk operations
   - Export/import improvements

---

**Last Updated:** November 7, 2025  
**Maintained By:** Admin Panel Team

