# 🎬 CRITIC HUB - PHASE 3: Critic Review Pages

**Duration:** 8 hours  
**Status:** 📋 READY FOR EXECUTION

---

## 🎯 OBJECTIVES

1. Create full-fledged critic review page (`/critic/[username]/review/[movieSlug]`)
2. Implement rich media integration (YouTube, images, galleries)
3. Add "Where to Watch" section with affiliate links
4. Build engagement features (like, comment, share)
5. Create dedicated comment system
6. Add "Futuristic 1000 Years Ahead" animations
7. Make fully responsive and shareable

---

## 📄 STEP 1: MAIN REVIEW PAGE (60 minutes)

### **File:** `app/critic/[username]/review/[movieSlug]/page.tsx`

**Structure:**
```typescript
"use client"

import { use as usePromise, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CriticReviewHeader } from "@/components/critic/review/critic-review-header"
import { CriticRatingDisplay } from "@/components/critic/review/critic-rating-display"
import { YouTubeEmbedSection } from "@/components/critic/review/youtube-embed-section"
import { WrittenContentSection } from "@/components/critic/review/written-content-section"
import { ImageGallerySection } from "@/components/critic/review/image-gallery-section"
import { WhereToWatchSection } from "@/components/critic/review/where-to-watch-section"
import { EngagementBar } from "@/components/critic/review/engagement-bar"
import { CommentsThread } from "@/components/critic/review/comments-thread"
import { AuthorBar } from "@/components/critic/review/author-bar"
import { RelatedCriticReviews } from "@/components/critic/review/related-critic-reviews"

interface CriticReviewDTO {
  id: string
  title: string
  content: string
  ratingType: string
  ratingValue: string
  numericRating: number
  youtubeEmbedUrl?: string
  imageGallery: string[]
  watchLinks: Array<{
    platform: string
    url: string
    isAffiliate: boolean
  }>
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  userHasLiked: boolean
  critic: {
    id: string
    username: string
    displayName: string
    logoUrl: string
    isVerified: boolean
    followerCount: number
  }
  movie: {
    id: string
    title: string
    releaseYear: number
    posterUrl: string
    backdropUrl: string
    sidduScore: number
    genres: string[]
  }
  comments: CommentDTO[]
}

export default function CriticReviewPage({
  params,
}: {
  params: Promise<{ username: string; movieSlug: string }>
}) {
  const { username, movieSlug } = usePromise(params)
  const [review, setReview] = useState<CriticReviewDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReview = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      try {
        // Fetch by slug: /api/v1/critic-reviews/slug/{username}/{movieSlug}
        const response = await fetch(
          `${apiBase}/api/v1/critic-reviews/slug/${username}/${movieSlug}`
        )
        if (response.ok) {
          const data = await response.json()
          setReview(data)
          // Increment view count
          await fetch(`${apiBase}/api/v1/critic-reviews/${data.id}/view`, {
            method: "POST",
          })
        }
      } catch (err) {
        console.error("Failed to fetch review:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReview()
  }, [username, movieSlug])

  if (loading) return <LoadingState />
  if (!review) return <ErrorState />

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Movie Backdrop */}
      <CriticReviewHeader
        movieTitle={review.movie.title}
        movieBackdrop={review.movie.backdropUrl}
        criticLogo={review.critic.logoUrl}
        criticName={review.critic.displayName}
        isVerified={review.critic.isVerified}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Rating Display */}
        <CriticRatingDisplay
          ratingType={review.ratingType}
          ratingValue={review.ratingValue}
          numericRating={review.numericRating}
          movieSidduScore={review.movie.sidduScore}
        />

        {/* YouTube Embed (if exists) */}
        {review.youtubeEmbedUrl && (
          <YouTubeEmbedSection embedUrl={review.youtubeEmbedUrl} />
        )}

        {/* Written Content */}
        <WrittenContentSection
          title={review.title}
          content={review.content}
        />

        {/* Image Gallery (if exists) */}
        {review.imageGallery.length > 0 && (
          <ImageGallerySection images={review.imageGallery} />
        )}

        {/* Where to Watch */}
        {review.watchLinks.length > 0 && (
          <WhereToWatchSection links={review.watchLinks} />
        )}

        {/* Engagement Bar */}
        <EngagementBar
          reviewId={review.id}
          likeCount={review.likeCount}
          commentCount={review.commentCount}
          shareCount={review.shareCount}
          userHasLiked={review.userHasLiked}
        />

        {/* Comments Thread */}
        <CommentsThread
          reviewId={review.id}
          comments={review.comments}
        />

        {/* Author Bar */}
        <AuthorBar critic={review.critic} />

        {/* Related Critic Reviews */}
        <RelatedCriticReviews
          movieId={review.movie.id}
          currentReviewId={review.id}
        />
      </div>
    </motion.div>
  )
}
```

---

## 🎨 STEP 2: REVIEW HEADER COMPONENT (45 minutes)

### **File:** `components/critic/review/critic-review-header.tsx`

**Features:**
- Cinematic header with movie backdrop
- Parallax scroll effect
- Critic branding (logo + name)
- Verified badge with holographic shimmer
- Dark gradient overlay

**Design:**
- Height: 50vh on mobile, 60vh on desktop
- Backdrop: Full-width with parallax
- Gradient: `from-black/80 via-black/60 to-[#1A1A1A]`
- Critic logo: 80px circle, positioned bottom-left
- Name: Next to logo, Inter bold, 24px

---

## ⭐ STEP 3: RATING DISPLAY COMPONENT (45 minutes)

### **File:** `components/critic/review/critic-rating-display.tsx`

**Features:**
- Display critic's custom rating (numeric, letter, or custom)
- Show Siddu Score for comparison
- Visual rating representation
- Animated reveal

**Rating Types:**
1. **Numeric:** Large number (8.5/10) with star visualization
2. **Letter:** Large letter grade (A-, B+) with color coding
3. **Custom:** Custom text ("Must Watch!", "Skip It") with icon

**Design:**
- Two-column layout: Critic Rating | Siddu Score
- Critic rating: Large (4xl), colored based on value
- Siddu Score: Smaller (2xl), blue accent
- Separator: Vertical line (#3A3A3A)

**Color Coding:**
```typescript
const getRatingColor = (numeric: number) => {
  if (numeric >= 8) return "#00FF88" // Green
  if (numeric >= 6) return "#FFD700" // Gold
  if (numeric >= 4) return "#FFA500" // Orange
  return "#FF4500" // Red
}
```

---

## 📺 STEP 4: YOUTUBE EMBED COMPONENT (30 minutes)

### **File:** `components/critic/review/youtube-embed-section.tsx`

**Features:**
- Responsive YouTube iframe
- 16:9 aspect ratio
- Loading state
- Error handling
- Smooth fade-in

**Design:**
- Container: Rounded corners, border #3A3A3A
- Aspect ratio: 16:9 (padding-bottom: 56.25%)
- Background: #0D0D0D while loading
- Max width: 100%

**Implementation:**
```typescript
<div className="relative w-full pb-[56.25%] bg-[#0D0D0D] rounded-lg overflow-hidden border border-[#3A3A3A]">
  <iframe
    className="absolute top-0 left-0 w-full h-full"
    src={embedUrl}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
```

---

## 📝 STEP 5: WRITTEN CONTENT COMPONENT (45 minutes)

### **File:** `components/critic/review/written-content-section.tsx`

**Features:**
- Rich text rendering (Markdown support)
- Optional review title
- Proper typography
- Read more/less for long content
- Smooth expand animation

**Design:**
- Title: 2xl, Inter bold, #E0E0E0
- Content: 18px, DM Sans, #E0E0E0, line-height 1.8
- Max height: 600px (collapsed), auto (expanded)
- Read more button: Blue accent, smooth transition

**Markdown Support:**
```typescript
import ReactMarkdown from "react-markdown"

<ReactMarkdown
  className="prose prose-invert max-w-none"
  components={{
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-[#00BFFF] mt-8 mb-4" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 text-[#E0E0E0]" {...props} />,
    // ... more custom components
  }}
>
  {content}
</ReactMarkdown>
```

---

## 🖼️ STEP 6: IMAGE GALLERY COMPONENT (60 minutes)

### **File:** `components/critic/review/image-gallery-section.tsx`

**Features:**
- Grid layout for multiple images
- Lightbox on click
- Smooth transitions
- Lazy loading
- Swipe gestures on mobile

**Design:**
- Grid: 2 columns on mobile, 3 on desktop
- Gap: 16px
- Rounded corners: 8px
- Hover: Scale 1.05, brightness increase

**Lightbox:**
```typescript
const [selectedImage, setSelectedImage] = useState<number | null>(null)

<AnimatePresence>
  {selectedImage !== null && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedImage(null)}
    >
      <motion.img
        src={images[selectedImage]}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      />
      {/* Navigation arrows */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 📺 STEP 7: WHERE TO WATCH COMPONENT (45 minutes)

### **File:** `components/critic/review/where-to-watch-section.tsx`

**Features:**
- List of streaming/rental platforms
- Affiliate link indicators
- Platform logos
- External link icons
- Hover effects

**Design:**
- Card background: #151515
- Title: "Where to Watch" with TV icon
- Each link: Horizontal layout with logo + platform name + price (if any)
- Affiliate badge: Small "Affiliate Link" text in #FFD700
- Hover: Background #282828, scale 1.02

**Platform Logos:**
```typescript
const platformLogos = {
  netflix: "/platforms/netflix.png",
  amazon: "/platforms/amazon.png",
  disney: "/platforms/disney.png",
  hulu: "/platforms/hulu.png",
  // ... more platforms
}
```

---

## 💬 STEP 8: ENGAGEMENT BAR COMPONENT (45 minutes)

### **File:** `components/critic/review/engagement-bar.tsx`

**Features:**
- Like button with heart icon
- Comment button (scrolls to comments)
- Share button (native share API or clipboard)
- Optimistic UI updates
- Particle effects on like

**Design:**
- Horizontal bar with 3 buttons
- Each button: Icon + count
- Like button: Heart icon, fills when liked
- Active state: #FF4500 (red heart)
- Inactive state: #A0A0A0

**Like Animation:**
```typescript
const handleLike = async () => {
  if (!isAuthenticated()) {
    router.push("/login")
    return
  }
  
  // Optimistic update
  setHasLiked(!hasLiked)
  setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1)
  
  // Particle burst
  setShowParticles(true)
  setTimeout(() => setShowParticles(false), 600)
  
  // API call
  try {
    await fetch(`${apiBase}/api/v1/critic-reviews/${reviewId}/like`, {
      method: hasLiked ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    // Revert on error
    setHasLiked(hasLiked)
    setLikeCount(likeCount)
  }
}
```

---

## 💬 STEP 9: COMMENTS THREAD COMPONENT (90 minutes)

### **File:** `components/critic/review/comments-thread.tsx`

**Features:**
- Comment composer (for logged-in users)
- Threaded comments (replies)
- Like comments
- Sort options (newest, oldest, most liked)
- Pagination
- Real-time updates

**Design:**
- Composer: Textarea + submit button
- Each comment: Avatar + username + content + actions
- Reply indent: 40px
- Hover: Background #151515

**Comment Structure:**
```typescript
interface CommentDTO {
  id: string
  content: string
  createdAt: string
  likeCount: number
  userHasLiked: boolean
  author: {
    id: string
    username: string
    avatarUrl: string
  }
  replies: CommentDTO[]
}
```

---

## 👤 STEP 10: AUTHOR BAR COMPONENT (30 minutes)

### **File:** `components/critic/review/author-bar.tsx`

**Features:**
- Critic info (logo, name, follower count)
- "View Profile" button
- "Follow" button
- Smooth hover effects

**Design:**
- Horizontal card: #151515
- Left: Critic logo (60px) + name + stats
- Right: Action buttons
- Border: #3A3A3A

---

## 🔗 STEP 11: RELATED REVIEWS COMPONENT (45 minutes)

### **File:** `components/critic/review/related-critic-reviews.tsx`

**Features:**
- Horizontal carousel of other critic reviews for same movie
- Navigation arrows
- Smooth scroll
- Review cards with critic branding

**Design:**
- Title: "Other Critic Reviews for [Movie]"
- Carousel: Horizontal scroll, 3 cards visible on desktop
- Each card: Critic logo + name + rating + snippet
- Hover: Border color change

---

## 🧪 STEP 12: TESTING (60 minutes)

### **Test Checklist:**

1. **Page Loading:**
   - [ ] Navigate to `/critic/test-critic/review/inception`
   - [ ] Verify header loads with backdrop
   - [ ] Check rating displays correctly
   - [ ] Verify YouTube embed loads

2. **Rich Media:**
   - [ ] YouTube video plays
   - [ ] Image gallery opens lightbox
   - [ ] Lightbox navigation works
   - [ ] Where to Watch links open correctly

3. **Engagement:**
   - [ ] Like button toggles
   - [ ] Particle effect appears
   - [ ] Comment submission works
   - [ ] Reply to comment works
   - [ ] Share button copies URL

4. **Responsive:**
   - [ ] Test on mobile (320px)
   - [ ] Test on tablet (768px)
   - [ ] Test on desktop (1920px)
   - [ ] YouTube embed responsive
   - [ ] Image gallery adapts

5. **SEO:**
   - [ ] Meta tags present
   - [ ] Open Graph tags
   - [ ] Twitter Card tags
   - [ ] Canonical URL

---

## ✅ PHASE 3 COMPLETION CHECKLIST

- [ ] Main review page created
- [ ] Header component with parallax
- [ ] Rating display component
- [ ] YouTube embed component
- [ ] Written content component with Markdown
- [ ] Image gallery with lightbox
- [ ] Where to Watch section
- [ ] Engagement bar with like/comment/share
- [ ] Comments thread with replies
- [ ] Author bar component
- [ ] Related reviews carousel
- [ ] All animations working
- [ ] Fully responsive
- [ ] SEO optimized
- [ ] End-to-end tested
- [ ] Performance optimized

---

**Next:** Proceed to Phase 4 - Critic Creation Tools

