# 📋 Draft/Publish Workflow Design Document

**Date:** 2025-11-02  
**Status:** Design Phase  
**Priority:** High (Data Quality & Safety)

---

## 🎯 Problem Statement

Currently, when importing enriched data (trivia, timeline, etc.), it saves directly to the published movie:
- ❌ No review/editing before publishing
- ❌ LLM-generated data may contain errors
- ❌ Accidental imports immediately affect public website
- ❌ No way to preview changes before going live

---

## ✅ Proposed Solution

Implement a **Draft/Publish Workflow** where:

1. **Import → Save as Draft** - Imported data saved with `curation_status = "draft"`
2. **Review & Edit** - Admin can review and modify draft data in admin panel
3. **Publish** - Admin explicitly clicks "Publish" to make data live
4. **Public API** - Only returns published data (not drafts)

---

## 🏗️ Architecture Design

### **Database Changes**

**Existing Fields (Already in Movie model):**
```python
curation_status: str = "draft"  # draft, pending_review, approved, rejected
quality_score: int = None       # 0-100 quality rating
curator_notes: str = None       # Admin notes
curated_by_id: int = None       # User who curated
curated_at: datetime = None     # When curated
last_reviewed_at: datetime = None  # Last review time
```

**New Fields Needed:**
```python
# For tracking draft vs published versions
trivia_draft: list = None           # Draft trivia (JSONB)
trivia_published: list = None       # Published trivia (JSONB)
trivia_status: str = "draft"        # draft, published, pending_review

timeline_draft: list = None         # Draft timeline (JSONB)
timeline_published: list = None     # Published timeline (JSONB)
timeline_status: str = "draft"      # draft, published, pending_review

# Similar for other categories...
```

**Alternative Approach (Simpler):**
```python
# Keep single field, use curation_status for entire movie
# OR use a separate MovieDraft table for version control
```

---

## 🔄 Workflow Steps

### **Step 1: Import (Save as Draft)**
```
Admin clicks "Import Timeline JSON"
  ↓
Backend validates JSON
  ↓
Backend saves to movie.timeline_draft (NOT movie.timeline)
  ↓
Backend sets movie.timeline_status = "draft"
  ↓
Frontend shows "Draft saved" toast
  ↓
Admin can now review/edit in form
```

### **Step 2: Review & Edit**
```
Admin sees draft data in form
  ↓
Admin can edit/modify the data
  ↓
Admin clicks "Save Draft" (updates timeline_draft)
  ↓
OR Admin clicks "Discard Draft" (deletes timeline_draft)
```

### **Step 3: Publish**
```
Admin reviews draft data
  ↓
Admin clicks "Publish" button
  ↓
Backend copies timeline_draft → timeline_published
  ↓
Backend sets timeline_status = "published"
  ↓
Backend sets curated_at = now()
  ↓
Frontend shows "Published" toast
  ↓
Public API now returns published data
```

### **Step 4: Public API**
```
GET /api/v1/movies/{id}
  ↓
Backend returns movie.timeline_published (NOT timeline_draft)
  ↓
Public website displays published data only
```

---

## 📊 Data Model Options

### **Option A: Separate Draft/Published Fields (Recommended)**
```python
class Movie(Base):
    # Published data (shown on public website)
    trivia: list = None
    timeline: list = None
    
    # Draft data (admin only)
    trivia_draft: list = None
    timeline_draft: list = None
    
    # Status tracking
    trivia_status: str = "draft"  # draft, published, pending_review
    timeline_status: str = "draft"
```

**Pros:**
- ✅ Simple to implement
- ✅ Easy to compare draft vs published
- ✅ No complex migrations
- ✅ Clear separation

**Cons:**
- ❌ Doubles storage for each category
- ❌ Requires updates to all 7 categories

### **Option B: Separate MovieDraft Table**
```python
class MovieDraft(Base):
    movie_id: int
    category: str  # trivia, timeline, etc
    data: dict
    status: str
    created_at: datetime
    updated_at: datetime
```

**Pros:**
- ✅ Cleaner schema
- ✅ Version history built-in
- ✅ Scalable

**Cons:**
- ❌ More complex queries
- ❌ Requires JOIN operations
- ❌ More complex migration

### **Option C: Use Existing curation_status (Simplest)**
```python
# Keep current structure
# Use curation_status for entire movie
# When importing: set curation_status = "draft"
# When publishing: set curation_status = "approved"
# Public API filters: WHERE curation_status = "approved"
```

**Pros:**
- ✅ Minimal changes
- ✅ Already exists in schema
- ✅ Simple migration

**Cons:**
- ❌ Can't have draft trivia + published timeline
- ❌ All-or-nothing approach
- ❌ Less flexible

---

## 🎯 Recommended Approach

**Use Option A: Separate Draft/Published Fields**

**Rationale:**
- Allows per-category draft/publish (trivia can be draft while timeline is published)
- Simple to implement
- Clear separation of concerns
- Easy to understand and maintain

---

## 📝 Implementation Plan

### **Phase 1: Database Migration**
1. Add `trivia_draft`, `trivia_status` fields
2. Add `timeline_draft`, `timeline_status` fields
3. Add similar fields for all 7 categories
4. Create Alembic migration

### **Phase 2: Backend API Changes**
1. Update import endpoints to save to `*_draft` fields
2. Add publish endpoint: `POST /admin/movies/{id}/publish/{category}`
3. Update export endpoints to export both draft and published
4. Update public API to return only published data

### **Phase 3: Frontend UI Changes**
1. Show draft/published status in admin panel
2. Add "Publish" button for each category
3. Add "Discard Draft" button
4. Show comparison view (draft vs published)
5. Add confirmation dialog before publishing

### **Phase 4: Testing**
1. Test import → draft save
2. Test draft editing
3. Test publish workflow
4. Test public API filters
5. Test data persistence

---

## 🔌 API Endpoints

### **Import (Save as Draft)**
```
POST /admin/movies/{external_id}/import/trivia
Request: { category, movie_id, data, metadata }
Response: { success, message, status: "draft" }
```

### **Publish**
```
POST /admin/movies/{external_id}/publish/trivia
Request: { category }
Response: { success, message, status: "published" }
```

### **Discard Draft**
```
DELETE /admin/movies/{external_id}/draft/trivia
Request: { category }
Response: { success, message }
```

### **Get Draft Status**
```
GET /admin/movies/{external_id}/draft-status
Response: {
  trivia: { status: "draft", has_draft: true, has_published: true },
  timeline: { status: "published", has_draft: false, has_published: true },
  ...
}
```

---

## 🧪 Testing Scenarios

1. **Import Trivia as Draft**
   - Import JSON
   - Verify saved to `trivia_draft`
   - Verify `trivia_status = "draft"`
   - Verify not visible on public website

2. **Edit Draft**
   - Modify draft data
   - Save changes
   - Verify updates in `trivia_draft`

3. **Publish Draft**
   - Click "Publish"
   - Verify copied to `trivia`
   - Verify `trivia_status = "published"`
   - Verify visible on public website

4. **Discard Draft**
   - Click "Discard"
   - Verify `trivia_draft` cleared
   - Verify `trivia_status` reset

---

## ✨ Benefits

✅ **Data Quality** - Review before publishing  
✅ **Safety** - No accidental live changes  
✅ **Flexibility** - Per-category draft/publish  
✅ **User Experience** - Clear workflow  
✅ **Audit Trail** - Track who published what  

---

## 📊 Status

**Design:** ✅ Complete  
**Ready for:** Backend Implementation

**Next Steps:**
1. Approve design
2. Create database migration
3. Update backend endpoints
4. Update frontend UI
5. Test end-to-end

