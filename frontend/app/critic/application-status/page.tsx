"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getMyApplication } from "@/lib/api/critic-verification"
import type { CriticApplicationResponse } from "@/lib/api/critic-verification"

export default function ApplicationStatusPage() {
  const { toast } = useToast()
  const [application, setApplication] = useState<CriticApplicationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const app = await getMyApplication()
        setApplication(app)
      } catch (err: any) {
        console.error("Error fetching application:", err)
        setError(err.message || "Failed to load application status")
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplication()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#E0E0E0]">Loading application status...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/settings">
            <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
          <Card className="bg-[#1A1A1A] border-red-500/30">
            <CardContent className="pt-6">
              <p className="text-red-500">{error || "No application found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "#FFD700",
      title: "Application Pending",
      description: "Your application is under review. We'll notify you once a decision is made.",
    },
    approved: {
      icon: CheckCircle,
      color: "#00BFFF",
      title: "Application Approved",
      description: "Congratulations! You've been approved as a verified critic. You can now access all critic features.",
    },
    rejected: {
      icon: XCircle,
      color: "#FF6B6B",
      title: "Application Rejected",
      description: "Unfortunately, your application was not approved at this time.",
    },
  }

  const config = statusConfig[application.status as keyof typeof statusConfig]
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/settings">
          <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${config.color}20` }}>
                  <Icon className="w-8 h-8" style={{ color: config.color }} />
                </div>
                <div>
                  <CardTitle className="text-2xl text-[#E0E0E0]">{config.title}</CardTitle>
                  <p className="text-sm text-[#A0A0A0] mt-1">{config.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Application Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#A0A0A0]">Username</p>
                  <p className="text-lg text-[#E0E0E0] font-semibold">@{application.requested_username}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A0A0A0]">Display Name</p>
                  <p className="text-lg text-[#E0E0E0] font-semibold">{application.requested_display_name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A0A0A0]">Bio</p>
                  <p className="text-[#E0E0E0]">{application.bio}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-[#3A3A3A] pt-6">
                <p className="text-sm text-[#A0A0A0] mb-4">Timeline</p>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#00BFFF] mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-[#E0E0E0]">Application Submitted</p>
                      <p className="text-sm text-[#A0A0A0]">
                        {new Date(application.submitted_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {application.reviewed_at && (
                    <div className="flex gap-4">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: config.color }}
                      ></div>
                      <div>
                        <p className="text-[#E0E0E0]">
                          {application.status === "approved" ? "Application Approved" : "Application Reviewed"}
                        </p>
                        <p className="text-sm text-[#A0A0A0]">
                          {new Date(application.reviewed_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              {application.admin_notes && (
                <div className="border-t border-[#3A3A3A] pt-6">
                  <p className="text-sm text-[#A0A0A0] mb-2">Admin Notes</p>
                  <p className="text-[#E0E0E0]">{application.admin_notes}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {application.status === "rejected" && application.rejection_reason && (
                <div className="border-t border-[#3A3A3A] pt-6 bg-red-500/10 border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-400 mb-2">Rejection Reason</p>
                  <p className="text-[#E0E0E0]">{application.rejection_reason}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-[#3A3A3A] pt-6 flex gap-3">
                {application.status === "approved" && (
                  <Link href="/critic/dashboard" className="flex-1">
                    <Button className="w-full bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
                      Go to Critic Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/settings" className="flex-1">
                  <Button variant="outline" className="w-full border-[#3A3A3A] text-[#E0E0E0]">
                    Back to Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

