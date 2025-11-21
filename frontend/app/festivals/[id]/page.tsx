"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { FestivalHeader } from "@/components/festivals/festival-header"
import { FestivalProgram } from "@/components/festivals/festival-program"
import { FestivalJury } from "@/components/festivals/festival-jury"
import { FestivalCoverage } from "@/components/festivals/festival-coverage"
import { FestivalVenue } from "@/components/festivals/festival-venue"
import { FestivalHistory } from "@/components/festivals/festival-history"
import { FestivalDetailsSkeleton } from "@/components/festivals/festival-details-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FestivalDetailsPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FestivalDetailsSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <FestivalHeader festivalId={params.id as string} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="program" className="space-y-8">
          <TabsList className="bg-[#282828] border border-gray-800">
            <TabsTrigger value="program">Program</TabsTrigger>
            <TabsTrigger value="jury">Jury & Awards</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="venue">Venue & Access</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="program">
            <FestivalProgram festivalId={params.id as string} />
          </TabsContent>

          <TabsContent value="jury">
            <FestivalJury festivalId={params.id as string} />
          </TabsContent>

          <TabsContent value="coverage">
            <FestivalCoverage festivalId={params.id as string} />
          </TabsContent>

          <TabsContent value="venue">
            <FestivalVenue festivalId={params.id as string} />
          </TabsContent>

          <TabsContent value="history">
            <FestivalHistory festivalId={params.id as string} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
