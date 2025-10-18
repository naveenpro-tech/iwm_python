"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function SocialMediaTab({ id }: { id: string }) {
  // Sample data for social media profiles
  const socialMediaProfiles = [
    {
      id: "social-001",
      platform: "Twitter",
      username: "@anuragkashyap72",
      url: "https://twitter.com/anuragkashyap72",
      followers: "1.2M",
      status: "pending",
      icon: Twitter,
      color: "text-blue-400",
    },
    {
      id: "social-002",
      platform: "Instagram",
      username: "@anuragkashyap10",
      url: "https://instagram.com/anuragkashyap10",
      followers: "950K",
      status: "pending",
      icon: Instagram,
      color: "text-pink-500",
    },
    {
      id: "social-003",
      platform: "Facebook",
      username: "Anurag Kashyap",
      url: "https://facebook.com/anuragkashyap",
      followers: "2.5M",
      status: "pending",
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      id: "social-004",
      platform: "LinkedIn",
      username: "Anurag Kashyap",
      url: "https://linkedin.com/in/anuragkashyap",
      followers: "50K",
      status: "pending",
      icon: Linkedin,
      color: "text-blue-500",
    },
    {
      id: "social-005",
      platform: "YouTube",
      username: "Anurag Kashyap Official",
      url: "https://youtube.com/c/anuragkashyapofficial",
      followers: "200K",
      status: "pending",
      icon: Youtube,
      color: "text-red-500",
    },
  ]

  const [profiles, setProfiles] = useState(socialMediaProfiles)

  const handleStatusChange = (id: string, newStatus: string) => {
    setProfiles(profiles.map((profile) => (profile.id === id ? { ...profile, status: newStatus } : profile)))
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
    <div className="space-y-4 mt-6">
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-card ${profile.color}`}>
                    <profile.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{profile.platform}</div>
                    <div className="text-sm text-muted-foreground">
                      {profile.username} • {profile.followers} followers
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(profile.status)}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                      onClick={() => handleStatusChange(profile.id, "approved")}
                      title="Approve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleStatusChange(profile.id, "rejected")}
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="h-8 w-8" title="Visit Profile">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
