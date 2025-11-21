# Movie Creation Form - Complete Structure Documentation

**Location**: `http://localhost:3000/admin/movies/new`  
**Route File**: `app/admin/movies/[id]/page.tsx`  
**Generated**: 2025-10-30  
**Purpose**: Complete reference for the "Add New Movie" form structure in the IWM Admin Dashboard

---

## Form Overview

- **Total Tabs/Sections**: 7
- **Total Fields**: 50+ fields across all tabs
- **Required Fields**: 3 (Title, Release Date, Status)
- **Optional Fields**: 47+
- **Navigation Pattern**: Horizontal tabs (responsive grid layout)
- **Form Type**: Multi-step tabbed form with real-time validation
- **Save Behavior**: Single "Save Movie" button at top-right saves all tabs

---

## High-Level Structure

### Tab Navigation
The form uses a horizontal tab layout that adapts to screen size:
- **Mobile**: 3 columns grid
- **Tablet**: 4 columns grid  
- **Desktop**: 7 columns grid (all tabs visible)

### Tab Order
1. **Basic Info** - Core movie details
2. **Media** - Poster, backdrop, gallery, trailer
3. **Cast & Crew** - Actors and production team
4. **Streaming** - Streaming platform availability
5. **Awards** - Awards and nominations
6. **Trivia** - Fun facts and trivia questions
7. **Timeline** - Production and release timeline events

---

## Tab 1: Basic Info

**Tab Label**: "Basic Info"  
**Component**: `MovieBasicInfoForm`  
**File**: `components/admin/movies/forms/movie-basic-info-form.tsx`

### Section: Basic Information Card

#### Field 1.1: Title
- **Field Label**: "Title"
- **Field ID**: `title`
- **Field Type**: Text input
- **Required**: Yes (implied by usage)
- **Placeholder**: None
- **Default Value**: Empty string
- **Validation Rules**: None specified in UI
- **Help Text**: None

#### Field 1.2: Original Title
- **Field Label**: "Original Title"
- **Field ID**: `original-title`
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: None
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None

#### Field 1.3: Synopsis
- **Field Label**: "Synopsis"
- **Field ID**: `synopsis`
- **Field Type**: Textarea
- **Required**: No
- **Placeholder**: None
- **Default Value**: Empty string
- **Rows**: 4
- **Validation Rules**: None
- **Help Text**: None

#### Field 1.4: Release Date
- **Field Label**: "Release Date"
- **Field ID**: `release-date`
- **Field Type**: Date picker (HTML5 date input)
- **Required**: Yes (default value provided)
- **Placeholder**: None
- **Default Value**: Current date (YYYY-MM-DD format)
- **Validation Rules**: HTML5 date format
- **Help Text**: None

#### Field 1.5: Runtime
- **Field Label**: "Runtime (minutes)"
- **Field ID**: `runtime`
- **Field Type**: Number input
- **Required**: No
- **Placeholder**: None
- **Default Value**: 0
- **Validation Rules**: Must be numeric, defaults to 0 if invalid
- **Help Text**: None

#### Field 1.6: Status
- **Field Label**: "Status"
- **Field ID**: `status`
- **Field Type**: Dropdown/Select
- **Required**: Yes
- **Placeholder**: None
- **Default Value**: "released"
- **Options**: 
  - "upcoming"
  - "released"
  - "archived"
  - "draft"
  - "in-production"
  - "post-production"
- **Validation Rules**: Must be one of the predefined options
- **Help Text**: None

#### Field 1.7: Genres
- **Field Label**: "Genres"
- **Field Type**: Multi-select with badge display
- **Required**: No
- **Placeholder**: "Add genre"
- **Default Value**: Empty array
- **Options**: 
  - "Action"
  - "Adventure"
  - "Animation"
  - "Biography"
  - "Comedy"
  - "Crime"
  - "Documentary"
  - "Drama"
  - "Family"
  - "Fantasy"
  - "History"
  - "Horror"
  - "Music"
  - "Mystery"
  - "Romance"
  - "Sci-Fi"
  - "Sport"
  - "Thriller"
  - "War"
  - "Western"
  - "TV Movie"
- **Validation Rules**: Can select multiple, no duplicates
- **Help Text**: None
- **UI Behavior**: Selected genres appear as removable badges above dropdown

#### Field 1.8: Languages
- **Field Label**: "Languages"
- **Field Type**: Multi-select with badge display
- **Required**: No
- **Placeholder**: "Add language"
- **Default Value**: Empty array
- **Options**:
  - "English"
  - "Spanish"
  - "French"
  - "German"
  - "Japanese"
  - "Korean"
  - "Hindi"
  - "Mandarin"
  - "Cantonese"
  - "Italian"
  - "Russian"
  - "Tamil"
  - "Telugu"
- **Validation Rules**: Can select multiple, no duplicates
- **Help Text**: None
- **UI Behavior**: Selected languages appear as removable badges above dropdown

#### Field 1.9: SidduScore
- **Field Label**: "SidduScore"
- **Field ID**: `siddu-score`
- **Field Type**: Number input
- **Required**: No
- **Placeholder**: None
- **Default Value**: 0
- **Min**: 0
- **Max**: 10
- **Step**: 0.1
- **Validation Rules**: Must be between 0-10, decimal allowed
- **Help Text**: None

#### Field 1.10: Certification
- **Field Label**: "Certification"
- **Field ID**: `certification`
- **Field Type**: Dropdown/Select
- **Required**: No
- **Placeholder**: None
- **Default Value**: "pg-13"
- **Options**:
  - "G"
  - "PG"
  - "PG-13"
  - "R"
  - "NC-17"
  - "Unrated"
  - "TV-MA"
  - "TV-14"
  - "TV-PG"
  - "TV-G"
  - "U"
  - "U/A"
  - "A"
  - "S"
- **Validation Rules**: Must be one of the predefined options
- **Help Text**: None

---

## Tab 2: Media

**Tab Label**: "Media"  
**Component**: `MovieMediaForm`  
**File**: `components/admin/movies/forms/movie-media-form.tsx`

### Section 2.1: Movie Poster Card

#### Field 2.1.1: Poster Upload (File)
- **Field Label**: "Upload Poster"
- **Field ID**: `poster-upload`
- **Field Type**: File input (hidden, triggered by button)
- **Required**: No
- **Placeholder**: None
- **Default Value**: "/inception-movie-poster.png" (placeholder)
- **Accepted Formats**: `image/*`
- **Validation Rules**: Must be image file
- **Help Text**: "Recommended size: 1000x1500px (2:3 ratio)"
- **UI Behavior**: Hidden file input, triggered by "Choose File" button

#### Field 2.1.2: Poster URL
- **Field Label**: None (inline with upload)
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "Or enter image URL"
- **Default Value**: "/inception-movie-poster.png"
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: Alternative to file upload, displays preview on right

### Section 2.2: Backdrop Image Card

#### Field 2.2.1: Backdrop Upload (File)
- **Field Label**: None (button label: "Upload Backdrop")
- **Field ID**: `backdrop-upload`
- **Field Type**: File input (hidden, triggered by button)
- **Required**: No
- **Placeholder**: None
- **Default Value**: "/dark-blue-city-skyline.png" (placeholder)
- **Accepted Formats**: `image/*`
- **Validation Rules**: Must be image file
- **Help Text**: "Recommended size: 1920x1080px (16:9 ratio)"

#### Field 2.2.2: Backdrop URL
- **Field Label**: None
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "Or enter image URL"
- **Default Value**: "/dark-blue-city-skyline.png"
- **Validation Rules**: None
- **Help Text**: None

### Section 2.3: Gallery Images Card

#### Field 2.3.1: Gallery Image URL
- **Field Label**: "Add Image from URL"
- **Field ID**: `gallery-url`
- **Field Type**: Text input with "Add" button
- **Required**: No
- **Placeholder**: "https://example.com/image.jpg"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: Press Enter or click "Add" to add image to gallery

#### Field 2.3.2: Gallery Images List
- **Field Label**: "Gallery Images ({count})"
- **Field Type**: Reorderable grid of images
- **Required**: No
- **Default Value**: ["/inception-scene-thumbnail.png"]
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: 
  - Drag to reorder images
  - Hover to see delete button
  - Grid layout: 2 columns (mobile), 4 columns (desktop)

#### Field 2.3.3: Gallery Upload (Multiple Files)
- **Field Label**: None (button label: "Upload Images from Device")
- **Field ID**: `gallery-upload`
- **Field Type**: File input (multiple, hidden)
- **Required**: No
- **Accepted Formats**: `image/*`
- **Multiple**: Yes
- **Validation Rules**: Must be image files
- **Help Text**: None

### Section 2.4: Trailer Card

#### Field 2.4.1: Trailer URL
- **Field Label**: "YouTube/Vimeo URL"
- **Field ID**: `trailer-url`
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "https://youtube.com/watch?v=... or https://vimeo.com/..."
- **Default Value**: Empty string
- **Validation Rules**: Auto-detects YouTube/Vimeo URLs
- **Help Text**: "Paste a YouTube or Vimeo URL and the embed code will be generated automatically"
- **UI Behavior**: Auto-generates embed code on valid URL

#### Field 2.4.2: Trailer Embed Code
- **Field Label**: "Embed Code (Auto-generated or Custom)"
- **Field ID**: `trailer-embed`
- **Field Type**: Textarea
- **Required**: No
- **Placeholder**: "<iframe>...</iframe>"
- **Default Value**: Empty string
- **Rows**: 4
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: Auto-populated from trailer URL, can be manually edited

---

## Tab 3: Cast & Crew

**Tab Label**: "Cast & Crew"  
**Component**: `MovieCastCrewForm`  
**File**: `components/admin/movies/forms/movie-cast-crew-form.tsx`

### Section 3.1: Cast Card

**Action Button**: "Add Cast Member" (top-right of card)

#### Add Cast Member Form (Expandable)

##### Field 3.1.1: Actor Name
- **Field Label**: "Actor Name"
- **Field Type**: Searchable input with autocomplete
- **Required**: Yes (for adding)
- **Placeholder**: "Search for actor..."
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: 
  - Live search with 300ms debounce
  - Searches backend API: `/api/v1/search?q={query}&types=people&limit=10`
  - Shows loading spinner during search
  - Displays results in popover dropdown
  - Can manually type name if not found

##### Field 3.1.2: Character Name
- **Field Label**: "Character Name"
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "Character name"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None

##### Field 3.1.3: Image URL
- **Field Label**: "Image URL"
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "https://example.com/image.jpg"
- **Default Value**: Auto-filled from search result or empty
- **Validation Rules**: None
- **Help Text**: None

**Form Actions**: "Cancel" and "Add to Cast" buttons

#### Cast Members List
- **Field Type**: Reorderable list
- **UI Behavior**:
  - Drag handle (GripVertical icon) to reorder
  - Avatar display with fallback initials
  - Shows: Name and "as {character}"
  - Hover to reveal delete button (X icon)
  - Prevents duplicate names (case-insensitive)

### Section 3.2: Crew Card

**Action Button**: "Add Crew Member" (top-right of card)

#### Add Crew Member Form (Expandable)

##### Field 3.2.1: Crew Member Name
- **Field Label**: "Name"
- **Field Type**: Searchable input with autocomplete
- **Required**: Yes (for adding)
- **Placeholder**: "Search for person..."
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: Same as cast search

##### Field 3.2.2: Image URL
- **Field Label**: "Image URL"
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "https://example.com/image.jpg"
- **Default Value**: Auto-filled from search or empty
- **Validation Rules**: None
- **Help Text**: None

##### Field 3.2.3: Role
- **Field Label**: "Role"
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "e.g., Director, Producer"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None

##### Field 3.2.4: Department
- **Field Label**: "Department"
- **Field Type**: Dropdown/Select
- **Required**: No
- **Placeholder**: "Select department"
- **Default Value**: Empty
- **Options**:
  - "Directing"
  - "Production"
  - "Writing"
  - "Cinematography"
  - "Editing"
  - "Music"
  - "Sound"
  - "Art"
  - "Costume & Make-Up"
  - "Visual Effects"
- **Validation Rules**: Must be one of predefined options
- **Help Text**: None

**Form Actions**: "Cancel" and "Add to Crew" buttons

#### Crew Members List
- **Field Type**: Static list (not reorderable)
- **UI Behavior**:
  - Avatar display with fallback initials
  - Shows: Name, Role • Department
  - Hover to reveal delete button
  - Prevents duplicate names (case-insensitive)

---

## Tab 4: Streaming

**Tab Label**: "Streaming"
**Component**: `MovieStreamingForm`
**File**: `components/admin/movies/forms/movie-streaming-form.tsx`

### Section 4.1: Streaming Availability Card

**Card Title**: "Streaming Availability"
**Card Description**: "Manage where this movie is available to watch online"
**Action Button**: "Add Streaming Link" (top-right)

#### Add Streaming Link Form (Expandable)

##### Field 4.1.1: Streaming Provider
- **Field Label**: "Streaming Provider"
- **Field Type**: Dropdown/Select
- **Required**: Yes (for adding)
- **Placeholder**: "Select provider"
- **Default Value**: Empty
- **Options**:
  - "Netflix"
  - "Amazon Prime Video"
  - "Disney+"
  - "HBO Max"
  - "Hulu"
  - "Apple TV+"
  - "YouTube Movies"
  - "Google Play Movies"
  - "Vudu"
  - "JioCinema"
- **Validation Rules**: Must be one of predefined providers
- **Help Text**: None

##### Field 4.1.2: Region
- **Field Label**: "Region"
- **Field Type**: Dropdown/Select
- **Required**: No
- **Placeholder**: None
- **Default Value**: "US"
- **Options**:
  - "US" - United States
  - "IN" - India
  - "GB" - United Kingdom
  - "CA" - Canada
  - "AU" - Australia
  - "DE" - Germany
  - "FR" - France
- **Validation Rules**: Must be one of predefined regions
- **Help Text**: None

##### Field 4.1.3: Streaming URL
- **Field Label**: "Streaming URL"
- **Field Type**: Text input
- **Required**: Yes (for adding)
- **Placeholder**: "https://..."
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None

##### Field 4.1.4: Type
- **Field Label**: "Type"
- **Field Type**: Dropdown/Select
- **Required**: No
- **Placeholder**: None
- **Default Value**: "subscription"
- **Options**:
  - "subscription"
  - "rent"
  - "buy"
- **Validation Rules**: Must be one of predefined types
- **Help Text**: None

##### Field 4.1.5: Quality
- **Field Label**: "Quality"
- **Field Type**: Dropdown/Select
- **Required**: No
- **Placeholder**: None
- **Default Value**: "HD"
- **Options**:
  - "SD"
  - "HD"
  - "4K"
- **Validation Rules**: Must be one of predefined qualities
- **Help Text**: None

##### Field 4.1.6: Price
- **Field Label**: "Price"
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "$3.99"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None
- **Conditional Display**: Only shown when Type is "rent" or "buy"

**Form Actions**: "Cancel" and "Add Link" buttons

#### Streaming Links List
- **Field Type**: List of streaming links
- **UI Behavior**:
  - Displays: Provider name, Region badge, Type badge, Quality badge, Price badge (if applicable)
  - Shows URL with external link icon
  - Verification status badge: "Verified" (green) or "Unverified" (yellow)
  - Hover to reveal "Verify" button (if unverified) and delete button
  - Click URL to open in new tab

### Section 4.2: Regional Settings Card

**Card Title**: "Regional Settings"

#### Field 4.2.1: Geo-blocking
- **Field Label**: "Geo-blocking"
- **Field ID**: `geo-blocking`
- **Field Type**: Switch/Toggle
- **Required**: No
- **Default Value**: Off
- **Validation Rules**: None
- **Help Text**: "Enable region-specific availability"

#### Field 4.2.2: Auto-verify Links
- **Field Label**: "Auto-verify Links"
- **Field ID**: `auto-verify`
- **Field Type**: Switch/Toggle
- **Required**: No
- **Default Value**: On (checked)
- **Validation Rules**: None
- **Help Text**: "Automatically check link validity daily"

---

## Tab 5: Awards

**Tab Label**: "Awards"
**Component**: `MovieAwardsForm`
**File**: `components/admin/movies/forms/movie-awards-form.tsx`

### Section 5.1: Awards & Nominations Card

**Card Title**: "Awards & Nominations"
**Card Description**: "Manage awards and nominations received by the movie."
**Action Button**: "Add Award/Nomination" (bottom, full-width, only shown when not editing)

#### Add/Edit Award Form (Expandable)

##### Field 5.1.1: Award Name / Event
- **Field Label**: "Award Name / Event"
- **Field ID**: `award-name`
- **Field Type**: Searchable text input with autocomplete
- **Required**: Yes
- **Placeholder**: "Search or type award name (e.g., Academy Awards)"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**:
  - Search icon on left
  - Live search through predefined award pool
  - Shows dropdown with matching awards
  - Can manually type if not found
  - Clicking suggestion auto-fills name and default category

**Predefined Award Pool**:
- "Academy Awards" (default category: "Best Picture")
- "Golden Globe Awards" (default category: "Best Motion Picture - Drama")
- "BAFTA Awards" (default category: "Best Film")
- "Cannes Film Festival" (default category: "Palme d'Or")
- "Filmfare Awards" (default category: "Best Film")

##### Field 5.1.2: Category
- **Field Label**: "Category"
- **Field ID**: `award-category`
- **Field Type**: Text input
- **Required**: Yes
- **Placeholder**: "e.g., Best Picture"
- **Default Value**: Auto-filled from award selection or empty
- **Validation Rules**: None
- **Help Text**: None

##### Field 5.1.3: Year
- **Field Label**: "Year"
- **Field ID**: `award-year`
- **Field Type**: Number input
- **Required**: Yes
- **Placeholder**: Current year
- **Default Value**: Current year
- **Min**: 1900
- **Max**: Current year + 5
- **Validation Rules**: Must be between 1900 and current year + 5
- **Help Text**: "1900 - {current year + 5}"

##### Field 5.1.4: Status
- **Field Label**: "Status"
- **Field ID**: `award-status`
- **Field Type**: Dropdown/Select
- **Required**: No
- **Placeholder**: None
- **Default Value**: "Nominee"
- **Options**:
  - "Winner"
  - "Nominee"
- **Validation Rules**: Must be one of predefined options
- **Help Text**: None

**Form Actions**: "Cancel" and "Save Award" buttons

#### Awards List
- **Field Type**: List of awards
- **UI Behavior**:
  - Award icon (yellow trophy)
  - Displays: Award Name (Year)
  - Shows: Category - Status (Winner in green)
  - Hover to reveal Edit and Delete buttons
  - Click Edit to expand form inline

---

## Tab 6: Trivia

**Tab Label**: "Trivia"
**Component**: `MovieTriviaForm`
**File**: `components/admin/movies/forms/movie-trivia-form.tsx`

### Section 6.1: Movie Trivia Card

**Card Title**: "Movie Trivia"
**Card Description**: "Manage interesting facts and trivia related to the movie."
**Action Button**: "Add Trivia Item" (bottom, full-width, only shown when not editing)

#### Add/Edit Trivia Form (Expandable)

##### Field 6.1.1: Question
- **Field Label**: "Question"
- **Field ID**: `trivia-question`
- **Field Type**: Textarea
- **Required**: Yes
- **Placeholder**: "e.g., What was the original title of the movie?"
- **Default Value**: Empty string
- **Rows**: 2
- **Validation Rules**: None
- **Help Text**: None

##### Field 6.1.2: Category
- **Field Label**: "Category"
- **Field ID**: `trivia-category`
- **Field Type**: Dropdown/Select
- **Required**: Yes
- **Placeholder**: "Select category"
- **Default Value**: "Behind the Scenes"
- **Options**:
  - "Behind the Scenes"
  - "Continuity Error"
  - "Cameo"
  - "Production Detail"
  - "Cultural Reference"
  - "Goofs"
- **Validation Rules**: Must be one of predefined categories
- **Help Text**: None

##### Field 6.1.3: Answer
- **Field Label**: "Answer"
- **Field ID**: `trivia-answer`
- **Field Type**: Textarea
- **Required**: Yes
- **Placeholder**: "The answer to the trivia question."
- **Default Value**: Empty string
- **Rows**: 2
- **Validation Rules**: None
- **Help Text**: None

##### Field 6.1.4: Explanation
- **Field Label**: "Explanation (Optional)"
- **Field ID**: `trivia-explanation`
- **Field Type**: Textarea
- **Required**: No
- **Placeholder**: "Additional context or explanation for the answer."
- **Default Value**: Empty string
- **Rows**: 3
- **Validation Rules**: None
- **Help Text**: None

**Form Actions**: "Cancel" and "Save Trivia Item" buttons

#### Trivia Items List
- **Field Type**: List of trivia items
- **UI Behavior**:
  - Question mark icon (blue)
  - Displays: Question text
  - Shows: Category label
  - Answer section with reveal/hide toggle
  - Click eye icon to reveal answer
  - Answer shown in blue background box with explanation
  - Hover to reveal Show/Hide Answer, Edit, and Delete buttons

---

## Tab 7: Timeline

**Tab Label**: "Timeline"
**Component**: `MovieTimelineForm`
**File**: `components/admin/movies/forms/movie-timeline-form.tsx`

### Section 7.1: Movie Timeline Card

**Card Title**: "Movie Timeline"
**Card Description**: "Manage key events in the movie's history (production, release, awards, etc.)."
**Action Button**: "Add Timeline Event" (bottom, full-width, only shown when not editing)

#### Add/Edit Timeline Event Form (Expandable)

##### Field 7.1.1: Event Title
- **Field Label**: "Event Title"
- **Field ID**: `event-title`
- **Field Type**: Text input
- **Required**: Yes
- **Placeholder**: "e.g., World Premiere in London"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None

##### Field 7.1.2: Description
- **Field Label**: "Description"
- **Field ID**: `event-description`
- **Field Type**: Textarea
- **Required**: No
- **Placeholder**: "Details about the event."
- **Default Value**: Empty string
- **Rows**: 3
- **Validation Rules**: None
- **Help Text**: None

##### Field 7.1.3: Date
- **Field Label**: "Date"
- **Field ID**: `event-date`
- **Field Type**: Date picker (HTML5 date input)
- **Required**: Yes
- **Placeholder**: None
- **Default Value**: Current date (YYYY-MM-DD)
- **Validation Rules**: HTML5 date format
- **Help Text**: None

##### Field 7.1.4: Category
- **Field Label**: "Category"
- **Field ID**: `event-category`
- **Field Type**: Dropdown/Select
- **Required**: Yes
- **Placeholder**: "Select category"
- **Default Value**: "Production Start"
- **Options**:
  - "Production Start"
  - "Casting Announcement"
  - "Trailer Release"
  - "Premiere"
  - "Box Office Milestone"
  - "Award Win"
  - "Controversy"
- **Validation Rules**: Must be one of predefined categories
- **Help Text**: None

##### Field 7.1.5: Media URL
- **Field Label**: "Media URL (Optional)"
- **Field ID**: `event-mediaUrl`
- **Field Type**: Text input
- **Required**: No
- **Placeholder**: "https://example.com/image.jpg"
- **Default Value**: Empty string
- **Validation Rules**: None
- **Help Text**: None
- **UI Behavior**: Shows image preview below if URL is provided

**Form Actions**: "Cancel" and "Save Event" buttons

#### Timeline Events List
- **Field Type**: List of timeline events (sorted by date, newest first)
- **UI Behavior**:
  - Calendar icon (indigo)
  - Displays: Event title and date (formatted)
  - Shows: Category label
  - Description text (if provided)
  - Media thumbnail (if URL provided)
  - Hover to reveal Edit and Delete buttons

---

## Special UI Elements & Behaviors

### 1. Form-Level Actions

**Location**: Top-right of page (outside tabs)

#### Save Button
- **Label**: "Save Movie" or "Update Movie"
- **Icon**: Save icon (when not saving), Loader2 icon (when saving)
- **Behavior**:
  - Saves all form data across all tabs
  - Shows loading state during save
  - Disabled when no changes detected
  - Triggers validation for required fields

#### Back Button
- **Label**: Arrow left icon
- **Location**: Top-left
- **Behavior**: Returns to `/admin/movies` list

### 2. Dynamic Field Groups

#### Cast Members
- **Add**: Click "Add Cast Member" button
- **Reorder**: Drag using grip handle
- **Remove**: Click X button on hover
- **Duplicate Prevention**: Case-insensitive name check

#### Crew Members
- **Add**: Click "Add Crew Member" button
- **Remove**: Click X button on hover
- **Duplicate Prevention**: Case-insensitive name check

#### Gallery Images
- **Add**: Upload file or enter URL
- **Reorder**: Drag images in grid
- **Remove**: Click X button on hover

#### Streaming Links
- **Add**: Click "Add Streaming Link" button
- **Verify**: Click "Verify" button (changes status to verified)
- **Remove**: Click X button on hover

#### Awards
- **Add**: Click "Add Award/Nomination" button
- **Edit**: Click Edit icon (expands form inline)
- **Remove**: Click Delete icon

#### Trivia Items
- **Add**: Click "Add Trivia Item" button
- **Edit**: Click Edit icon (expands form inline)
- **Remove**: Click Delete icon
- **Reveal Answer**: Click eye icon to show/hide answer

#### Timeline Events
- **Add**: Click "Add Timeline Event" button
- **Edit**: Click Edit icon (expands form inline)
- **Remove**: Click Delete icon
- **Auto-Sort**: Events automatically sorted by date (newest first)

### 3. Auto-complete & Search

#### Actor/Crew Search
- **Trigger**: Type in name field
- **Debounce**: 300ms
- **API Endpoint**: `/api/v1/search?q={query}&types=people&limit=10`
- **Loading State**: Spinner icon shown during search
- **Results Display**: Popover dropdown with avatar and name
- **Fallback**: Can manually type name if not found

#### Award Search
- **Trigger**: Type in award name field
- **Source**: Local predefined award pool
- **Results Display**: Dropdown list below input
- **Auto-fill**: Clicking suggestion fills name and default category

### 4. Image Previews

#### Poster Preview
- **Location**: Left side of poster upload section
- **Aspect Ratio**: 2:3 (portrait)
- **Fallback**: Image icon if no poster

#### Backdrop Preview
- **Location**: Above backdrop upload section
- **Aspect Ratio**: 16:9 (landscape)
- **Fallback**: File image icon if no backdrop

#### Gallery Preview
- **Location**: Grid below gallery controls
- **Layout**: 2 columns (mobile), 4 columns (desktop)
- **Aspect Ratio**: 16:9 per image
- **Hover Effect**: Dark overlay with grip icon

#### Timeline Media Preview
- **Location**: In event form (if URL provided)
- **Size**: Full width, 128px height
- **Object Fit**: Contain

### 5. Validation & Error Handling

#### Required Field Validation
- **Trigger**: On form submit
- **Fields**: Title, Release Date, Status (Basic Info tab)
- **Behavior**: Shows toast notification if required fields missing

#### Award Year Validation
- **Range**: 1900 to current year + 5
- **Error**: Toast notification with specific range message

#### Trivia Validation
- **Required**: Question, Category, Answer
- **Error**: Toast notification if any required field missing

#### Timeline Validation
- **Required**: Title, Date, Category
- **Error**: Toast notification if any required field missing

### 6. Animations

#### Tab Content
- **Type**: Fade in
- **Duration**: 300ms
- **Easing**: Default

#### Expandable Forms
- **Type**: Height expand with opacity fade
- **Initial**: opacity: 0, height: 0
- **Animate**: opacity: 1, height: auto
- **Exit**: opacity: 0, height: 0

#### List Items
- **Type**: Fade in with slide up
- **Initial**: opacity: 0, y: 10
- **Animate**: opacity: 1, y: 0

#### Bulk Action Toolbar
- **Type**: Slide up from bottom
- **Initial**: y: 100, opacity: 0
- **Animate**: y: 0, opacity: 1
- **Exit**: y: 100, opacity: 0
- **Spring**: stiffness: 300, damping: 30

---

## Data Flow & State Management

### Form State
- **Parent Component**: `app/admin/movies/[id]/page.tsx`
- **State Management**: React useState hooks
- **Change Detection**: `hasChanges` flag set on any field change
- **Save Trigger**: Single "Save Movie" button saves all tabs

### Field Updates
- **Method**: `updateMovieField(fieldName, value)`
- **Callback**: `onChanges()` marks form as dirty
- **Validation**: Performed on save, not on field change

### Data Persistence
- **New Movie**: `params.id === "new"` → Creates new movie
- **Edit Movie**: `params.id !== "new"` → Updates existing movie
- **API**: Currently uses mock data (`addMockMovie`, `updateMockMovie`)
- **Future**: Will integrate with backend API

---

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Follows visual order
- **Focus Management**: Proper focus states on all interactive elements
- **Enter Key**: Submits forms in expandable sections

### Screen Reader Support
- **Labels**: All form fields have associated labels
- **ARIA Labels**: Back button has `aria-label="Back to movies list"`
- **Semantic HTML**: Proper use of form elements

### Visual Indicators
- **Required Fields**: Implied by validation, not visually marked
- **Error States**: Toast notifications for validation errors
- **Loading States**: Spinner icons during async operations
- **Hover States**: Visual feedback on interactive elements

---

## Technical Implementation Details

### Component Architecture
- **Parent**: `app/admin/movies/[id]/page.tsx` (560 lines)
- **Child Forms**: 7 separate form components
- **Shared Types**: `components/admin/movies/types.ts`
- **UI Components**: shadcn/ui components

### Dependencies
- **React**: useState, useEffect hooks
- **Next.js**: useParams, useRouter, Link
- **Framer Motion**: Animations and reordering
- **Lucide React**: Icons
- **shadcn/ui**: Card, Input, Button, Select, etc.

### File Structure
```
app/admin/movies/[id]/page.tsx (main page)
components/admin/movies/forms/
  ├── movie-basic-info-form.tsx (245 lines)
  ├── movie-media-form.tsx (363 lines)
  ├── movie-cast-crew-form.tsx (540 lines)
  ├── movie-streaming-form.tsx (310 lines)
  ├── movie-awards-form.tsx (277 lines)
  ├── movie-trivia-form.tsx (258 lines)
  └── movie-timeline-form.tsx (256 lines)
components/admin/movies/types.ts (type definitions)
```

---

## Summary Statistics

### Field Count by Tab
1. **Basic Info**: 10 fields
2. **Media**: 6 fields (+ dynamic gallery)
3. **Cast & Crew**: 7 fields (3 cast + 4 crew)
4. **Streaming**: 8 fields (6 per link + 2 settings)
5. **Awards**: 4 fields per award
6. **Trivia**: 4 fields per item
7. **Timeline**: 5 fields per event

### Total Unique Fields: 44 base fields + dynamic lists

### Field Types Distribution
- **Text Input**: 18 fields
- **Textarea**: 7 fields
- **Number Input**: 3 fields
- **Date Input**: 2 fields
- **Dropdown/Select**: 11 fields
- **Multi-Select**: 2 fields (Genres, Languages)
- **File Upload**: 3 fields
- **Switch/Toggle**: 2 fields
- **Searchable Input**: 3 fields

### Required vs Optional
- **Required**: 3 base fields + conditional required in dynamic forms
- **Optional**: 41+ fields

---

**End of Documentation**

*Generated: 2025-10-30*
*Version: 1.0*
*Last Updated: Initial creation*

