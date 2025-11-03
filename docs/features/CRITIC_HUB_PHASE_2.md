# 🎨 CRITIC HUB - PHASE 2: Critic Profile Pages

**Duration:** 6 hours  
**Status:** 📋 READY FOR EXECUTION

---

## 🎯 OBJECTIVES

1. Create critic profile page (`/critic/[username]`)
2. Implement all profile components
3. Add "Futuristic 1000 Years Ahead" animations
4. Integrate with backend API
5. Make fully responsive
6. Test end-to-end from browser

---

## 📄 STEP 1: MAIN PROFILE PAGE (45 minutes)

### **File:** `app/critic/[username]/page.tsx`

**Structure:**
```typescript
"use client"

import { use as usePromise, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CriticHeroSection } from "@/components/critic/profile/critic-hero-section"
import { CriticStatsBar } from "@/components/critic/profile/critic-stats-bar"
import { CriticBioSection } from "@/components/critic/profile/critic-bio-section"
import { CriticSocialLinks } from "@/components/critic/profile/critic-social-links"
import { CriticReviewGrid } from "@/components/critic/profile/critic-review-grid"
import { FollowButton } from "@/components/critic/profile/follow-button"

interface CriticProfileDTO {
  id: string
  username: string
  displayName: string
  bio: string
  logoUrl: string
  bannerUrl: string
  bannerVideoUrl?: string
  isVerified: boolean
  verificationLevel: string
  followerCount: number
  totalReviews: number
  avgEngagement: number
  totalViews: number
  reviewPhilosophy?: string
  equipmentInfo?: string
  backgroundInfo?: string
  socialLinks: Array<{
    platform: string
    url: string
    isPrimary: boolean
  }>
  isFollowing: boolean
}

export default function CriticProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = usePromise(params)
  const [critic, setCritic] = useState<CriticProfileDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCritic = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      try {
        const response = await fetch(`${apiBase}/api/v1/critics/${username}`)
        if (response.ok) {
          const data = await response.json()
          setCritic(data)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCritic()
  }, [username])

  if (loading) {
    return <LoadingState />
  }

  if (error || !critic) {
    return <ErrorState username={username} />
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/critic/browse">
          <Button variant="ghost" className="text-[#A0A0A0] hover:text-[#E0E0E0]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Critics
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <CriticHeroSection
        bannerUrl={critic.bannerUrl}
        bannerVideoUrl={critic.bannerVideoUrl}
        logoUrl={critic.logoUrl}
        displayName={critic.displayName}
        username={critic.username}
        isVerified={critic.isVerified}
        verificationLevel={critic.verificationLevel}
      />

      {/* Stats Bar */}
      <CriticStatsBar
        followerCount={critic.followerCount}
        totalReviews={critic.totalReviews}
        avgEngagement={critic.avgEngagement}
        totalViews={critic.totalViews}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Bio & Social Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CriticBioSection
              bio={critic.bio}
              reviewPhilosophy={critic.reviewPhilosophy}
              equipmentInfo={critic.equipmentInfo}
              backgroundInfo={critic.backgroundInfo}
            />
          </div>
          <div>
            <CriticSocialLinks links={critic.socialLinks} />
            <FollowButton
              criticId={critic.id}
              isFollowing={critic.isFollowing}
              followerCount={critic.followerCount}
            />
          </div>
        </div>

        {/* Reviews Grid */}
        <CriticReviewGrid criticUsername={username} />
      </div>
    </motion.div>
  )
}
```

---

## 🎨 STEP 2: HERO SECTION COMPONENT (60 minutes)

### **File:** `components/critic/profile/critic-hero-section.tsx`

**Features:**
- Full-width banner (image or video)
- Parallax scroll effect
- Circular logo with glow effect
- Display name with verified badge
- Holographic shimmer on verified badge
- Smooth fade-in animations

**Key Animations:**
```typescript
// Parallax effect
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start start", "end start"],
})
const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0.3])

// Verified badge holographic shimmer
const shimmer = {
  background: "linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.3), transparent)",
  animation: "shimmer 2s infinite",
}
```

**Design:**
- Height: 60vh on mobile, 70vh on desktop
- Banner: Full-width with dark gradient overlay
- Logo: 150px circle with 4px border (#00BFFF), positioned bottom-center
- Name: 3xl font, Inter bold, positioned below logo
- Verified badge: Absolute positioned top-right of logo

---

## 📊 STEP 3: STATS BAR COMPONENT (30 minutes)

### **File:** `components/critic/profile/critic-stats-bar.tsx`

**Features:**
- Horizontal bar with 4 key metrics
- Animated counters (count up on view)
- Glow effect on hover
- Responsive grid layout

**Metrics:**
1. **Followers** - Large number with "Followers" label
2. **Total Reviews** - Count with "Reviews" label
3. **Avg Engagement** - Percentage with "Engagement" label
4. **Total Views** - Formatted number (1.2M) with "Views" label

**Design:**
- Background: #151515
- Border: #3A3A3A
- Padding: 24px
- Grid: 4 columns on desktop, 2 on mobile
- Each stat: Centered, number in #00BFFF, label in #A0A0A0

**Animation:**
```typescript
// Count-up animation
const { ref, inView } = useInView({ once: true })
const count = useSpring(0, { duration: 2000 })

useEffect(() => {
  if (inView) {
    count.set(targetValue)
  }
}, [inView])
```

---

## 📝 STEP 4: BIO SECTION COMPONENT (45 minutes)

### **File:** `components/critic/profile/critic-bio-section.tsx`

**Features:**
- Main bio (rich text rendering)
- Expandable "About Me" sections:
  - Review Philosophy
  - Equipment & Setup
  - Background & Experience
- Smooth expand/collapse animations
- Read more/less functionality

**Design:**
- Card background: #151515
- Border: #3A3A3A
- Bio text: #E0E0E0, DM Sans, 16px
- Section headers: #00BFFF, Inter bold, 18px
- Expand icon: Animated rotation

**Animation:**
```typescript
// Expand/collapse
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

---

## 🔗 STEP 5: SOCIAL LINKS COMPONENT (30 minutes)

### **File:** `components/critic/profile/critic-social-links.tsx`

**Features:**
- List of social platform links
- Official platform icons (YouTube, Twitter, Instagram, Blog, TikTok)
- Hover effects with glow
- Primary link highlighted
- External link indicators

**Design:**
- Card background: #151515
- Each link: Horizontal layout with icon + platform name
- Icon: 24px, platform brand color
- Hover: Scale 1.05, glow effect
- Primary link: Border-left 3px #00BFFF

**Platform Icons:**
```typescript
const platformIcons = {
  youtube: <Youtube className="w-6 h-6 text-[#FF0000]" />,
  twitter: <Twitter className="w-6 h-6 text-[#1DA1F2]" />,
  instagram: <Instagram className="w-6 h-6 text-[#E4405F]" />,
  blog: <Globe className="w-6 h-6 text-[#00BFFF]" />,
  tiktok: <Music className="w-6 h-6 text-[#000000]" />,
}
```

---

## 💙 STEP 6: FOLLOW BUTTON COMPONENT (30 minutes)

### **File:** `components/critic/profile/follow-button.tsx`

**Features:**
- Toggle follow/unfollow
- Optimistic UI updates
- Loading state
- Follower count updates
- Authentication check
- Particle effect on follow

**States:**
1. **Not Following:** Blue button "Follow"
2. **Following:** Gray button "Following" (hover shows "Unfollow")
3. **Loading:** Spinner animation

**Animation:**
```typescript
// Particle burst on follow
const particles = Array.from({ length: 12 }).map((_, i) => ({
  x: Math.cos((i * 30 * Math.PI) / 180) * 50,
  y: Math.sin((i * 30 * Math.PI) / 180) * 50,
}))

<motion.div
  initial={{ scale: 0, opacity: 1 }}
  animate={{ scale: 1, opacity: 0 }}
  transition={{ duration: 0.6 }}
/>
```

---

## 📋 STEP 7: REVIEW GRID COMPONENT (90 minutes)

### **File:** `components/critic/profile/critic-review-grid.tsx`

**Features:**
- Responsive grid of review cards
- Search, filter, sort controls
- Pagination
- Loading states
- Empty state

**Filters:**
- Genre dropdown
- Rating range slider
- Sort: Latest, Highest Rated, Most Popular

**Grid:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Gap: 24px
- Staggered fade-in animation

### **File:** `components/critic/profile/critic-review-card.tsx`

**Card Design:**
- Movie poster (aspect ratio 2:3)
- Movie title
- Critic's rating (large, colored)
- Review snippet (2 lines max)
- Engagement stats (likes, comments)
- Published date
- Link to full review

**Hover Effect:**
- Scale 1.02
- Border color change to #00BFFF
- Glow effect
- Smooth transition

---

## 🧪 STEP 8: TESTING (45 minutes)

### **Test Checklist:**

1. **Profile Loading:**
   - [ ] Navigate to `/critic/test-critic`
   - [ ] Verify hero section loads
   - [ ] Check parallax effect works
   - [ ] Verify stats display correctly

2. **Interactions:**
   - [ ] Click follow button (check auth)
   - [ ] Expand bio sections
   - [ ] Click social links (open in new tab)
   - [ ] Filter reviews by genre
   - [ ] Sort reviews
   - [ ] Paginate through reviews

3. **Responsive:**
   - [ ] Test on mobile (320px)
   - [ ] Test on tablet (768px)
   - [ ] Test on desktop (1920px)
   - [ ] Verify all layouts adapt

4. **Animations:**
   - [ ] Parallax scrolls smoothly
   - [ ] Stats count up on view
   - [ ] Follow button particles appear
   - [ ] Review cards stagger in
   - [ ] Verified badge shimmers

5. **Edge Cases:**
   - [ ] Non-existent critic (404 page)
   - [ ] Critic with no reviews
   - [ ] Critic with no social links
   - [ ] Very long bio text
   - [ ] Missing banner image

---

## ✅ PHASE 2 COMPLETION CHECKLIST

- [ ] Main profile page created
- [ ] Hero section component with parallax
- [ ] Stats bar with animated counters
- [ ] Bio section with expandable sections
- [ ] Social links component with icons
- [ ] Follow button with particle effect
- [ ] Review grid with filters/sort
- [ ] Review card component
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] All animations working
- [ ] Fully responsive
- [ ] End-to-end tested in browser
- [ ] No console errors
- [ ] Performance optimized (Lighthouse > 90)

---

**Next:** Proceed to Phase 3 - Critic Review Pages

