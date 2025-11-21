"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface LiveScoreHeaderProps {
  matchId: string
}

export function LiveScoreHeader({ matchId }: LiveScoreHeaderProps) {
  // In a real implementation, this would fetch match data from an API
  const match = {
    id: matchId,
    teams: "CSK vs MI",
    series: "IPL 2023",
    venue: "Wankhede Stadium, Mumbai",
    status: "live",
  }

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/admin/cricket/matches">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to matches</span>
            </a>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Live Score Override</h1>
        </div>
        <p className="text-muted-foreground">
          Manually update live score for {match.teams} ({match.series})
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <a href={`/cricket/matches/${matchId}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Public Page
        </a>
      </Button>
    </motion.div>
  )
}
