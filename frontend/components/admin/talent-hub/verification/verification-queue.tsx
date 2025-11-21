"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Flag, ExternalLink, Clock, Calendar, MapPin } from "lucide-react"

// Mock data for verification queue
const verificationQueue = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Actress",
    location: "Delhi, India",
    avatar: "/user-avatar-5.png",
    waiting: "2 days",
    submitted: "May 23, 2023",
    documents: ["ID Proof", "Portfolio", "Experience Certificate"],
    socialLinks: ["Instagram", "IMDb"],
  },
  {
    id: 2,
    name: "Rahul Khanna",
    role: "Director",
    location: "Mumbai, India",
    avatar: "/user-avatar-6.png",
    waiting: "3 days",
    submitted: "May 22, 2023",
    documents: ["ID Proof", "Portfolio", "Previous Work Samples"],
    socialLinks: ["Instagram", "Twitter", "LinkedIn", "IMDb"],
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Screenwriter",
    location: "Pune, India",
    avatar: "/user-avatar-7.png",
    waiting: "4 days",
    submitted: "May 21, 2023",
    documents: ["ID Proof", "Portfolio", "Writing Samples"],
    socialLinks: ["LinkedIn", "Personal Website"],
  },
  {
    id: 4,
    name: "Vikram Malhotra",
    role: "Cinematographer",
    location: "Bangalore, India",
    avatar: "/user-avatar-8.png",
    waiting: "5 days",
    submitted: "May 20, 2023",
    documents: ["ID Proof", "Portfolio", "Showreel"],
    socialLinks: ["Instagram", "Vimeo", "IMDb"],
  },
  {
    id: 5,
    name: "Neha Gupta",
    role: "Production Designer",
    location: "Chennai, India",
    avatar: "/user-avatar-9.png",
    waiting: "6 days",
    submitted: "May 19, 2023",
    documents: ["ID Proof", "Portfolio", "Previous Work Samples"],
    socialLinks: ["Instagram", "LinkedIn", "Behance"],
  },
]

export function VerificationQueue() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Queue</CardTitle>
        <CardDescription>Review and verify talent profiles awaiting approval</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All ({verificationQueue.length})</TabsTrigger>
            <TabsTrigger value="actors">Actors (2)</TabsTrigger>
            <TabsTrigger value="directors">Directors (1)</TabsTrigger>
            <TabsTrigger value="crew">Crew (2)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {verificationQueue.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-16 w-16 border border-border">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-lg">{profile.name}</h3>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    <Clock size={12} className="mr-1" /> Waiting {profile.waiting}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{profile.role}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Submitted {profile.submitted}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.documents.map((doc, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <Button variant="outline" size="sm" className="h-9">
                  <ExternalLink size={14} className="mr-1.5" />
                  View Profile
                </Button>
                <Button variant="default" size="sm" className="h-9 bg-green-600 hover:bg-green-700">
                  <CheckCircle size={14} className="mr-1.5" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <XCircle size={14} className="mr-1.5" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                >
                  <Flag size={14} className="mr-1.5" />
                  Flag
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          Load More
        </Button>
      </CardContent>
    </Card>
  )
}
