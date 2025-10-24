# 🎨 SIDDU PULSE FEED PAGE - VISUAL SPECIFICATION

---

## **PAGE LAYOUT**

### **Desktop Layout (1024px+)**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER (Global Navigation - 64px height)                                │
├────────────┬──────────────────────────────────┬──────────────────────────┤
│            │                                  │                          │
│  LEFT      │        MAIN FEED                 │    RIGHT SIDEBAR         │
│  SIDEBAR   │                                  │                          │
│  240px     │        Flex-grow                 │    320px                 │
│  fixed     │        Max-width: 680px          │    fixed                 │
│            │                                  │                          │
│  ┌──────┐  │  ┌────────────────────────────┐  │  ┌────────────────────┐  │
│  │User  │  │  │  PULSE COMPOSER            │  │  │ 🔥 Trending Now   │  │
│  │Card  │  │  │  [Textarea]                │  │  │ #1 #Shawshank     │  │
│  └──────┘  │  │  [Media][Emoji][Tag][Post] │  │  │ #2 #IPL2024       │  │
│            │  └────────────────────────────┘  │  └────────────────────┘  │
│  ┌──────┐  │                                  │                          │
│  │Quick │  │  ┌────────────────────────────┐  │  ┌────────────────────┐  │
│  │Nav   │  │  │ FEED TABS (Sticky)         │  │  │ 👥 Who to Follow  │  │
│  │      │  │  │ [For You][Following]...    │  │  │ [@user1] [Follow] │  │
│  └──────┘  │  └────────────────────────────┘  │  │ [@user2] [Follow] │  │
│            │                                  │  └────────────────────┘  │
│  ┌──────┐  │  ┌────────────────────────────┐  │                          │
│  │Stats │  │  │ PULSE CARD                 │  │  ┌────────────────────┐  │
│  │      │  │  │ [Avatar][Name][@user][2h]  │  │  │ 🎬 Trending Movies│  │
│  └──────┘  │  │ ─────────────────────────  │  │  │ [Poster] Title    │  │
│            │  │ Post content text...       │  │  │ [Poster] Title    │  │
│            │  │ [Image Grid]               │  │  └────────────────────┘  │
│            │  │ [Tagged Movie Card]        │  │                          │
│            │  │ ─────────────────────────  │  │  ┌────────────────────┐  │
│            │  │ [❤️234][💬45][🔄12][🔖]   │  │  │ 🏏 Live Cricket   │  │
│            │  └────────────────────────────┘  │  │ IND vs AUS • Live │  │
│            │                                  │  │ IND: 245/4        │  │
│            │  ┌────────────────────────────┐  │  └────────────────────┘  │
│            │  │ PULSE CARD                 │  │                          │
│            │  │ ...                        │  │                          │
│            │  └────────────────────────────┘  │                          │
│            │                                  │                          │
│            │  [Infinite Scroll...]           │                          │
│            │                                  │                          │
└────────────┴──────────────────────────────────┴──────────────────────────┘
```

### **Mobile Layout (0-767px)**

```
┌──────────────────────────┐
│  HEADER (64px)           │
├──────────────────────────┤
│  FEED TABS (Sticky 48px) │
│  [For You][Following]... │
├──────────────────────────┤
│                          │
│  PULSE CARD              │
│  [Avatar][Name][@][2h]   │
│  ──────────────────────  │
│  Post content...         │
│  [Image]                 │
│  ──────────────────────  │
│  [❤️234][💬45][🔄12]    │
│                          │
├──────────────────────────┤
│  PULSE CARD              │
│  ...                     │
├──────────────────────────┤
│                          │
│  [Infinite Scroll...]    │
│                          │
├──────────────────────────┤
│  BOTTOM NAV (56px)       │
│  [🏠][🔍][➕][🔔][👤]   │
└──────────────────────────┘

[Composer FAB] (Bottom-right, 64px circle)
```

---

## **COMPONENT VISUAL SPECIFICATIONS**

### **1. PULSE COMPOSER**

**Collapsed State (Default):**
```
┌────────────────────────────────────────────────────────────┐
│  [Avatar]  What's happening in the Siddu Verse?            │
│                                                             │
│  [🖼️ Media] [😊 Emoji] [🏷️ Tag] [Post] (disabled/gray)   │
└────────────────────────────────────────────────────────────┘
```

**Expanded State (On Focus):**
```
┌────────────────────────────────────────────────────────────┐
│  [Avatar]  ┌─────────────────────────────────────────────┐ │
│            │ What's happening in the Siddu Verse?        │ │
│            │                                             │ │
│            │ [User typing here...]                       │ │
│            │                                             │ │
│            │                                             │ │
│            │                                             │ │
│            └─────────────────────────────────────────────┘ │
│                                                             │
│  [Media Preview Grid - if uploaded]                        │
│  ┌──────┐ ┌──────┐                                         │
│  │ IMG1 │ │ IMG2 │  [Each with X button]                   │
│  └──────┘ └──────┘                                         │
│                                                             │
│  [Tagged Items - if added]                                 │
│  [🎬 The Shawshank Redemption (1994) ✕]                    │
│                                                             │
│  ──────────────────────────────────────────────────────────│
│  [🖼️ Media] [😊 Emoji] [🏷️ Tag]    [234/500] [Post]      │
│                                      ↑         ↑            │
│                                   Counter   Button          │
│                                   (Green)   (Cyan)          │
└────────────────────────────────────────────────────────────┘
```

**Character Counter Colors:**
- 0-400 chars: `#10B981` (Green)
- 401-480 chars: `#F59E0B` (Yellow/Warning)
- 481-500 chars: `#EF4444` (Red/Error)
- 500+ chars: `#EF4444` (Red) + Post button disabled

**Post Button States:**
- Disabled: `bg-[#3A3A3A]`, `cursor-not-allowed`, `opacity-50`
- Enabled: `bg-gradient-to-r from-[#00BFFF] to-[#0080FF]`, `cursor-pointer`
- Loading: Spinner + "Posting..." text
- Success: Checkmark animation (300ms), then reset

---

### **2. PULSE CARD**

**Standard Card Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  [Avatar]  John Doe  @john_doe ✓  •  2h ago        [•••]    │
│   64px     (Bold)    (Muted)   (Badge) (Muted)    (Menu)    │
│                                                               │
│  ────────────────────────────────────────────────────────────│
│                                                               │
│  This is the post content. It can contain @mentions,         │
│  #hashtags (in cyan), and regular text. Line breaks are      │
│  preserved. Long posts get truncated with "Read More"...     │
│                                                               │
│  [MEDIA GRID - if present]                                   │
│  ┌─────────────────┐ ┌─────────────────┐                    │
│  │                 │ │                 │  (2 images)         │
│  │     Image 1     │ │     Image 2     │                    │
│  │                 │ │                 │                    │
│  └─────────────────┘ └─────────────────┘                    │
│                                                               │
│  [TAGGED ITEM CARD - if present]                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [Poster]  The Shawshank Redemption                     │  │
│  │  120px    ⭐ 9.3 • 1994 • Drama                        │  │
│  │           Click to view movie details →                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ────────────────────────────────────────────────────────────│
│                                                               │
│  [❤️ 234]  [💬 45]  [🔄 12]  [🔖]                           │
│   Like     Comment   Echo    Bookmark                        │
│  (Red if   (Cyan if  (Cyan   (Gold if                        │
│   liked)   expanded) if echo) bookmarked)                    │
│                                                               │
│  [COMMENT SECTION - if expanded]                             │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ [Avatar] Alice  @alice  •  1h ago                    │    │
│  │ Great movie! Loved every minute of it.               │    │
│  │ [❤️ 12]                                              │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │ [Avatar] Bob  @bob  •  30m ago                       │    │
│  │ Agreed! The ending was perfect.                      │    │
│  │ [❤️ 5]                                               │    │
│  └──────────────────────────────────────────────────────┘    │
│  [View all 45 comments]                                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ [Avatar] Write a comment...                          │    │
│  │          [Post]                                      │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

**Media Grid Layouts:**

**1 Image:**
```
┌─────────────────────────────────┐
│                                 │
│         Full Width Image        │
│         (16:9 or original)      │
│                                 │
└─────────────────────────────────┘
```

**2 Images:**
```
┌───────────────┐ ┌───────────────┐
│               │ │               │
│   Image 1     │ │   Image 2     │
│   (1:1)       │ │   (1:1)       │
│               │ │               │
└───────────────┘ └───────────────┘
```

**3 Images:**
```
┌───────────────┐ ┌──────────┐
│               │ │ Image 2  │
│               │ │  (1:1)   │
│   Image 1     │ ├──────────┤
│   (Large)     │ │ Image 3  │
│   (2:3)       │ │  (1:1)   │
│               │ │          │
└───────────────┘ └──────────┘
```

**4 Images:**
```
┌──────────┐ ┌──────────┐
│ Image 1  │ │ Image 2  │
│  (1:1)   │ │  (1:1)   │
├──────────┤ ├──────────┤
│ Image 3  │ │ Image 4  │
│  (1:1)   │ │  (1:1)   │
└──────────┘ └──────────┘
```

**Video:**
```
┌─────────────────────────────────┐
│                                 │
│      [▶️ Play Button]           │
│      Video Thumbnail            │
│                                 │
│      [2:34] (Duration badge)    │
└─────────────────────────────────┘
```

---

### **3. FEED TABS (Sticky)**

```
┌────────────────────────────────────────────────────────┐
│  For You    Following    Movies    Cricket             │
│  ────────                                              │
│  (Active: Cyan underline, 3px, slides on tab change)   │
└────────────────────────────────────────────────────────┘
```

**Tab States:**
- Active: Text `#00BFFF`, underline `#00BFFF` (3px)
- Inactive: Text `#A0A0A0`
- Hover: Text `#E0E0E0`, scale 1.05

---

### **4. LEFT SIDEBAR COMPONENTS**

**User Profile Card:**
```
┌──────────────────────────────┐
│  ┌────────┐                  │
│  │        │  John Doe ✓      │
│  │ Avatar │  @john_doe       │
│  │  80px  │                  │
│  └────────┘  Movie enthusiast│
│              and cricket fan │
│                              │
│  ────────────────────────────│
│  1.2K      847      234      │
│  Followers Following Pulses  │
│                              │
│  [View Profile]              │
└──────────────────────────────┘
```

**Quick Navigation:**
```
┌──────────────────────────────┐
│  🏠  Home                     │
│  🔔  Notifications      [3]  │
│  💬  Messages           [5]  │
│  🔖  Bookmarks               │
│  👤  Profile                 │
│  ⚙️  Settings                │
└──────────────────────────────┘
```

**Quick Stats:**
```
┌──────────────────────────────┐
│  Your Activity Today         │
│  ────────────────────────────│
│  Pulses posted:         3    │
│  Likes received:       47    │
│  New followers:         5    │
└──────────────────────────────┘
```

---

### **5. RIGHT SIDEBAR COMPONENTS**

**Trending Topics:**
```
┌──────────────────────────────┐
│  🔥 Trending Now             │
│  ────────────────────────────│
│  #1  #ShawshankRedemption    │
│      12.5K pulses            │
│  ────────────────────────────│
│  #2  #IPL2024                │
│      8.3K pulses             │
│  ────────────────────────────│
│  #3  #ChristopherNolan       │
│      6.7K pulses             │
│  ────────────────────────────│
│  #4  #Oppenheimer            │
│      5.2K pulses             │
│  ────────────────────────────│
│  #5  #ViratKohli             │
│      4.1K pulses             │
└──────────────────────────────┘
```

**Who to Follow:**
```
┌──────────────────────────────┐
│  👥 Who to Follow            │
│  ────────────────────────────│
│  [Avatar] Arjun Movies ✓     │
│           @arjun_movies      │
│           Movie Critic       │
│           [Follow]           │
│  ────────────────────────────│
│  [Avatar] Priya Cricket ✓    │
│           @priya_cricket     │
│           Cricket Analyst    │
│           [Follow]           │
└──────────────────────────────┘
```

**Trending Movies:**
```
┌──────────────────────────────┐
│  🎬 Trending Movies          │
│  ────────────────────────────│
│  [Poster]  The Shawshank...  │
│   60x90    ⭐ 9.3 • 1994     │
│  ────────────────────────────│
│  [Poster]  The Dark Knight   │
│   60x90    ⭐ 9.0 • 2008     │
└──────────────────────────────┘
```

**Trending Cricket:**
```
┌──────────────────────────────┐
│  🏏 Live Cricket             │
│  ────────────────────────────│
│  🔴 IND vs AUS • Live        │
│  IND: 245/4 (45.2 overs)     │
│  AUS: Yet to bat             │
│  [Watch Live]                │
│  ────────────────────────────│
│  📅 PAK vs ENG • Upcoming    │
│  Tomorrow, 2:00 PM IST       │
│  [Set Reminder]              │
└──────────────────────────────┘
```

---

## **COLOR PALETTE (Siddu Design System)**

### **Background Colors:**
- Page Background: `#1A1A1A`
- Card Background: `#282828`
- Hover Background: `#3A3A3A`
- Border: `#3A3A3A`

### **Text Colors:**
- Primary Text: `#E0E0E0`
- Muted Text: `#A0A0A0`
- Link/Hashtag: `#00BFFF` (Cyan)
- Mention: `#00BFFF` (Cyan)

### **Action Colors:**
- Like (Active): `#EF4444` (Red)
- Comment (Active): `#00BFFF` (Cyan)
- Echo (Active): `#00BFFF` (Cyan)
- Bookmark (Active): `#FFD700` (Gold)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Orange)
- Error: `#EF4444` (Red)

### **Gradients:**
- Primary Button: `linear-gradient(to right, #00BFFF, #0080FF)`
- Verified Badge: `linear-gradient(to right, #00BFFF, #0080FF)`

---

## **TYPOGRAPHY**

### **Font Families:**
- Headings: `Inter, sans-serif`
- Body: `DM Sans, sans-serif`
- Monospace: `JetBrains Mono, monospace` (for code/timestamps)

### **Font Sizes (Desktop):**
- Page Title: `32px` (2rem)
- Section Heading: `24px` (1.5rem)
- Card Heading: `20px` (1.25rem)
- Body Text: `16px` (1rem)
- Small Text: `14px` (0.875rem)
- Tiny Text: `12px` (0.75rem)

### **Font Weights:**
- Bold: `700` (headings, names)
- Semibold: `600` (subheadings)
- Regular: `400` (body text)
- Light: `300` (muted text)

---

## **SPACING**

### **Section Gaps:**
- Desktop: `2rem` (32px)
- Tablet: `1.5rem` (24px)
- Mobile: `1rem` (16px)

### **Card Padding:**
- Desktop: `1.5rem` (24px)
- Tablet: `1.25rem` (20px)
- Mobile: `1rem` (16px)

### **Element Gaps:**
- Large: `1.5rem` (24px)
- Medium: `1rem` (16px)
- Small: `0.5rem` (8px)
- Tiny: `0.25rem` (4px)

---

## **BORDER RADIUS**

- Cards: `12px`
- Buttons: `8px`
- Inputs: `8px`
- Avatars: `50%` (circle)
- Images: `8px`
- Tags/Chips: `16px` (pill shape)

---

## **SHADOWS**

### **Card Shadow:**
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
```

### **Hover Shadow:**
```css
box-shadow: 0 4px 16px rgba(0, 191, 255, 0.2);
```

### **Active Shadow:**
```css
box-shadow: 0 0 20px rgba(0, 191, 255, 0.4);
```

---

## **ACCESSIBILITY**

### **Focus States:**
- All interactive elements: `outline: 2px solid #00BFFF`
- Offset: `2px`

### **Touch Targets (Mobile):**
- Minimum size: `44px × 44px`
- Spacing between targets: `8px`

### **ARIA Labels:**
- All buttons have descriptive labels
- All images have alt text
- All form inputs have labels

---

**VISUAL SPECIFICATION COMPLETE - READY FOR IMPLEMENTATION**

