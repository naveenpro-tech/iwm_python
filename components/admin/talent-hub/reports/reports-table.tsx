"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UserX,
  FileX,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for reports
const reports = [
  {
    id: 1,
    type: "profile",
    subject: "Fake profile claiming to be Aamir Khan",
    reportedItem: "Aamir Khan (Fake)",
    avatar: "/user-avatar-1.png",
    reason: "Impersonation",
    status: "pending",
    reportedBy: "User123",
    reportedOn: "May 24, 2023",
  },
  {
    id: 2,
    type: "casting",
    subject: "Suspicious Bollywood Feature Film",
    reportedItem: "Lead Role in Untitled Project",
    avatar: "/sci-fi-film-set-spaceship.png",
    reason: "Scam/Fraud",
    status: "pending",
    reportedBy: "User456",
    reportedOn: "May 23, 2023",
  },
  {
    id: 3,
    type: "profile",
    subject: "Inappropriate content in profile",
    reportedItem: "John Smith",
    avatar: "/user-avatar-3.png",
    reason: "Inappropriate Content",
    status: "pending",
    reportedBy: "User789",
    reportedOn: "May 22, 2023",
  },
  {
    id: 4,
    type: "casting",
    subject: "Misleading compensation details",
    reportedItem: "Background Actors for Historical Drama",
    avatar: "/period-drama-poster.png",
    reason: "Misleading Information",
    status: "resolved",
    reportedBy: "User101",
    reportedOn: "May 21, 2023",
  },
  {
    id: 5,
    type: "profile",
    subject: "Stolen portfolio images",
    reportedItem: "Deepak Verma",
    avatar: "/user-avatar-5.png",
    reason: "Copyright Violation",
    status: "pending",
    reportedBy: "User202",
    reportedOn: "May 20, 2023",
  },
  {
    id: 6,
    type: "profile",
    subject: "Harassing messages to applicants",
    reportedItem: "Raj Malhotra",
    avatar: "/user-avatar-6.png",
    reason: "Harassment",
    status: "pending",
    reportedBy: "User303",
    reportedOn: "May 19, 2023",
  },
  {
    id: 7,
    type: "casting",
    subject: "Suspicious audition location",
    reportedItem: "Supporting Role in 'Midnight Mystery'",
    avatar: "/dark-alley-street-art.png",
    reason: "Safety Concern",
    status: "pending",
    reportedBy: "User404",
    reportedOn: "May 18, 2023",
  },
  {
    id: 8,
    type: "casting",
    subject: "Requesting payment for audition",
    reportedItem: "Dancers for Music Video",
    avatar: "/rajasthani-musicians.png",
    reason: "Scam/Fraud",
    status: "resolved",
    reportedBy: "User505",
    reportedOn: "May 17, 2023",
  },
]

export function ReportsTable() {
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [perPage, setPerPage] = useState("10")

  const filteredReports = activeTab === "all" ? reports : reports.filter((report) => report.type === activeTab)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported Content</CardTitle>
        <CardDescription>Review and moderate reported profiles and casting calls</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="profile">Profile Reports</TabsTrigger>
            <TabsTrigger value="casting">Casting Call Reports</TabsTrigger>
          </TabsList>
        </Tabs>

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
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredReports.length}</span> of{" "}
            <span className="font-medium">{filteredReports.length}</span> reports
          </div>
        </div>

        <div className="rounded-md border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
              <div className="col-span-4">Report</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Reason</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Action</div>
            </div>
          </div>

          <div className="divide-y">
            {filteredReports.map((report) => (
              <div key={report.id} className="px-4 py-3">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={report.avatar || "/placeholder.svg"} alt={report.reportedItem} />
                      <AvatarFallback>{report.reportedItem.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{report.reportedItem}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">{report.subject}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {report.type === "profile" ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <UserX size={12} className="mr-1" /> Profile
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        <FileX size={12} className="mr-1" /> Casting Call
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2 text-sm">{report.reason}</div>
                  <div className="col-span-2 text-sm">{report.reportedOn}</div>
                  <div className="col-span-2 flex justify-end gap-1">
                    <Button variant="outline" size="sm" className="h-8">
                      <ExternalLink size={14} className="mr-1" />
                      View
                    </Button>
                    {report.status === "pending" ? (
                      <Button variant="default" size="sm" className="h-8">
                        <CheckCircle size={14} className="mr-1" />
                        Resolve
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="h-8" disabled>
                        <CheckCircle size={14} className="mr-1" />
                        Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Page {page} of 1</div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon">
              1
            </Button>
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(1)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
