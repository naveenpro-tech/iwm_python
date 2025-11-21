"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

// Mock data for talent profiles
const talentProfiles = [
  {
    id: 1,
    name: "Arjun Kapoor",
    role: "Actor",
    location: "Mumbai, India",
    status: "verified",
    avatar: "/rajkummar-rao-portrait.png",
    created: "May 15, 2023",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Actress",
    location: "Delhi, India",
    status: "pending",
    avatar: "/user-avatar-5.png",
    created: "Jun 22, 2023",
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Director",
    location: "Bangalore, India",
    status: "verified",
    avatar: "/user-avatar-6.png",
    created: "Apr 10, 2023",
  },
  {
    id: 4,
    name: "Meera Desai",
    role: "Cinematographer",
    location: "Chennai, India",
    status: "flagged",
    avatar: "/user-avatar-7.png",
    created: "Jul 05, 2023",
  },
  {
    id: 5,
    name: "Rahul Khanna",
    role: "Producer",
    location: "Mumbai, India",
    status: "verified",
    avatar: "/user-avatar-8.png",
    created: "Mar 18, 2023",
  },
  {
    id: 6,
    name: "Ananya Patel",
    role: "Screenwriter",
    location: "Pune, India",
    status: "pending",
    avatar: "/user-avatar-9.png",
    created: "Aug 30, 2023",
  },
  {
    id: 7,
    name: "Karan Malhotra",
    role: "Actor",
    location: "Hyderabad, India",
    status: "verified",
    avatar: "/user-avatar-1.png",
    created: "Feb 12, 2023",
  },
  {
    id: 8,
    name: "Neha Gupta",
    role: "Actress",
    location: "Kolkata, India",
    status: "rejected",
    avatar: "/user-avatar-2.png",
    created: "Sep 08, 2023",
  },
  {
    id: 9,
    name: "Sanjay Mehta",
    role: "Director",
    location: "Delhi, India",
    status: "verified",
    avatar: "/user-avatar-3.png",
    created: "Jan 25, 2023",
  },
  {
    id: 10,
    name: "Pooja Reddy",
    role: "Sound Designer",
    location: "Bangalore, India",
    status: "pending",
    avatar: "/user-avatar-4.png",
    created: "Oct 14, 2023",
  },
]

export function TalentProfilesTable() {
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
            <span className="font-medium">42</span> profiles
          </div>
        </div>

        <div className="rounded-md border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
              <div className="col-span-5">Profile</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          <div className="divide-y">
            {talentProfiles.map((profile) => (
              <div key={profile.id} className="px-4 py-3">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                      <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm">{profile.location}</div>
                  <div className="col-span-2">
                    {profile.status === "verified" && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 size={12} className="mr-1" /> Verified
                      </Badge>
                    )}
                    {profile.status === "pending" && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <Clock size={12} className="mr-1" /> Pending
                      </Badge>
                    )}
                    {profile.status === "flagged" && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <AlertCircle size={12} className="mr-1" /> Flagged
                      </Badge>
                    )}
                    {profile.status === "rejected" && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <AlertCircle size={12} className="mr-1" /> Rejected
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2 text-sm">{profile.created}</div>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>Verify Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Flag Profile</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Page {page} of 5</div>
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
            <Button variant="outline" size="icon" disabled={page === 5} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === 5} onClick={() => setPage(5)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
