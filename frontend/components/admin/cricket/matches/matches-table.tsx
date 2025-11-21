"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, MoreHorizontal, Play } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function MatchesTable() {
  // In a real implementation, this would fetch data from an API
  const matches = [
    {
      id: "match-1",
      teams: "India vs Australia",
      series: "Border-Gavaskar Trophy",
      venue: "MCG, Melbourne",
      datetime: "Tomorrow, 9:00 AM",
      status: "upcoming",
      type: "Test",
    },
    {
      id: "match-2",
      teams: "CSK vs MI",
      series: "IPL 2023",
      venue: "Wankhede Stadium, Mumbai",
      datetime: "Live",
      status: "live",
      score: "CSK: 145/6 (18.2 ov)",
      type: "T20",
    },
    {
      id: "match-3",
      teams: "England vs West Indies",
      series: "Test Series",
      venue: "Lord's, London",
      datetime: "June 2, 3:30 PM",
      status: "upcoming",
      type: "Test",
    },
    {
      id: "match-4",
      teams: "RCB vs KKR",
      series: "IPL 2023",
      venue: "Chinnaswamy Stadium, Bangalore",
      datetime: "Completed",
      status: "completed",
      result: "RCB won by 8 wickets",
      type: "T20",
    },
    {
      id: "match-5",
      teams: "Pakistan vs New Zealand",
      series: "Bilateral Series",
      venue: "Lahore",
      datetime: "Completed",
      status: "completed",
      result: "Pakistan won by 5 wickets",
      type: "ODI",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500">Live</Badge>
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match ID</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead className="hidden md:table-cell">Series</TableHead>
              <TableHead className="hidden lg:table-cell">Date/Time</TableHead>
              <TableHead className="hidden sm:table-cell">Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match, index) => (
              <motion.tr
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-accent/50"
              >
                <TableCell className="font-medium">{match.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{match.teams}</div>
                  {match.status === "live" && <div className="text-xs text-muted-foreground">{match.score}</div>}
                  {match.status === "completed" && <div className="text-xs text-muted-foreground">{match.result}</div>}
                </TableCell>
                <TableCell className="hidden md:table-cell">{match.series}</TableCell>
                <TableCell className="hidden lg:table-cell">{match.datetime}</TableCell>
                <TableCell className="hidden sm:table-cell">{match.venue}</TableCell>
                <TableCell>{getStatusBadge(match.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{match.type}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {match.status === "live" && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={`/admin/cricket/matches/${match.id}/live-score`}>
                          <Play className="h-4 w-4 fill-current" />
                          <span className="sr-only">Update live score</span>
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="icon" asChild>
                      <a href={`/admin/cricket/matches/${match.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View match</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={`/admin/cricket/matches/${match.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit match</span>
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
