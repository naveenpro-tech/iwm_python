"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Calendar,
  MapPin,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for casting calls
const castingCalls = [
  {
    id: 1,
    title: "Lead Role in 'Desert Storm'",
    company: "Dharma Productions",
    projectType: "Feature Film",
    location: "Mumbai, India",
    status: "active",
    applicants: 24,
    deadline: "Jun 30, 2023",
    posted: "May 15, 2023",
    compensation: "Paid",
  },
  {
    id: 2,
    title: "Supporting Cast for 'Midnight Mystery'",
    company: "Red Chillies Entertainment",
    projectType: "Feature Film",
    location: "Delhi, India",
    status: "active",
    applicants: 18,
    deadline: "Jul 15, 2023",
    posted: "May 22, 2023",
    compensation: "Paid",
  },
  {
    id: 3,
    title: "Voice Actor for Animated Feature",
    company: "Yash Raj Films",
    projectType: "Animation",
    location: "Remote",
    status: "review",
    applicants: 7,
    deadline: "Aug 05, 2023",
    posted: "May 10, 2023",
    compensation: "Paid",
  },
  {
    id: 4,
    title: "Extras for Period Drama",
    company: "Excel Entertainment",
    projectType: "TV Series",
    location: "Jaipur, India",
    status: "flagged",
    applicants: 32,
    deadline: "Jun 25, 2023",
    posted: "May 05, 2023",
    compensation: "Paid",
  },
  {
    id: 5,
    title: "Lead Actress for Romantic Comedy",
    company: "Karan Johar Productions",
    projectType: "Feature Film",
    location: "Mumbai, India",
    status: "active",
    applicants: 41,
    deadline: "Jul 10, 2023",
    posted: "May 18, 2023",
    compensation: "Paid",
  },
  {
    id: 6,
    title: "Child Actor for Family Drama",
    company: "Rajkumar Hirani Films",
    projectType: "Feature Film",
    location: "Pune, India",
    status: "active",
    applicants: 15,
    deadline: "Jul 20, 2023",
    posted: "May 25, 2023",
    compensation: "Paid",
  },
  {
    id: 7,
    title: "Dancers for Music Video",
    company: "T-Series",
    projectType: "Music Video",
    location: "Mumbai, India",
    status: "active",
    applicants: 56,
    deadline: "Jun 15, 2023",
    posted: "May 01, 2023",
    compensation: "Paid",
  },
  {
    id: 8,
    title: "Character Actor for Web Series",
    company: "Amazon Prime India",
    projectType: "Web Series",
    location: "Hyderabad, India",
    status: "closed",
    applicants: 22,
    deadline: "May 30, 2023",
    posted: "Apr 15, 2023",
    compensation: "Paid",
  },
  {
    id: 9,
    title: "Stunt Performers for Action Film",
    company: "YRF Action",
    projectType: "Feature Film",
    location: "Mumbai, India",
    status: "active",
    applicants: 19,
    deadline: "Jul 05, 2023",
    posted: "May 20, 2023",
    compensation: "Paid",
  },
  {
    id: 10,
    title: "Background Actors for Historical Drama",
    company: "Bhansali Productions",
    projectType: "Feature Film",
    location: "Udaipur, India",
    status: "review",
    applicants: 48,
    deadline: "Jun 28, 2023",
    posted: "May 12, 2023",
    compensation: "Paid",
  },
]

export function CastingCallsTable() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState("10")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
            <span className="font-medium">76</span> casting calls
          </div>
        </div>

        <div className="rounded-md border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
              <div className="col-span-4">Casting Call</div>
              <div className="col-span-2">Project Type</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Applicants</div>
              <div className="col-span-1">Deadline</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          <div className="divide-y">
            {castingCalls.map((call) => (
              <div key={call.id} className="px-4 py-3">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <p className="font-medium">{call.title}</p>
                    <p className="text-sm text-muted-foreground">{call.company}</p>
                  </div>
                  <div className="col-span-2 text-sm">{call.projectType}</div>
                  <div className="col-span-2 text-sm flex items-center">
                    <MapPin size={14} className="mr-1 text-muted-foreground" />
                    {call.location}
                  </div>
                  <div className="col-span-1">
                    {call.status === "active" && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 size={12} className="mr-1" /> Active
                      </Badge>
                    )}
                    {call.status === "review" && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <Clock size={12} className="mr-1" /> Review
                      </Badge>
                    )}
                    {call.status === "flagged" && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <AlertCircle size={12} className="mr-1" /> Flagged
                      </Badge>
                    )}
                    {call.status === "closed" && (
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                        <X size={12} className="mr-1" /> Closed
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-1 text-sm flex items-center">
                    <Users size={14} className="mr-1 text-muted-foreground" />
                    {call.applicants}
                  </div>
                  <div className="col-span-1 text-sm flex items-center">
                    <Calendar size={14} className="mr-1 text-muted-foreground" />
                    {call.deadline}
                  </div>
                  <div className="col-span-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Casting Call</DropdownMenuItem>
                        <DropdownMenuItem>View Applicants</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {call.status === "active" ? (
                          <DropdownMenuItem>Close Casting Call</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Reactivate Call</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-500">Flag as Inappropriate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Page {page} of 8</div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            <Button variant="outline" size="icon" disabled={page === 8} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === 8} onClick={() => setPage(8)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
