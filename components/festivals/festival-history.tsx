"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Landmark, Award } from "lucide-react"
import { motion } from "framer-motion"

interface HistoricalEvent {
  year: number
  milestone: string // e.g., "First Edition Held", "Palme d'Or Introduced"
  description?: string
  keyFilm?: string // A notable film from that year's festival
}

interface FestivalHistoryProps {
  festivalName: string
  foundingYear: number
  historicalEvents?: HistoricalEvent[] // Optional, can be fetched or passed
}

// Mock data for Cannes Film Festival
const mockCannesHistory: HistoricalEvent[] = [
  {
    year: 1946,
    milestone: "First edition of the festival held.",
    description: "Originally planned for 1939 but postponed due to WWII.",
  },
  {
    year: 1955,
    milestone: "Palme d'Or (Golden Palm) introduced.",
    description: "Replaced the Grand Prix du Festival International du Film as the highest prize.",
    keyFilm: "Marty",
  },
  {
    year: 1968,
    milestone: "Festival interrupted and cancelled.",
    description: "Due to the May 1968 events in France, several directors withdrew their films in solidarity.",
  },
  {
    year: 1972,
    milestone: "Non-competitive 'Perspectives du Cinéma Français' section introduced.",
    keyFilm: "A Clockwork Orange (Out of Competition)",
  },
  {
    year: 1978,
    milestone: "Caméra d'Or award created.",
    description: "Awarded for the best first feature film presented in one of the Cannes' selections.",
  },
  {
    year: 2002,
    milestone: "Official name changed to Festival de Cannes.",
    description: "Previously Festival international du film.",
  },
  {
    year: 2020,
    milestone: "Physical festival cancelled due to COVID-19 pandemic.",
    description: "A smaller 'Special Cannes 2020' event was held in October.",
  },
]

export function FestivalHistory({
  festivalName = "Cannes Film Festival",
  foundingYear = 1946,
  historicalEvents = mockCannesHistory,
}: FestivalHistoryProps) {
  const sortedEvents = historicalEvents.sort((a, b) => b.year - a.year) // Show recent first

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold text-gray-100 mb-6 px-4 md:px-0">Festival History: {festivalName}</h2>
      <Card className="bg-gray-800 border-gray-700 text-gray-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Landmark className="h-6 w-6 mr-2 text-sky-400" /> Established in {foundingYear}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Key milestones and moments from the festival's rich past.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedEvents.length > 0 ? (
            <div className="relative pl-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gray-600">
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event.year + "-" + index}
                  className="relative mb-8 pl-8 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="absolute -left-1.5 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-sky-500 ring-4 ring-gray-700 group-hover:ring-sky-600 transition-all" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <time className="text-sm font-medium leading-none text-sky-400 group-hover:text-sky-300">
                      {event.year}
                    </time>
                    {event.keyFilm && (
                      <span className="mt-1 sm:mt-0 text-xs text-gray-400 flex items-center">
                        <Award className="h-3 w-3 mr-1.5 text-yellow-400" /> Notable Film: {event.keyFilm}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-100">{event.milestone}</h3>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-300 leading-relaxed">{event.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No historical events available for this festival.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
