# 🎨 MOVIE REVIEWS PAGE - VISUAL SPECIFICATION

**Date:** 2025-10-23  
**Purpose:** Detailed visual mockup and design specifications

---

## 📐 **DESKTOP LAYOUT (1440px width)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STICKY HEADER (200px height)                     │
│  ┌──────┐                                                                │
│  │      │  The Shawshank Redemption (1994)                              │
│  │ 16:9 │  [← Back to Movie Details]                                    │
│  │Poster│                                                                │
│  └──────┘                                                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│              VOICE OF SIDDU VERSE SUMMARY (Animated Stagger)            │
│  ┌──────────┬──────────┬──────────┬──────────┐                         │
│  │  Siddu   │  Total   │  Rating  │Sentiment │                         │
│  │  Score   │ Reviews  │  Distrib │ Analysis │                         │
│  │  ┌───┐  │          │          │          │                         │
│  │  │8.7│  │ 1 + 12 + │ 5★ ████  │ 😊 65%   │                         │
│  │  │/10│  │   847    │ 4★ ███   │ 😐 25%   │                         │
│  │  └───┘  │          │ 3★ ██    │ 😞 10%   │                         │
│  │ Circular │ Official │ 2★ █     │          │                         │
│  │ Progress │ Critic   │ 1★ ▌     │          │                         │
│  │          │ User     │          │          │                         │
│  └──────────┴──────────┴──────────┴──────────┘                         │
│                                                                          │
│  Top Keywords: [masterpiece] [redemption] [hope] [slow] [emotional]    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    STICKY TAB BAR (becomes fixed on scroll)             │
│  ┌──────────────┬──────────────┬──────────────┐                        │
│  │ ⭐ Siddu     │ 🏆 Critic    │ 👥 User      │                        │
│  │   Review (1) │   Reviews(12)│   Reviews    │                        │
│  │ ═══════════  │              │   (847)      │                        │
│  └──────────────┴──────────────┴──────────────┘                        │
│         ↑ Active indicator (cyan glow)                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         TAB CONTENT AREA                                │
│                                                                          │
│  [Content changes based on active tab - see below for each tab]        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

                                                    ┌──────────────────┐
                                                    │  ✏️ Write Your   │
                                                    │     Review       │
                                                    │  (FAB - Floating)│
                                                    └──────────────────┘
```

---

## 📱 **TAB 1: SIDDU REVIEW (Official)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    OFFICIAL REVIEW CARD                          │  │
│  │  ┌────┐                                                          │  │
│  │  │ 👤 │  Siddu Kumar                                            │  │
│  │  └────┘  Chief Film Critic                                      │  │
│  │          Published: March 15, 2024 • 8 min read                 │  │
│  │                                                                  │  │
│  │  ⭐⭐⭐⭐⭐⭐⭐⭐⭐☆  9.0/10                                      │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────┐    │  │
│  │  │ [Featured Image - 16:9 ratio]                          │    │  │
│  │  └────────────────────────────────────────────────────────┘    │  │
│  │                                                                  │  │
│  │  ## A Timeless Masterpiece of Hope and Redemption              │  │
│  │                                                                  │  │
│  │  The Shawshank Redemption stands as a towering achievement     │  │
│  │  in cinema, a film that transcends its prison setting to       │  │
│  │  deliver a profound meditation on hope, friendship, and the     │  │
│  │  indomitable human spirit...                                    │  │
│  │                                                                  │  │
│  │  [Full rich-text content with headings, bold, italics, quotes] │  │
│  │                                                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐      │  │
│  │  │ Share: [🐦 Twitter] [📘 Facebook] [🔗 Copy Link]    │      │  │
│  │  └──────────────────────────────────────────────────────┘      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Empty State (if no official review):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          ⭐ (large icon)                                │
│                                                                          │
│                   No official Siddu review yet.                         │
│                        Check back soon!                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🏆 **TAB 2: CRITIC REVIEWS**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┬──────────────┬──────────────┐                        │
│  │ CRITIC CARD  │ CRITIC CARD  │ CRITIC CARD  │                        │
│  │ ┌────┐       │ ┌────┐       │ ┌────┐       │                        │
│  │ │ 👤 │ Arjun │ │ 👤 │ Priya │ │ 👤 │ Raj   │                        │
│  │ └────┘ ✓     │ └────┘ ✓     │ └────┘ ✓     │                        │
│  │              │              │              │                        │
│  │ ⭐⭐⭐⭐⭐   │ ⭐⭐⭐⭐☆   │ ⭐⭐⭐⭐⭐   │                        │
│  │ 9/10         │ 8/10         │ 10/10        │                        │
│  │              │              │              │                        │
│  │ "A masterful │ "Powerful    │ "The best    │                        │
│  │ exploration  │ storytelling │ film ever    │                        │
│  │ of hope..."  │ at its..."   │ made..."     │                        │
│  │              │              │              │                        │
│  │ Mar 10, 2024 │ Mar 12, 2024 │ Mar 15, 2024 │                        │
│  │              │              │              │                        │
│  │ [Read Full   │ [Read Full   │ [Read Full   │                        │
│  │  Review]     │  Review]     │  Review]     │                        │
│  └──────────────┴──────────────┴──────────────┘                        │
│                                                                          │
│  [... 9 more cards in 3-column grid ...]                               │
└─────────────────────────────────────────────────────────────────────────┘
```

**Hover Effect:**
```
┌──────────────┐
│ CRITIC CARD  │ ← Border changes from #3A3A3A to #00BFFF (cyan)
│ ┌────┐       │ ← Card scales to 1.02
│ │ 👤 │ Arjun │ ← Subtle glow effect
│ └────┘ ✓     │
│ ⭐⭐⭐⭐⭐   │
│ 9/10         │
│ "A masterful │
│ exploration  │
│ of hope..."  │
│ Mar 10, 2024 │
│ [Read Full   │
│  Review]     │
└──────────────┘
```

---

## 👥 **TAB 3: USER REVIEWS**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FILTER & SORT BAR                                                      │
│  ┌────────────┬────────────┬────────────┬────────────┬──────────────┐  │
│  │ Rating: ▼  │ Verified ▼ │ Spoilers ▼ │ Sort: ▼    │ 🔍 Search... │  │
│  │ All        │ All        │ Show All   │ Newest     │              │  │
│  └────────────┴────────────┴────────────┴────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  USER REVIEW CARD (Your Review - Highlighted)                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ┌────┐                                          [Your Review] 🏷️ │  │
│  │ │ 👤 │ john_doe ✓                                                │  │
│  │ └────┘                                                            │  │
│  │ ⭐⭐⭐⭐⭐ 5/5                                                    │  │
│  │                                                                   │  │
│  │ "This movie changed my life. The themes of hope and redemption   │  │
│  │ are beautifully woven throughout..." [Read More]                 │  │
│  │                                                                   │  │
│  │ 2 days ago • 👍 24 👎 3 • 💬 5 comments                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ↑ Cyan border (#00BFFF) to highlight user's own review               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  USER REVIEW CARD (Regular)                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ┌────┐                                                            │  │
│  │ │ 👤 │ movie_buff_2024                                           │  │
│  │ └────┘                                                            │  │
│  │ ⭐⭐⭐⭐☆ 4/5                                                    │  │
│  │                                                                   │  │
│  │ "Great film, but the pacing in the middle felt a bit slow.       │  │
│  │ Overall, a must-watch classic." [Read More]                      │  │
│  │                                                                   │  │
│  │ 1 week ago • 👍 12 👎 1 • 💬 2 comments                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  USER REVIEW CARD (With Spoiler)                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ┌────┐                                                            │  │
│  │ │ 👤 │ spoiler_alert ✓                                           │  │
│  │ └────┘                                                            │  │
│  │ ⭐⭐⭐⭐⭐ 5/5                                                    │  │
│  │                                                                   │  │
│  │ ┌────────────────────────────────────────────────────────────┐  │  │
│  │ │ ⚠️ Contains Spoilers - Click to Reveal                     │  │  │
│  │ │ [Blurred text underneath]                                   │  │  │
│  │ └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                   │  │
│  │ 3 days ago • 👍 8 👎 0 • 💬 1 comment                            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

[... 17 more review cards ...]

┌─────────────────────────────────────────────────────────────────────────┐
│                         [Loading More Reviews...]                       │
│                         ⏳ (Spinner animation)                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 **MOBILE LAYOUT (375px width)**

```
┌───────────────────────────┐
│  STICKY HEADER (100px)    │
│  ┌──┐                     │
│  │16│ Shawshank           │
│  │:9│ Redemption (1994)   │
│  └──┘ [← Back]            │
└───────────────────────────┘

┌───────────────────────────┐
│  SUMMARY (Stacked)        │
│  ┌─────────────────────┐  │
│  │ Siddu Score: 8.7/10 │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │ Total: 1+12+847     │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │ Rating Distrib      │  │
│  │ 5★ ████ 45%         │  │
│  │ 4★ ███  30%         │  │
│  └─────────────────────┘  │
│  [Keywords...]          │
└───────────────────────────┘

┌───────────────────────────┐
│  TABS (Horizontal Scroll) │
│ ⭐Siddu│🏆Critic│👥User  │
│ ══════                    │
└───────────────────────────┘

┌───────────────────────────┐
│  TAB CONTENT              │
│  (Single column)          │
│                           │
│  [Review cards stacked]   │
└───────────────────────────┘

┌───────────────────────────┐
│  ✏️ Write Your Review     │
│  (Sticky bottom, full w)  │
└───────────────────────────┘
```

---

## 🎨 **COLOR PALETTE**

```
Background:       #1A1A1A  ████████
Card Background:  #282828  ████████
Borders:          #3A3A3A  ████████
Primary (Cyan):   #00BFFF  ████████
Secondary (Gold): #FFD700  ████████
Text:             #E0E0E0  ████████
Muted Text:       #A0A0A0  ████████
Success (Green):  #10B981  ████████
Error (Red):      #EF4444  ████████
Warning (Yellow): #F59E0B  ████████
```

---

## ✨ **ANIMATION EXAMPLES**

### **Stagger Fade-In (Summary Section)**
```
Element 1 (SidduScore):    opacity: 0 → 1 (200ms) at 0ms
Element 2 (Review Count):  opacity: 0 → 1 (200ms) at 100ms
Element 3 (Rating Chart):  opacity: 0 → 1 (200ms) at 200ms
Element 4 (Sentiment):     opacity: 0 → 1 (200ms) at 300ms
Element 5 (Keywords):      opacity: 0 → 1 (200ms) at 400ms
```

### **Tab Transition**
```
Current Tab Content:  opacity: 1 → 0 (150ms)
New Tab Content:      opacity: 0 → 1 (150ms) at 150ms
Active Indicator:     translateX: 0 → 200px (300ms ease-out)
```

### **Hover Effect (Critic Card)**
```
Normal State:
  scale: 1.0
  border-color: #3A3A3A
  box-shadow: none

Hover State (200ms transition):
  scale: 1.02
  border-color: #00BFFF
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.3)
```

---

**Visual specification complete. Ready for implementation approval.**

