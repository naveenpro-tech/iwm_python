"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Eye, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FilmographyTab({ id }: { id: string }) {
  // Sample data for filmography credits
  const filmographyCredits = [
    {
      id: "film-001",
      title: "Gangs of Wasseypur",
      year: "2012",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-002",
      title: "Dev.D",
      year: "2009",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-003",
      title: "Bombay Velvet",
      year: "2015",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-004",
      title: "Ugly",
      year: "2013",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-005",
      title: "Mukkabaaz",
      year: "2017",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-006",
      title: "Manmarziyaan",
      year: "2018",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-007",
      title: "Satya",
      year: "1998",
      role: "Screenwriter",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-008",
      title: "Gulaal",
      year: "2009",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-009",
      title: "Black Friday",
      year: "2004",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-010",
      title: "No Smoking",
      year: "2007",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-011",
      title: "Raman Raghav 2.0",
      year: "2016",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
    {
      id: "film-012",
      title: "That Girl in Yellow Boots",
      year: "2010",
      role: "Director",
      status: "pending",
      poster: "/generic-spy-thriller-poster.png",
    },
  ]

  const [credits, setCredits] = useState(filmographyCredits)

  const handleStatusChange = (id: string, newStatus: string) => {
    setCredits(credits.map((credit) => (credit.id === id ? { ...credit, status: newStatus } : credit)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {credits.map((credit, index) => (
        <motion.div
          key={credit.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img
                  src={credit.poster || "/placeholder.svg"}
                  alt={credit.title}
                  className="h-24 w-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{credit.title}</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Movie
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(credit.id, "approved")}>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Approve Credit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(credit.id, "rejected")}>
                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          Reject Credit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {credit.year} • {credit.role}
                  </div>
                  <div className="mt-2">{getStatusBadge(credit.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
