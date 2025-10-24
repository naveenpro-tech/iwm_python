# USER PROFILE ENHANCEMENT - VISUAL SPECIFICATION

## 🎨 DESIGN OVERVIEW

This document provides detailed visual specifications for the enhanced user profile page, including ASCII layouts, component designs, and interaction patterns.

---

## 📱 PROFILE NAVIGATION (Enhanced)

### **Desktop Layout (> 1024px):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Overview  │  Reviews (127)  │  Watchlist (43)  │  Favorites (68)  │        │
│            │                 │                  │                  │        │
│  Collections (12)  │  History  │  Settings                                  │
│  ═══════════                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Mobile Layout (< 768px):**
```
┌──────────────────────────────────────────────────────────────┐
│ ← Overview  Reviews(127)  Watchlist(43)  Favorites(68) →    │
│   Collections(12)  History  Settings                         │
│   ═══════════                                                │
└──────────────────────────────────────────────────────────────┘
```

**Visual Details:**
- Active tab: Cyan underline (`#00BFFF`), white text (`#E0E0E0`)
- Inactive tabs: Gray text (`#A0A0A0`), hover → white
- Count badges: Cyan background for active, dark gray for inactive
- Horizontal scroll on mobile with snap points
- Smooth underline animation (300ms ease-in-out)

---

## 🎬 COLLECTIONS TAB - MAIN VIEW

### **Desktop Layout (3-column grid):**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  My Collections                                    [+ Create Collection]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │ ┌──┬──┐      │  │ ┌──┬──┐      │  │ ┌──┬──┐      │                     │
│  │ │🎬│🎬│      │  │ │🎬│🎬│      │  │ │🎬│🎬│      │                     │
│  │ ├──┼──┤      │  │ ├──┼──┤      │  │ ├──┼──┤      │                     │
│  │ │🎬│🎬│      │  │ │🎬│🎬│      │  │ │🎬│🎬│      │                     │
│  │ └──┴──┘      │  │ └──┴──┘      │  │ └──┴──┘      │                     │
│  │              │  │              │  │              │                     │
│  │ Nolan Films  │  │ 90s Classics │  │ Sci-Fi Gems  │                     │
│  │ 12 movies    │  │ 24 movies    │  │ 18 movies    │                     │
│  │ 🔒 Private   │  │ 🌐 Public    │  │ 🌐 Public    │                     │
│  │ [Edit][Del]  │  │ [Edit][Del]  │  │ [Edit][Del]  │                     │
│  └──────────────┘  └──────────────┘  └──────────────┘                     │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │ ┌──┬──┐      │  │ ┌──┬──┐      │  │ ┌──┬──┐      │                     │
│  │ │🎬│🎬│      │  │ │🎬│🎬│      │  │ │🎬│🎬│      │                     │
│  │ ├──┼──┤      │  │ ├──┼──┤      │  │ ├──┼──┤      │                     │
│  │ │🎬│🎬│      │  │ │🎬│🎬│      │  │ │🎬│🎬│      │                     │
│  │ └──┴──┘      │  │ └──┴──┘      │  │ └──┴──┘      │                     │
│  │              │  │              │  │              │                     │
│  │ Horror Fest  │  │ Anime Movies │  │ Award Winners│                     │
│  │ 8 movies     │  │ 15 movies    │  │ 32 movies    │                     │
│  │ 🔒 Private   │  │ 🌐 Public    │  │ 🌐 Public    │                     │
│  │ [Edit][Del]  │  │ [Edit][Del]  │  │ [Edit][Del]  │                     │
│  └──────────────┘  └──────────────┘  └──────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **Empty State:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                             │
│                              📚                                             │
│                                                                             │
│                    No Collections Yet                                       │
│                                                                             │
│         Create your first collection to organize your favorite movies      │
│                                                                             │
│                    [+ Create Your First Collection]                        │
│                                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Visual Details:**
- Collection cards: `bg-[#282828]`, `border-[#3A3A3A]`
- 4-poster collage: 2x2 grid of movie posters
- Hover: Border changes to cyan, slight lift (y: -5px)
- Privacy icon: Lock (private) or Globe (public)
- Edit button: Cyan text, hover → cyan background
- Delete button: Red text, hover → red background
- Create button: Cyan background, white text, prominent

---

## 🎬 CREATE COLLECTION MODAL

### **Modal Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Create New Collection                                              [X]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Collection Title *                                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ My Awesome Collection                                                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Description                                                                │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ A curated list of my favorite movies from the 90s...                  │ │
│  │                                                                        │ │
│  │                                                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Privacy                                                                    │
│  ○ Public    ● Private                                                      │
│                                                                             │
│  Add Movies (Optional)                                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 🔍 Search movies...                                                   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Selected Movies (0)                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ No movies selected yet                                                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                          [Cancel]  [Create Collection]     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Visual Details:**
- Modal: `bg-[#282828]`, centered, max-width 600px
- Backdrop: `bg-black/60`, blur effect
- Entrance animation: Fade in + scale (0.95 → 1), 300ms
- Form fields: `bg-[#1A1A1A]`, `border-[#3A3A3A]`
- Create button: Cyan background, disabled when title empty
- Cancel button: Transparent, gray border

---

## 📋 ENHANCED WATCHLIST TAB

### **Desktop Layout with Filters:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  [Grid] [List]  │
│  │ 🔍 Search...     │  │ Sort: Recent │  │ Status: All  │                  │
│  └──────────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                             │
│  Priority: [All] [High] [Medium] [Low]                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │          │  │          │  │          │  │          │  │          │    │
│  │  🎬      │  │  🎬      │  │  🎬      │  │  🎬      │  │  🎬      │    │
│  │          │  │          │  │          │  │          │  │          │    │
│  │ [X][✓][+]│  │ [X][✓][+]│  │ [X][✓][+]│  │ [X][✓][+]│  │ [X][✓][+]│    │
│  │          │  │          │  │          │  │          │  │          │    │
│  │ Dune 2   │  │ Furiosa  │  │ Fall Guy │  │ Kingdom  │  │ Challeng │    │
│  │ 2024     │  │ 2024     │  │ 2024     │  │ 2024     │  │ 2024     │    │
│  │ ⭐ 8.9   │  │ ⭐ 8.7   │  │ ⭐ 8.5   │  │ ⭐ 8.3   │  │ ⭐ 8.7   │    │
│  │ 🔴 HIGH  │  │ 🟡 MED   │  │ 🟢 LOW   │  │ 🟡 MED   │  │ 🔴 HIGH  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Quick Action Buttons:**
- `[X]` Remove from watchlist - Red, hover → red background
- `[✓]` Mark as watched - Green, hover → green background
- `[+]` Add to collection - Cyan, hover → cyan background

**Priority Badges:**
- High: Red background (`#EF4444`)
- Medium: Orange background (`#F59E0B`)
- Low: Green background (`#10B981`)

---

## ⭐ ENHANCED FAVORITES TAB

### **Desktop Layout with Ratings:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  [Grid] [List]  │
│  │ 🔍 Search...     │  │ Sort: Rating │  │ Genre: All   │                  │
│  └──────────────────┘  └──────────────┘  └──────────────┘                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │          │  │          │  │          │  │          │  │          │    │
│  │  🎬      │  │  🎬      │  │  🎬      │  │  🎬      │  │  🎬      │    │
│  │          │  │          │  │          │  │          │  │          │    │
│  │ ★★★★★    │  │ ★★★★★    │  │ ★★★★☆    │  │ ★★★★☆    │  │ ★★★★☆    │    │
│  │ [❤][+]   │  │ [❤][+]   │  │ [❤][+]   │  │ [❤][+]   │  │ [❤][+]   │    │
│  │          │  │          │  │          │  │          │  │          │    │
│  │ Shawshank│  │ Godfather│  │ Dark Kni │  │ Parasite │  │ Inceptio │    │
│  │ 1994     │  │ 1972     │  │ 2008     │  │ 2019     │  │ 2010     │    │
│  │ ⭐ 9.8   │  │ ⭐ 9.7   │  │ ⭐ 9.5   │  │ ⭐ 9.6   │  │ ⭐ 9.3   │    │
│  │ 📝 Review│  │ 📝 Review│  │          │  │ 📝 Review│  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Rating Display:**
- User's personal rating: 5 gold stars at top of card
- Filled stars: `#FFD700` (gold)
- Empty stars: `#3A3A3A` (dark gray)
- Siddu score: Below title with star icon

**Quick Action Buttons:**
- `[❤]` Remove from favorites - Red heart, hover → filled
- `[+]` Add to collection - Cyan, hover → cyan background
- `[📝]` View/Edit review - Only shows if review exists

---

## 🎨 COLOR PALETTE

### **Primary Colors:**
```
Background:      #1A1A1A  ████████
Card Background: #282828  ████████
Border:          #3A3A3A  ████████
Text Primary:    #E0E0E0  ████████
Text Muted:      #A0A0A0  ████████
```

### **Accent Colors:**
```
Cyan (Primary):  #00BFFF  ████████
Gold (Rating):   #FFD700  ████████
Green (Success): #10B981  ████████
Orange (Warning):#F59E0B  ████████
Red (Error):     #EF4444  ████████
```

---

## 📐 SPACING & SIZING

### **Grid Gaps:**
- Mobile (1 col): `gap-4` (1rem)
- Tablet (2 col): `gap-4` (1rem)
- Desktop (3-4 col): `gap-6` (1.5rem)

### **Card Dimensions:**
- Movie poster aspect ratio: `2:3`
- Collection card aspect ratio: `4:3`
- Minimum card width: `180px`
- Maximum card width: `280px`

### **Modal Dimensions:**
- Max width: `600px`
- Padding: `p-6` (1.5rem)
- Form field height: `h-10` (2.5rem)
- Textarea height: `h-24` (6rem)

---

## ⚡ INTERACTION STATES

### **Button States:**
```
Default:  bg-[#00BFFF] text-white
Hover:    bg-[#00BFFF]/90 scale-1.02
Active:   bg-[#00BFFF]/80 scale-0.98
Disabled: bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed
```

### **Card States:**
```
Default:  border-[#3A3A3A]
Hover:    border-[#00BFFF] y: -5px shadow-xl
Active:   border-[#00BFFF] y: 0px
```

### **Input States:**
```
Default:  border-[#3A3A3A] bg-[#1A1A1A]
Focus:    border-[#00BFFF] ring-2 ring-[#00BFFF]/20
Error:    border-[#EF4444] ring-2 ring-[#EF4444]/20
```

---

## 🎬 ANIMATION SPECIFICATIONS

### **Page Transitions:**
```typescript
// Tab switch animation
tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
}
```

### **Grid Animations:**
```typescript
// Stagger children animation
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}
```

### **Modal Animations:**
```typescript
// Modal entrance/exit
modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
}

backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}
```

### **Quick Action Buttons:**
```typescript
// Remove button (X)
removeVariants = {
  hover: { scale: 1.1, rotate: 90, transition: { duration: 0.2 } }
}

// Mark watched button (✓)
checkVariants = {
  hover: { scale: 1.2, transition: { duration: 0.2 } },
  tap: { scale: 0.9 }
}

// Add to collection button (+)
addVariants = {
  hover: { scale: 1.1, rotate: 180, transition: { duration: 0.3 } }
}
```

---

## 📱 RESPONSIVE LAYOUTS

### **Mobile (< 768px):**
- 1 column grid for collections
- 2 column grid for movies
- Stacked filters (vertical)
- Bottom sheet modals
- Swipe gestures for quick actions

### **Tablet (768px - 1024px):**
- 2 column grid for collections
- 3 column grid for movies
- Horizontal filters
- Centered modals

### **Desktop (> 1024px):**
- 3-4 column grid for collections
- 5 column grid for movies
- Horizontal filters with more space
- Centered modals with max-width

---

## ✅ ACCESSIBILITY SPECIFICATIONS

### **Keyboard Navigation:**
- Tab order: Filters → View toggle → Grid items → Quick actions
- Enter/Space: Activate buttons
- Escape: Close modals
- Arrow keys: Navigate grid (optional enhancement)

### **Screen Reader Support:**
- All images have alt text
- Buttons have aria-labels
- Form fields have labels
- Modal has aria-modal="true"
- Focus trap in modals

### **Color Contrast:**
- Text on background: 7:1 (AAA)
- Buttons: 4.5:1 (AA)
- Icons: 3:1 (AA for large)

---

**Visual specification complete! Ready for implementation! 🎨**

