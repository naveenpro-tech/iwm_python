"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { TalentProfile } from "../../types"

interface ProfileApplicationsProps {
  profile: TalentProfile
}

export function ProfileApplications({ profile }: ProfileApplicationsProps) {
  const [filter, setFilter] = useState<string>("all")

  // Filter applications based on status
  const filteredApplications =
    profile.applications?.filter((app) => {
      if (filter === "all") return true
      if (filter === "active") return ["applied", "under-review", "shortlisted"].includes(app.status)
      if (filter === "archived") return ["rejected", "archived"].includes(app.status)
      return app.status === filter
    }) || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-blue-500 text-white">Applied</Badge>
      case "under-review":
        return <Badge className="bg-yellow-500 text-black">Under Review</Badge>
      case "shortlisted":
        return <Badge className="bg-green-500 text-black">Shortlisted</Badge>
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-400">
            Rejected
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-400">
            Archived
          </Badge>
        )
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="w-5 h-5 text-blue-400" />
      case "under-review":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case "shortlisted":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "archived":
        return <Film className="w-5 h-5 text-gray-400" />
      default:
        return <Film className="w-5 h-5 text-gray-400" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="bg-[#282828] border-b border-[#3A3A3A] w-full justify-start rounded-none p-0">
          <TabsTrigger
            value="all"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            All Applications
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="shortlisted"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            Shortlisted
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#00BFFF] px-4 py-2"
          >
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredApplications.length > 0 ? (
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {filteredApplications.map((application) => (
                    <motion.div key={application.id} className="bg-[#1A1A1A] p-4 rounded-lg" variants={itemVariants}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#282828] rounded">{getStatusIcon(application.status)}</div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-medium">{application.castingCallTitle}</h3>
                              <p className="text-sm text-[#00BFFF]">{application.roleAppliedFor}</p>
                            </div>
                            {getStatusBadge(application.status)}
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-gray-400">
                            <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                            <span>Last Update: {new Date(application.lastUpdate).toLocaleDateString()}</span>
                          </div>

                          {application.messages && application.messages.length > 0 && (
                            <div className="mt-3 bg-[#282828] p-3 rounded border-l-2 border-[#00BFFF]">
                              <div className="flex items-center text-xs text-gray-400 mb-1">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                <span>Latest message from {application.messages[0].from}</span>
                              </div>
                              <p className="text-sm">{application.messages[0].content}</p>
                            </div>
                          )}

                          <div className="flex gap-2 mt-3">
                            <Link href={`/talent-hub/calls/${application.castingCallId}`}>
                              <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Casting Call
                              </Button>
                            </Link>

                            {application.messages && application.messages.length > 0 && (
                              <Button variant="outline" size="sm" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                View Messages
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">
                    {filter === "all"
                      ? "You haven't applied to any casting calls yet"
                      : `No ${filter} applications found`}
                  </p>
                  <Button className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black">Browse Opportunities</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
