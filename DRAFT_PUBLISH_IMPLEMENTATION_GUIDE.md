# 🚀 Draft/Publish Workflow - Implementation Guide

**Date:** 2025-11-02  
**Status:** Ready for Implementation  
**Estimated Time:** 4-6 hours

---

## 📋 Implementation Checklist

### **Phase 1: Database Migration** (30 min)
- [ ] Create Alembic migration file
- [ ] Add `*_draft` and `*_status` fields for all 7 categories
- [ ] Create indexes for status fields
- [ ] Test migration up/down

### **Phase 2: Backend API** (2 hours)
- [ ] Update import endpoints to save to `*_draft`
- [ ] Create publish endpoint
- [ ] Create discard draft endpoint
- [ ] Update public API to filter by status
- [ ] Add validation and error handling

### **Phase 3: Frontend UI** (2 hours)
- [ ] Add draft/published status indicators
- [ ] Add "Publish" button per category
- [ ] Add "Discard Draft" button
- [ ] Add confirmation dialogs
- [ ] Update import modal

### **Phase 4: Testing** (1 hour)
- [ ] Test import → draft save
- [ ] Test draft editing
- [ ] Test publish workflow
- [ ] Test public API filters
- [ ] Test data persistence

---

## 🗄️ Database Migration

### **Create Migration File**
```bash
cd apps/backend
alembic revision --autogenerate -m "add_draft_publish_workflow"
```

### **Migration Content**

Add these fields to the `movies` table:

```python
# For each of 7 categories:
# trivia, timeline, awards, cast_crew, media, streaming, basic_info

# Trivia
op.add_column('movies', sa.Column('trivia_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('trivia_status', sa.String(20), nullable=True, server_default='draft'))

# Timeline
op.add_column('movies', sa.Column('timeline_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('timeline_status', sa.String(20), nullable=True, server_default='draft'))

# Awards
op.add_column('movies', sa.Column('awards_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('awards_status', sa.String(20), nullable=True, server_default='draft'))

# Cast & Crew
op.add_column('movies', sa.Column('cast_crew_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('cast_crew_status', sa.String(20), nullable=True, server_default='draft'))

# Media
op.add_column('movies', sa.Column('media_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('media_status', sa.String(20), nullable=True, server_default='draft'))

# Streaming
op.add_column('movies', sa.Column('streaming_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('streaming_status', sa.String(20), nullable=True, server_default='draft'))

# Basic Info
op.add_column('movies', sa.Column('basic_info_draft', postgresql.JSONB(), nullable=True))
op.add_column('movies', sa.Column('basic_info_status', sa.String(20), nullable=True, server_default='draft'))

# Create indexes
op.create_index('ix_movies_trivia_status', 'movies', ['trivia_status'])
op.create_index('ix_movies_timeline_status', 'movies', ['timeline_status'])
# ... etc for all categories
```

---

## 🔧 Backend Implementation

### **1. Update Movie Model**

Add to `apps/backend/src/models.py`:

```python
class Movie(Base):
    # ... existing fields ...
    
    # Trivia (draft/published)
    trivia: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    trivia_draft: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    trivia_status: Mapped[str | None] = mapped_column(String(20), nullable=True, default="draft")
    
    # Timeline (draft/published)
    timeline: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    timeline_draft: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    timeline_status: Mapped[str | None] = mapped_column(String(20), nullable=True, default="draft")
    
    # Similar for: awards, cast_crew, media, streaming, basic_info
```

### **2. Update Import Endpoints**

Change import endpoints to save to `*_draft`:

```python
@router.post("/{external_id}/import/trivia", response_model=ImportResponse)
async def import_trivia(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data
    
    if "items" in data and isinstance(data["items"], list):
        # Save to DRAFT, not published
        movie.trivia_draft = data["items"]
        movie.trivia_status = "draft"
        await session.commit()
        
        return ImportResponse(
            success=True,
            message=f"Trivia imported as draft. Click 'Publish' to make live.",
            updated_fields=["trivia_draft"],
            status="draft"  # NEW
        )
```

### **3. Add Publish Endpoint**

```python
@router.post("/{external_id}/publish/{category}", response_model=ImportResponse)
async def publish_draft(
    external_id: str,
    category: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    movie = await get_movie_by_external_id(session, external_id)
    
    # Map category to field names
    draft_field = f"{category}_draft"
    published_field = category
    status_field = f"{category}_status"
    
    # Get draft data
    draft_data = getattr(movie, draft_field, None)
    if not draft_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No draft data for {category}"
        )
    
    # Copy draft to published
    setattr(movie, published_field, draft_data)
    setattr(movie, status_field, "published")
    movie.curated_at = datetime.now(timezone.utc)
    
    await session.commit()
    
    return ImportResponse(
        success=True,
        message=f"{category} published successfully",
        updated_fields=[published_field],
        status="published"
    )
```

### **4. Update Public API**

Filter to only return published data:

```python
@router.get("/{external_id}")
async def get_movie(external_id: str, session: AsyncSession = Depends(get_session)):
    movie = await get_movie_by_external_id(session, external_id)
    
    # Return only published data
    return {
        "id": movie.id,
        "title": movie.title,
        "trivia": movie.trivia,  # Published only
        "timeline": movie.timeline,  # Published only
        # ... etc
    }
```

---

## 🎨 Frontend Implementation

### **1. Update ImportCategoryModal**

Show draft status after import:

```typescript
// After successful import
setImportResult({
  success: true,
  message: "Imported as draft. Click 'Publish' to make live.",
  status: "draft"  // NEW
})
```

### **2. Add Publish Button**

In each category tab:

```typescript
<Button 
  onClick={handlePublish}
  disabled={!hasDraft}
  variant="default"
>
  Publish {category}
</Button>
```

### **3. Add Status Indicator**

Show draft/published status:

```typescript
<Badge variant={status === "draft" ? "secondary" : "default"}>
  {status === "draft" ? "Draft" : "Published"}
</Badge>
```

---

## 🧪 Testing Checklist

### **Backend Tests**
- [ ] Import saves to `*_draft` field
- [ ] `*_status` set to "draft"
- [ ] Publish copies draft to published
- [ ] `*_status` set to "published"
- [ ] Public API returns only published
- [ ] Discard clears draft

### **Frontend Tests**
- [ ] Import shows "Draft" status
- [ ] "Publish" button appears
- [ ] Click publish → "Published" status
- [ ] Data visible on public website
- [ ] Refresh page → data persists

### **Integration Tests**
- [ ] Full workflow: import → edit → publish
- [ ] Multiple categories independently
- [ ] Draft doesn't appear on public site
- [ ] Published data appears on public site

---

## 📊 Status

**Design:** ✅ Complete  
**Implementation:** 🔄 Ready to Start  
**Testing:** ⏳ Pending  

**Next Steps:**
1. Create database migration
2. Update Movie model
3. Update import endpoints
4. Add publish endpoint
5. Update frontend UI
6. Test end-to-end

---

## 💡 Key Points

✅ **Per-Category Control** - Each category can be draft/published independently  
✅ **Data Safety** - No accidental live changes  
✅ **Clear Workflow** - Import → Review → Publish  
✅ **Audit Trail** - Track who published what  
✅ **Backward Compatible** - Existing published data unaffected  

---

## ⏱️ Timeline

- **Database Migration:** 30 min
- **Backend API:** 2 hours
- **Frontend UI:** 2 hours
- **Testing:** 1 hour
- **Total:** 5.5 hours

**Ready to start?** Let's implement this!

