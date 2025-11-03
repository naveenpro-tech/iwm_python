# 🎯 Admin Dashboard Enhancement Plan - Siddu's Curated Selections

**Date**: 2025-11-03  
**Feature**: Siddu's Curated Selections Management  
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

This document provides a complete implementation plan for the "Siddu's Curated Selections" feature in the admin dashboard. This feature allows administrators (Siddu) to curate and schedule featured content that appears on the frontend landing page.

---

## 🎯 Feature Overview

### What is "Siddu's Curated Selections"?

A powerful admin tool that allows Siddu to:
1. **Select Movie of the Day/Week/Month/Year**
2. **Create custom curated lists** (e.g., "Best Thrillers of 2024")
3. **Schedule future picks** (set in advance)
4. **Preview selections** before publishing
5. **Auto-update frontend** when changes are made

### Why This Feature?

- **Editorial Control**: Siddu can highlight specific movies
- **Fresh Content**: Automated rotation keeps homepage dynamic
- **User Engagement**: Curated picks drive discovery
- **Brand Voice**: Establishes Siddu as a trusted curator

---

## 🏗️ Architecture

### Database Schema

**New Table**: `curated_selections`

```sql
CREATE TABLE curated_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Selection Type
    selection_type VARCHAR(50) NOT NULL,  -- 'movie_of_day', 'movie_of_week', 'movie_of_month', 'movie_of_year', 'custom_list'
    
    -- Movie Reference
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,  -- For single movie picks
    
    -- Custom List (for multiple movies)
    list_title VARCHAR(200),  -- e.g., "Best Thrillers of 2024"
    list_description TEXT,
    movie_ids UUID[],  -- Array of movie IDs for custom lists
    
    -- Curator Information
    curator_id UUID REFERENCES users(id) NOT NULL,
    curator_note TEXT,  -- Why this movie/list was chosen
    
    -- Scheduling
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,  -- NULL for indefinite
    is_active BOOLEAN DEFAULT true,
    
    -- Display Settings
    display_order INTEGER DEFAULT 0,
    featured_on_homepage BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_selection_type CHECK (
        selection_type IN ('movie_of_day', 'movie_of_week', 'movie_of_month', 'movie_of_year', 'custom_list')
    ),
    CONSTRAINT movie_or_list CHECK (
        (selection_type != 'custom_list' AND movie_id IS NOT NULL) OR
        (selection_type = 'custom_list' AND movie_ids IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_curated_selections_type ON curated_selections(selection_type);
CREATE INDEX idx_curated_selections_active ON curated_selections(is_active);
CREATE INDEX idx_curated_selections_dates ON curated_selections(start_date, end_date);
CREATE INDEX idx_curated_selections_curator ON curated_selections(curator_id);
```

---

## 🎨 Admin UI Design

### Location in Admin Dashboard

**Path**: `/admin/content` (existing page)  
**New Tab**: "Siddu's Picks"

**Current Tabs**:
1. Homepage
2. Curated Lists
3. Promotional
4. Events & Awards

**Add New Tab**:
5. **Siddu's Picks** ← NEW

---

### UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Siddu's Curated Selections                             │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Quick Actions                                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │  │
│  │  │ Movie of │ │ Movie of │ │ Custom   │         │  │
│  │  │ the Day  │ │ the Week │ │ List     │         │  │
│  │  └──────────┘ └──────────┘ └──────────┘         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Active Selections                                │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 🎬 Movie of the Day                        │  │  │
│  │  │ "Inception" (2010)                         │  │  │
│  │  │ Active: Jan 15, 2025                       │  │  │
│  │  │ [Edit] [Preview] [Deactivate]              │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 📅 Movie of the Week                       │  │  │
│  │  │ "The Shawshank Redemption" (1994)          │  │  │
│  │  │ Active: Jan 13-19, 2025                    │  │  │
│  │  │ [Edit] [Preview] [Deactivate]              │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Scheduled Selections                             │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 🗓️ Movie of the Month (Feb 2025)          │  │  │
│  │  │ "Parasite" (2019)                          │  │  │
│  │  │ Starts: Feb 1, 2025                        │  │  │
│  │  │ [Edit] [Preview] [Delete]                  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Structure

### 1. Main Component

**File**: `components/admin/content/siddus-picks-manager.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Star, List } from 'lucide-react';
import { ActiveSelections } from './active-selections';
import { ScheduledSelections } from './scheduled-selections';
import { CreateSelectionDialog } from './create-selection-dialog';
import { PreviewDialog } from './preview-dialog';

export function SiddusPicksManager() {
  const [activeSelections, setActiveSelections] = useState([]);
  const [scheduledSelections, setScheduledSelections] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectionType, setSelectionType] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    fetchActiveSelections();
    fetchScheduledSelections();
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => {
                setSelectionType('movie_of_day');
                setShowCreateDialog(true);
              }}
              className="h-24 flex flex-col gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span>Movie of the Day</span>
            </Button>
            
            <Button
              onClick={() => {
                setSelectionType('movie_of_week');
                setShowCreateDialog(true);
              }}
              className="h-24 flex flex-col gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span>Movie of the Week</span>
            </Button>
            
            <Button
              onClick={() => {
                setSelectionType('movie_of_month');
                setShowCreateDialog(true);
              }}
              className="h-24 flex flex-col gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span>Movie of the Month</span>
            </Button>
            
            <Button
              onClick={() => {
                setSelectionType('custom_list');
                setShowCreateDialog(true);
              }}
              className="h-24 flex flex-col gap-2"
            >
              <List className="w-6 h-6" />
              <span>Custom List</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Selections</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ActiveSelections selections={activeSelections} />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledSelections selections={scheduledSelections} />
        </TabsContent>

        <TabsContent value="history">
          {/* Past selections */}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateSelectionDialog
          type={selectionType}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={() => {
            fetchActiveSelections();
            fetchScheduledSelections();
          }}
        />
      )}
    </div>
  );
}
```

---

### 2. Create Selection Dialog

**File**: `components/admin/content/create-selection-dialog.tsx`

```typescript
interface CreateSelectionDialogProps {
  type: 'movie_of_day' | 'movie_of_week' | 'movie_of_month' | 'movie_of_year' | 'custom_list';
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSelectionDialog({ type, onClose, onSuccess }: CreateSelectionDialogProps) {
  const [step, setStep] = useState(1); // 1: Select Movie, 2: Add Details, 3: Schedule, 4: Preview
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [curatorNote, setCuratorNote] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Create {type.replace('_', ' ').toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <Step number={1} active={step === 1} completed={step > 1} label="Select Movie" />
          <Step number={2} active={step === 2} completed={step > 2} label="Add Details" />
          <Step number={3} active={step === 3} completed={step > 3} label="Schedule" />
          <Step number={4} active={step === 4} completed={step > 4} label="Preview" />
        </div>

        {/* Step Content */}
        {step === 1 && <MovieSearchStep onSelect={setSelectedMovie} />}
        {step === 2 && <DetailsStep note={curatorNote} onNoteChange={setCuratorNote} />}
        {step === 3 && <ScheduleStep startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />}
        {step === 4 && <PreviewStep movie={selectedMovie} note={curatorNote} startDate={startDate} endDate={endDate} />}

        {/* Navigation */}
        <DialogFooter>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 4 && <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>Next</Button>}
          {step === 4 && <Button onClick={handleSubmit}>Publish</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 3. Movie Search Step

**File**: `components/admin/content/movie-search-step.tsx`

```typescript
export function MovieSearchStep({ onSelect }: { onSelect: (movie: Movie) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async () => {
    const results = await searchMovies(searchQuery);
    setSearchResults(results);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
        {searchResults.map((movie) => (
          <Card
            key={movie.id}
            className={`cursor-pointer ${selectedMovie?.id === movie.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => {
              setSelectedMovie(movie);
              onSelect(movie);
            }}
          >
            <Image src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3]" />
            <CardContent className="p-2">
              <p className="font-semibold text-sm truncate">{movie.title}</p>
              <p className="text-xs text-gray-500">{movie.year}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. Preview Component

**File**: `components/admin/content/preview-step.tsx`

```typescript
export function PreviewStep({ movie, note, startDate, endDate }: PreviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Frontend Preview</h3>
        
        {/* Simulate how it will look on the landing page */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
          <div className="flex gap-4">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              className="w-32 h-48 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="text-xl font-bold">{movie.title}</h4>
              <p className="text-sm text-gray-500">{movie.year} • {movie.genres.join(', ')}</p>
              <div className="mt-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{movie.rating}/10</span>
              </div>
              <p className="mt-4 text-sm italic">"{note}"</p>
              <p className="mt-2 text-xs text-gray-500">
                - Siddu's Pick
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
          <p className="text-sm">
            <strong>Active Period:</strong> {formatDate(startDate)} 
            {endDate && ` - ${formatDate(endDate)}`}
          </p>
        </div>
      </div>

      {/* Confirmation */}
      <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <p className="font-semibold">Ready to publish?</p>
          <p className="text-sm text-gray-600">
            This selection will be immediately visible on the homepage once published.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔌 Backend API Endpoints

### 1. Get Active Selections
```typescript
GET /api/v1/admin/curated-selections/active

Response:
{
  "selections": [
    {
      "id": "uuid",
      "selection_type": "movie_of_day",
      "movie": {
        "id": "uuid",
        "title": "Inception",
        "year": 2010,
        "posterUrl": "...",
        "rating": 8.8
      },
      "curator_note": "A mind-bending masterpiece...",
      "start_date": "2025-01-15T00:00:00Z",
      "end_date": null,
      "is_active": true
    }
  ]
}
```

### 2. Create Selection
```typescript
POST /api/v1/admin/curated-selections

Request:
{
  "selection_type": "movie_of_day",
  "movie_id": "uuid",
  "curator_note": "A mind-bending masterpiece...",
  "start_date": "2025-01-15T00:00:00Z",
  "end_date": null,
  "featured_on_homepage": true
}

Response:
{
  "id": "uuid",
  "message": "Selection created successfully"
}
```

### 3. Update Selection
```typescript
PUT /api/v1/admin/curated-selections/{id}

Request:
{
  "curator_note": "Updated note...",
  "end_date": "2025-01-16T00:00:00Z"
}
```

### 4. Delete Selection
```typescript
DELETE /api/v1/admin/curated-selections/{id}
```

### 5. Get Frontend Selections (Public)
```typescript
GET /api/v1/curated-selections/current

Response:
{
  "movie_of_day": { ... },
  "movie_of_week": { ... },
  "movie_of_month": { ... },
  "custom_lists": [ ... ]
}
```

---

## 📊 Implementation Checklist

### Phase 1: Database (2 hours)
- [ ] Create `curated_selections` table
- [ ] Add indexes
- [ ] Create migration script
- [ ] Test database schema

### Phase 2: Backend API (6 hours)
- [ ] Create FastAPI router (`apps/backend/src/routers/admin/curated_selections.py`)
- [ ] Implement CRUD endpoints
- [ ] Add admin authentication
- [ ] Add validation
- [ ] Test API endpoints

### Phase 3: Admin UI Components (12 hours)
- [ ] Create `SiddusPicksManager` component
- [ ] Create `CreateSelectionDialog` component
- [ ] Create `MovieSearchStep` component
- [ ] Create `DetailsStep` component
- [ ] Create `ScheduleStep` component
- [ ] Create `PreviewStep` component
- [ ] Create `ActiveSelections` component
- [ ] Create `ScheduledSelections` component

### Phase 4: Integration (4 hours)
- [ ] Add "Siddu's Picks" tab to `/admin/content`
- [ ] Connect components to API
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test admin workflow

### Phase 5: Frontend Display (6 hours)
- [ ] Update landing page to fetch curated selections
- [ ] Display "Siddu's Picks" section
- [ ] Add auto-refresh logic
- [ ] Test frontend display

### Phase 6: Testing (4 hours)
- [ ] Test create flow
- [ ] Test edit flow
- [ ] Test scheduling
- [ ] Test preview
- [ ] Test frontend display
- [ ] Fix bugs

---

## 🎯 Success Criteria

- [ ] Admin can create Movie of the Day/Week/Month/Year
- [ ] Admin can create custom curated lists
- [ ] Admin can schedule future selections
- [ ] Admin can preview selections before publishing
- [ ] Frontend auto-updates when selections change
- [ ] Selections display correctly on landing page
- [ ] Past selections are archived
- [ ] Only one active selection per type at a time

---

**Total Estimated Effort**: 34 hours (~1 week)  
**Priority**: Medium (can be done post-MVP)  
**Dependencies**: Landing page implementation


