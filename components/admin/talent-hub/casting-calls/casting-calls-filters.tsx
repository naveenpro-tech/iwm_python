"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, X, Filter, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const projectTypes = [
  { id: "feature", label: "Feature Film" },
  { id: "short", label: "Short Film" },
  { id: "tv", label: "TV Series" },
  { id: "web", label: "Web Series" },
  { id: "commercial", label: "Commercial" },
  { id: "music", label: "Music Video" },
  { id: "documentary", label: "Documentary" },
  { id: "theater", label: "Theater" },
]

const locations = [
  { id: "mumbai", label: "Mumbai" },
  { id: "delhi", label: "Delhi" },
  { id: "bangalore", label: "Bangalore" },
  { id: "chennai", label: "Chennai" },
  { id: "kolkata", label: "Kolkata" },
  { id: "hyderabad", label: "Hyderabad" },
  { id: "pune", label: "Pune" },
  { id: "remote", label: "Remote" },
  { id: "international", label: "International" },
]

const callStatuses = [
  {
    id: "active",
    label: "Active",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  { id: "review", label: "Under Review", icon: Clock, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "closed", label: "Closed", icon: X, color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  { id: "flagged", label: "Flagged", icon: AlertCircle, color: "bg-red-500/10 text-red-500 border-red-500/20" },
]

export function CastingCallsFilters() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <>
      <div className="md:hidden mb-4">
        <Button variant="outline" className="w-full" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <Card className={`${mobileFiltersOpen ? "block" : "hidden"} md:block`}>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Filters</h3>

          <Accordion type="multiple" defaultValue={["status", "project", "location"]}>
            <AccordionItem value="status" className="border-b">
              <AccordionTrigger className="py-3">Status</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {callStatuses.map((status) => (
                    <div key={status.id} className="flex items-center gap-2">
                      <Checkbox id={`status-${status.id}`} />
                      <Label htmlFor={`status-${status.id}`} className="flex items-center gap-2 cursor-pointer">
                        <Badge variant="outline" className={status.color}>
                          <status.icon size={12} className="mr-1" /> {status.label}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="project" className="border-b">
              <AccordionTrigger className="py-3">Project Type</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {projectTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                      <Checkbox id={`type-${type.id}`} />
                      <Label htmlFor={`type-${type.id}`} className="cursor-pointer text-sm">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location" className="border-b">
              <AccordionTrigger className="py-3">Location</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center gap-2">
                      <Checkbox id={`location-${location.id}`} />
                      <Label htmlFor={`location-${location.id}`} className="cursor-pointer text-sm">
                        {location.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="date" className="border-b">
              <AccordionTrigger className="py-3">Date Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="date-from">From</Label>
                    <Input id="date-from" type="date" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="date-to">To</Label>
                    <Input id="date-to" type="date" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="compensation" className="border-b">
              <AccordionTrigger className="py-3">Compensation</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox id="paid" />
                    <Label htmlFor="paid" className="cursor-pointer text-sm">
                      Paid
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="unpaid" />
                    <Label htmlFor="unpaid" className="cursor-pointer text-sm">
                      Unpaid
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="revenue" />
                    <Label htmlFor="revenue" className="cursor-pointer text-sm">
                      Revenue Share
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sort" className="border-b">
              <AccordionTrigger className="py-3">Sort By</AccordionTrigger>
              <AccordionContent>
                <Select defaultValue="newest">
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="applicants-high">Most Applicants</SelectItem>
                    <SelectItem value="applicants-low">Fewest Applicants</SelectItem>
                    <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button className="w-full mt-4">Apply Filters</Button>
        </CardContent>
      </Card>
    </>
  )
}
