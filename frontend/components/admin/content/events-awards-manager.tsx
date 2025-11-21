"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Plus, Search, MoreHorizontal, Edit, Trash, Calendar, Trophy } from "lucide-react"

interface Event {
  id: string
  title: string
  type: "festival" | "award-show" | "premiere"
  date: string
  location: string
  status: "upcoming" | "live" | "past"
}

interface Award {
  id: string
  name: string
  category: string
  event: string
  year: number
  nominee: string
  movie: string
  winner: boolean
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Siddu Film Festival 2024",
    type: "festival",
    date: "2024-06-15",
    location: "Virtual Event",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Global Cinema Awards",
    type: "award-show",
    date: "2024-03-10",
    location: "Los Angeles, CA",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Oppenheimer Premiere",
    type: "premiere",
    date: "2023-07-21",
    location: "New York, NY",
    status: "past",
  },
]

const mockAwards: Award[] = [
  {
    id: "1",
    name: "Best Picture",
    category: "Feature Film",
    event: "Global Cinema Awards",
    year: 2023,
    nominee: "Oppenheimer",
    movie: "Oppenheimer",
    winner: true,
  },
  {
    id: "2",
    name: "Best Director",
    category: "Feature Film",
    event: "Global Cinema Awards",
    year: 2023,
    nominee: "Christopher Nolan",
    movie: "Oppenheimer",
    winner: true,
  },
  {
    id: "3",
    name: "Best Actor",
    category: "Feature Film",
    event: "Global Cinema Awards",
    year: 2023,
    nominee: "Cillian Murphy",
    movie: "Oppenheimer",
    winner: true,
  },
  {
    id: "4",
    name: "Best Actress",
    category: "Feature Film",
    event: "Global Cinema Awards",
    year: 2023,
    nominee: "Emma Stone",
    movie: "Poor Things",
    winner: false,
  },
]

export function EventsAwardsManager() {
  const [searchQuery, setSearchQuery] = useState("")

  const getEventStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500"
      case "live":
        return "bg-green-500/10 text-green-500"
      case "past":
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "festival":
        return "bg-purple-500/10 text-purple-500"
      case "award-show":
        return "bg-yellow-500/10 text-yellow-500"
      case "premiere":
        return "bg-pink-500/10 text-pink-500"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="events">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Film Events</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Manage film festivals, award shows, and premieres</p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <Badge className={getEventTypeColor(event.type)} variant="secondary">
                          {event.type.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Badge className={getEventStatusColor(event.status)} variant="secondary">
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit size={16} className="mr-2" />
                              Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar size={16} className="mr-2" />
                              Manage Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trophy size={16} className="mr-2" />
                              Manage Awards
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash size={16} className="mr-2" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Film Awards</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Track nominations and winners across award events</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar size={16} />
                  2023
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  Add Award
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Search awards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Award</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Nominee</TableHead>
                    <TableHead>Movie</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAwards.map((award, index) => (
                    <motion.tr
                      key={award.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-medium">{award.name}</TableCell>
                      <TableCell>{award.category}</TableCell>
                      <TableCell>{award.event}</TableCell>
                      <TableCell>{award.nominee}</TableCell>
                      <TableCell>{award.movie}</TableCell>
                      <TableCell>
                        {award.winner ? (
                          <Badge className="bg-yellow-500/10 text-yellow-500">Winner</Badge>
                        ) : (
                          <Badge variant="outline">Nominee</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit size={16} className="mr-2" />
                              Edit Award
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trophy size={16} className="mr-2" />
                              {award.winner ? "Remove Winner Status" : "Mark as Winner"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash size={16} className="mr-2" />
                              Delete Award
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
