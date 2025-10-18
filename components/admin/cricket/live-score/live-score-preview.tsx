"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface LiveScorePreviewProps {
  matchId: string
}

export function LiveScorePreview({ matchId }: LiveScorePreviewProps) {
  // In a real implementation, this would fetch match data from an API
  const match = {
    id: matchId,
    teams: {
      home: { id: "csk", name: "Chennai Super Kings", score: "145/6", overs: "18.2" },
      away: { id: "mi", name: "Mumbai Indians", score: "0/0", overs: "0.0" },
    },
    series: "IPL 2023",
    venue: "Wankhede Stadium, Mumbai",
    status: "live",
    toss: "CSK won the toss and elected to bat",
    batsmen: [
      { id: "player1", name: "MS Dhoni", runs: 28, balls: 15, fours: 2, sixes: 2, strikeRate: 186.67 },
      { id: "player2", name: "Ravindra Jadeja", runs: 16, balls: 8, fours: 1, sixes: 1, strikeRate: 200.0 },
    ],
    bowlers: [{ id: "player3", name: "Jasprit Bumrah", overs: "3.2", maidens: 0, runs: 24, wickets: 2, economy: 7.2 }],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>How the match appears to users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              {match.teams.home.name} vs {match.teams.away.name}
            </h3>
            <Badge variant="destructive">LIVE</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{match.series}</p>
          <p className="text-sm text-muted-foreground">{match.venue}</p>
          <p className="text-sm italic">{match.toss}</p>
        </div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{match.teams.home.name}</h4>
                <div className="text-2xl font-bold">{match.teams.home.score}</div>
                <div className="text-sm text-muted-foreground">Overs: {match.teams.home.overs}</div>
              </div>
              <div className="text-right">
                <h4 className="font-medium">{match.teams.away.name}</h4>
                <div className="text-2xl font-bold">{match.teams.away.score}</div>
                <div className="text-sm text-muted-foreground">Overs: {match.teams.away.overs}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Current Batsmen</h4>
            <div className="grid grid-cols-2 gap-2">
              {match.batsmen.map((batsman, index) => (
                <div key={batsman.id} className="p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{batsman.name}</div>
                    {index === 0 && <Badge variant="outline">*</Badge>}
                  </div>
                  <div className="text-xl font-bold">
                    {batsman.runs} <span className="text-sm font-normal">({batsman.balls})</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {batsman.fours} fours, {batsman.sixes} sixes, SR: {batsman.strikeRate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Current Bowler</h4>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="font-medium">{match.bowlers[0].name}</div>
              <div className="text-xl font-bold">
                {match.bowlers[0].wickets}/{match.bowlers[0].runs}
              </div>
              <div className="text-xs text-muted-foreground">
                {match.bowlers[0].overs} overs, {match.bowlers[0].maidens} maidens, Econ: {match.bowlers[0].economy}
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
