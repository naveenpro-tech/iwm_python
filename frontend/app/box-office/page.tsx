"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const BoxOfficeHeader = dynamic(
  () => import("@/components/box-office/box-office-header").then((mod) => mod.BoxOfficeHeader),
  { ssr: false },
)
const BoxOfficeDashboard = dynamic(
  () => import("@/components/box-office/box-office-dashboard").then((mod) => mod.BoxOfficeDashboard),
  { ssr: false },
)
const TopGrossingFilmsTable = dynamic(
  () => import("@/components/box-office/top-grossing-films-table").then((mod) => mod.TopGrossingFilmsTable),
  { ssr: false },
)
const PerformanceByCategory = dynamic(
  () => import("@/components/box-office/performance-by-category").then((mod) => mod.PerformanceByCategory),
  { ssr: false },
)
const BoxOfficeRecords = dynamic(
  () => import("@/components/box-office/box-office-records").then((mod) => mod.BoxOfficeRecords),
  { ssr: false },
)
const BoxOfficeSkeleton = dynamic(
  () => import("@/components/box-office/box-office-skeleton").then((mod) => mod.BoxOfficeSkeleton),
  { ssr: false },
)

export default function BoxOfficePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<BoxOfficeSkeleton />}>
        <BoxOfficeContent />
      </Suspense>
    </div>
  )
}

function BoxOfficeContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BoxOfficeHeader />

      <div className="space-y-12">
        <BoxOfficeDashboard weekendData={[]} trendData={[]} yearToDateData={[]} />

        <TopGrossingFilmsTable topFilms={[]} />

        <PerformanceByCategory genreData={[]} studioData={[]} monthlyData={[]} />

        <BoxOfficeRecords records={[]} />
      </div>
    </div>
  )
}
