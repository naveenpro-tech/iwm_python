"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Calendar, Clock, Edit } from "lucide-react"

export function UpcomingMatches() {
  // In a real implementation, this would fetch data from an API
  const matches = [
    {
      id: "match-1",
      teams: "India vs Australia",
      series: "Border-Gavaskar Trophy",
      venue: "MCG, Melbourne",
      datetime: "Tomorrow, 9:00 AM",
      type: "Test",
    },
    {
      id: "match-2",
      teams: "CSK vs MI",
      series: "IPL 2023",
      venue: "Wankhede Stadium, Mumbai",
      datetime: "May 28, 7:30 PM",
      type: "T20",
    },
    {
      id: "match-3",
      teams: "England vs West Indies",
      series: "Test Series",
      venue: "Lord's, London",
      datetime: "June 2, 3:30 PM",
      type: "Test",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Matches</CardTitle>
          <CardDescription>Next scheduled cricket matches</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/admin/cricket/matches?status=upcoming">View all</a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="space-y-1">
              <div className="flex items-center">
                <h3 className="font-medium">{match.teams}</h3>
                <Badge variant="outline" className="ml-2">
                  {match.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{match.series}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{match.datetime}</span>
                <Clock className="h-3 w-3 ml-3 mr-1" />
                <span>{match.venue}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <a href={`/admin/cricket/matches/${match.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit match</span>
              </a>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
