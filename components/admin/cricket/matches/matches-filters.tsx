"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export function MatchesFilters() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-1 gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search matches..." className="pl-8" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="match-type">Match Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="match-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="odi">ODI</SelectItem>
                    <SelectItem value="t20">T20</SelectItem>
                    <SelectItem value="t10">T10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="series">Series</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="series">
                    <SelectValue placeholder="All Series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    <SelectItem value="ipl-2023">IPL 2023</SelectItem>
                    <SelectItem value="ind-aus-2023">India vs Australia</SelectItem>
                    <SelectItem value="eng-wi-2023">England vs West Indies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="team">Team</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="team">
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="england">England</SelectItem>
                    <SelectItem value="west-indies">West Indies</SelectItem>
                    <SelectItem value="csk">Chennai Super Kings</SelectItem>
                    <SelectItem value="mi">Mumbai Indians</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
