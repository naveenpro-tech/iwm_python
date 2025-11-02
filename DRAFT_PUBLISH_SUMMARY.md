# 📋 Draft/Publish Workflow - Summary & Recommendation

**Date:** 2025-11-02  
**Status:** Design Complete - Ready for Implementation  
**Priority:** High (Data Quality & Safety)

---

## ✅ Your Concern is Valid

You identified a critical issue:
- ❌ Imported data goes directly to production
- ❌ No review/editing before publishing
- ❌ LLM-generated data may contain errors
- ❌ Accidental imports immediately affect public website

**This is a legitimate concern for data quality and safety.**

---

## 🎯 Proposed Solution: Draft/Publish Workflow

### **How It Works**

```
1. IMPORT (Save as Draft)
   Admin imports enriched JSON
   ↓
   Data saved to movie.trivia_draft (NOT movie.trivia)
   ↓
   Status set to "draft"
   ↓
   Data NOT visible on public website

2. REVIEW & EDIT
   Admin reviews draft data in admin panel
   ↓
   Admin can edit/modify the data
   ↓
   Admin can save changes or discard

3. PUBLISH
   Admin clicks "Publish" button
   ↓
   Draft data copied to movie.trivia (published)
   ↓
   Status set to "published"
   ↓
   Data NOW visible on public website

4. PUBLIC API
   GET /api/v1/movies/{id}
   ↓
   Returns only published data (not drafts)
   ↓
   Public website displays published data
```

---

## 🏗️ Technical Approach

### **Database Changes**

Add per-category draft/published fields:

```python
# For each of 7 categories (trivia, timeline, awards, etc):

trivia: list                    # Published data (shown on website)
trivia_draft: list              # Draft data (admin only)
trivia_status: str = "draft"    # Status: draft, published, pending_review
```

**Why this approach?**
- ✅ Per-category control (trivia can be draft while timeline is published)
- ✅ Simple to implement
- ✅ Clear separation of concerns
- ✅ Easy to understand and maintain

---

## 🔧 Implementation Plan

### **Phase 1: Database** (30 min)
- Create Alembic migration
- Add `*_draft` and `*_status` fields for all 7 categories
- Create indexes

### **Phase 2: Backend API** (2 hours)
- Update import endpoints to save to `*_draft`
- Create publish endpoint: `POST /admin/movies/{id}/publish/{category}`
- Create discard endpoint: `DELETE /admin/movies/{id}/draft/{category}`
- Update public API to filter by status

### **Phase 3: Frontend UI** (2 hours)
- Add draft/published status indicators
- Add "Publish" button per category
- Add "Discard Draft" button
- Add confirmation dialogs

### **Phase 4: Testing** (1 hour)
- Test import → draft save
- Test draft editing
- Test publish workflow
- Test public API filters

**Total Time:** ~5.5 hours

---

## 📊 Workflow Comparison

### **Current (Problematic)**
```
Import → Immediate Save → Live on Website
❌ No review
❌ No editing
❌ No safety net
```

### **Proposed (Safe)**
```
Import → Save as Draft → Review/Edit → Publish → Live on Website
✅ Review before publishing
✅ Edit if needed
✅ Discard if wrong
✅ Safety net
```

---

## 🎯 Benefits

✅ **Data Quality** - Review before publishing  
✅ **Safety** - No accidental live changes  
✅ **Flexibility** - Per-category draft/publish  
✅ **User Experience** - Clear workflow  
✅ **Audit Trail** - Track who published what  
✅ **Confidence** - Admin can test before going live  

---

## 📝 API Endpoints (New)

### **Import (Save as Draft)**
```
POST /admin/movies/{external_id}/import/trivia
Response: { success: true, status: "draft", message: "..." }
```

### **Publish**
```
POST /admin/movies/{external_id}/publish/trivia
Response: { success: true, status: "published", message: "..." }
```

### **Discard Draft**
```
DELETE /admin/movies/{external_id}/draft/trivia
Response: { success: true, message: "Draft discarded" }
```

### **Get Draft Status**
```
GET /admin/movies/{external_id}/draft-status
Response: {
  trivia: { status: "draft", has_draft: true, has_published: false },
  timeline: { status: "published", has_draft: false, has_published: true },
  ...
}
```

---

## 🧪 Example Workflow

### **Scenario: Import Trivia for Baahubali**

1. **Import**
   - Admin clicks "Copy Template" → Gets template with movie context
   - Admin enriches with ChatGPT
   - Admin clicks "Import Trivia JSON"
   - Admin pastes enriched JSON
   - Backend saves to `trivia_draft`
   - Admin sees "Draft saved" toast

2. **Review**
   - Admin sees draft trivia in form
   - Admin reviews each item
   - Admin notices LLM made a mistake
   - Admin edits the incorrect item
   - Admin clicks "Save Draft"

3. **Publish**
   - Admin reviews final draft
   - Admin clicks "Publish Trivia"
   - Admin sees confirmation dialog
   - Admin confirms
   - Backend copies to `trivia` (published)
   - Admin sees "Published" toast
   - Trivia now visible on public website

4. **Verification**
   - Admin refreshes page
   - Trivia still visible
   - Admin visits public website
   - Trivia visible to all users

---

## 🔒 Safety Features

✅ **Draft Isolation** - Drafts never shown on public website  
✅ **Explicit Publishing** - Must click "Publish" button  
✅ **Confirmation Dialog** - Confirm before publishing  
✅ **Discard Option** - Can delete draft if wrong  
✅ **Status Tracking** - Always know if draft or published  
✅ **Audit Trail** - Track who published what  

---

## 💡 Alternative Approaches Considered

### **Option A: Separate Draft/Published Fields** ✅ RECOMMENDED
- Per-category control
- Simple implementation
- Clear separation

### **Option B: Separate MovieDraft Table**
- Version history built-in
- More complex queries
- Overkill for current needs

### **Option C: Use Existing curation_status**
- Minimal changes
- All-or-nothing approach
- Less flexible

**We recommend Option A** - Best balance of simplicity and flexibility.

---

## 📊 Status

**Design:** ✅ Complete  
**Documentation:** ✅ Complete  
**Ready for:** Implementation  

**Documents Created:**
1. `DRAFT_PUBLISH_WORKFLOW_DESIGN.md` - Detailed design
2. `DRAFT_PUBLISH_IMPLEMENTATION_GUIDE.md` - Step-by-step guide
3. `DRAFT_PUBLISH_SUMMARY.md` - This document

---

## 🚀 Next Steps

### **Option 1: Implement Now**
- Start with database migration
- Update backend API
- Update frontend UI
- Test end-to-end
- Deploy

### **Option 2: Discuss First**
- Review design with team
- Get feedback
- Adjust if needed
- Then implement

### **Option 3: Hybrid Approach**
- Implement for critical categories first (trivia, timeline)
- Roll out to other categories later
- Gather feedback
- Refine workflow

---

## ❓ Questions to Consider

1. **Should we implement for all 7 categories at once?**
   - Recommended: Yes, for consistency

2. **Should we migrate existing published data?**
   - Recommended: Yes, copy to published field

3. **Should we keep draft history?**
   - Recommended: Not for MVP, add later if needed

4. **Should we require approval before publishing?**
   - Recommended: Not for MVP, add later if needed

---

## ✨ Conclusion

Your concern about data quality is **absolutely valid**. The draft/publish workflow is a **best practice** for content management systems.

**Recommendation:** Implement this workflow to ensure:
- ✅ Data quality through review
- ✅ Safety through explicit publishing
- ✅ Flexibility through per-category control
- ✅ Confidence through clear workflow

**Ready to implement?** Let's build this!

---

**Questions?** Let me know and I'll clarify any part of the design.

