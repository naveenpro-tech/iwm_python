"use client"

import { Suspense, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

// Skeletons
import SectionSkeleton from "@/components/skeletons/section-skeleton"
import BestSceneSectionSkeleton from "@/components/skeletons/best-scene-section-skeleton"

// Mock data imports
import {
  mockProgressData,
  mockWhatsNextData,
  mockInfluenceData,
  mockRecommendationData,
  mockWeeklyGemData,
} from "@/components/homepage/activity-snapshot/mock-data"
import {
  mockNewReleases,
  mockMasterpieces,
  mockSiddusPicks,
  mockVignetteData, // This is a single object for the cinematic vignette
  mockTrendingPulses,
  mockBestScenes,
} from "@/components/homepage/mock-data"

// Dynamically import sections
const PersonalizedActivitySlider = dynamic(
  () =>
    import("@/components/homepage/activity-snapshot/personalized-activity-slider").then(
      (mod) => mod.PersonalizedActivitySlider,
    ),
  {
    loading: () => <SectionSkeleton message="Loading Personalized Insights..." heightClass="h-auto md:h-[480px]" />,
    ssr: false,
  },
)

const CinematicVignetteSection = dynamic(
  () => import("@/components/homepage/cinematic-vignette-section").then((mod) => mod.CinematicVignetteSection),
  {
    loading: () => <SectionSkeleton message="Loading Cinematic Vignette..." heightClass="h-auto md:h-[550px]" />,
    ssr: false,
  },
)

const NewReleasesSection = dynamic(
  () => import("@/components/homepage/new-releases-section").then((mod) => mod.NewReleasesSection),
  {
    loading: () => <SectionSkeleton message="Loading New Releases..." />,
  },
)

const GlobalMasterpiecesSection = dynamic(
  () => import("@/components/homepage/global-masterpieces-section").then((mod) => mod.GlobalMasterpiecesSection),
  {
    loading: () => <SectionSkeleton message="Loading Global Masterpieces..." />,
  },
)

const SiddusPicksSection = dynamic(
  () => import("@/components/homepage/siddus-picks-section").then((mod) => mod.SiddusPicksSection),
  {
    loading: () => <SectionSkeleton message="Loading Siddu's Picks..." />,
  },
)

const BestScenesSection = dynamic(
  () => import("@/components/homepage/best-scenes-section").then((mod) => mod.BestScenesSection),
  {
    loading: () => <BestSceneSectionSkeleton />,
  },
)

const TrendingPulseSection = dynamic(
  () => import("@/components/homepage/trending-pulse-section").then((mod) => mod.TrendingPulseSection),
  {
    loading: () => <SectionSkeleton message="Loading Trending Pulses..." />,
  },
)

export default function HomePage() {
  const router = useRouter()
  // If user is authenticated, redirect them to dashboard when they hit '/'
  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null
      if (!token) return
      // A lightweight ping to verify token. If ok, redirect.
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((u) => {
          if (u) router.replace('/dashboard')
        })
        .catch(() => {})
    } catch {}
  }, [router])

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <Suspense
        fallback={<SectionSkeleton message="Loading Personalized Insights..." heightClass="h-auto md:h-[480px]" />}
      >
        <PersonalizedActivitySlider
          mockProgressData={mockProgressData}
          mockWhatsNextData={mockWhatsNextData}
          mockInfluenceData={mockInfluenceData}
          mockRecommendationData={mockRecommendationData}
          mockWeeklyGemData={mockWeeklyGemData}
        />
      </Suspense>
      <Suspense
        fallback={<SectionSkeleton message="Loading Cinematic Vignette..." heightClass="h-auto md:h-[550px]" />}
      >
        <CinematicVignetteSection vignettes={[mockVignetteData]} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton message="Loading New Releases..." />}>
        <NewReleasesSection movies={mockNewReleases} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton message="Loading Global Masterpieces..." />}>
        <GlobalMasterpiecesSection films={mockMasterpieces} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton message="Loading Siddu's Picks..." />}>
        <SiddusPicksSection picks={mockSiddusPicks} />
      </Suspense>
      <Suspense fallback={<BestSceneSectionSkeleton />}>
        <BestScenesSection scenes={mockBestScenes} />
      </Suspense>
      <Suspense fallback={<SectionSkeleton message="Loading Trending Pulses..." />}>
        <TrendingPulseSection pulses={mockTrendingPulses} />
      </Suspense>
    </div>
  )
}
