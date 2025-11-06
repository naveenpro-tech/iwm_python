"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPut } from "@/lib/api-client"

interface CriticApplication {
  id: number
  user_id: number
  requested_username: string
  requested_display_name: string
  bio: string
  youtube_url?: string
  twitter_url?: string
  instagram_url?: string
  website_url?: string
  portfolio_links: string[]
  why_apply: string
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: number
  admin_notes?: string
  rejection_reason?: string
}

export default function CriticApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<CriticApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<CriticApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedApplication, setSelectedApplication] = useState<CriticApplication | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    try {
      const data = await apiGet<CriticApplication[]>("/api/v1/critic-verification/admin/applications")
      setApplications(data)
      setFilteredApplications(data)
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...applications]

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredApplications(filtered)
  }, [searchQuery, statusFilter, applications])

  const handleApprove = async () => {
    if (!selectedApplication) return

    try {
      await apiPut(`/api/v1/critic-verification/admin/applications/${selectedApplication.id}`, {
        status: "approved",
        admin_notes: adminNotes,
      })

      toast({
        title: "Success",
        description: `${selectedApplication.requested_display_name} has been approved as a verified critic`
      })

      setShowApproveModal(false)
      setSelectedApplication(null)
      setAdminNotes("")

      // Refresh applications
      await fetchApplications()
    } catch (error) {
      console.error("Failed to approve application:", error)
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason) {
      toast({ title: "Error", description: "Please provide a rejection reason", variant: "destructive" })
      return
    }

    try {
      await apiPut(`/api/v1/critic-verification/admin/applications/${selectedApplication.id}`, {
        status: "rejected",
        rejection_reason: rejectionReason,
        admin_notes: adminNotes,
      })

      toast({ title: "Success", description: `Application rejected` })

      setShowRejectModal(false)
      setSelectedApplication(null)
      setRejectionReason("")
      setAdminNotes("")

      // Refresh applications
      await fetchApplications()
    } catch (error) {
      console.error("Failed to reject application:", error)
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      })
    }
  }

  const pendingCount = applications.filter((a) => a.status === "pending").length
  const approvedCount = applications.filter((a) => a.status === "approved").length
  const rejectedCount = applications.filter((a) => a.status === "rejected").length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#E0E0E0] text-xl">Loading applications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-2">Critic Applications</h1>
          <p className="text-[#A0A0A0]">Review and manage critic verification requests</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard label="Pending" value={pendingCount} color="#FFD700" />
          <StatsCard label="Approved" value={approvedCount} color="#00BFFF" />
          <StatsCard label="Rejected" value={rejectedCount} color="#FF6B6B" />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="pl-10 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
            />
          </div>
          <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger className="w-full md:w-48 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Applications Table */}
        <div className="space-y-4">
          {filteredApplications.map((app, index) => (
            <ApplicationRow
              key={app.id}
              application={app}
              index={index}
              onView={() => setSelectedApplication(app)}
              onApprove={() => {
                setSelectedApplication(app)
                setShowApproveModal(true)
              }}
              onReject={() => {
                setSelectedApplication(app)
                setShowRejectModal(true)
              }}
            />
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-[#A0A0A0]">No applications found</p>
          </div>
        )}

        {/* View Application Modal */}
        <AnimatePresence>
          {selectedApplication && !showApproveModal && !showRejectModal && (
            <ApplicationModal application={selectedApplication} onClose={() => setSelectedApplication(null)} />
          )}
        </AnimatePresence>

        {/* Approve Modal */}
        <AnimatePresence>
          {showApproveModal && selectedApplication && (
            <ApproveModal
              application={selectedApplication}
              adminNotes={adminNotes}
              setAdminNotes={setAdminNotes}
              onConfirm={handleApprove}
              onCancel={() => {
                setShowApproveModal(false)
                setAdminNotes("")
              }}
            />
          )}
        </AnimatePresence>

        {/* Reject Modal */}
        <AnimatePresence>
          {showRejectModal && selectedApplication && (
            <RejectModal
              application={selectedApplication}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              onConfirm={handleReject}
              onCancel={() => {
                setShowRejectModal(false)
                setRejectionReason("")
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StatsCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
    >
      <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A0A0A0]">{label}</p>
              <p className="text-3xl font-bold text-[#E0E0E0]">{value}</p>
            </div>
            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: `${color}20` }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ApplicationRow({ application, index, onView, onApprove, onReject }: any) {
  const statusColors = {
    pending: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
    approved: "text-green-500 bg-green-500/10 border-green-500/30",
    rejected: "text-red-500 bg-red-500/10 border-red-500/30",
  }

  // Generate initials for avatar fallback
  const initials = application.requested_display_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
    >
      <Card className="bg-[#1A1A1A] border-[#3A3A3A] hover:border-[#00BFFF] transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#00BFFF] flex items-center justify-center text-[#1A1A1A] font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#E0E0E0]">{application.requested_display_name}</h3>
                <p className="text-sm text-[#A0A0A0]">@{application.requested_username}</p>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                {new Date(application.submitted_at).toLocaleDateString()}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[application.status]}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button onClick={onView} variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0]">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              {application.status === "pending" && (
                <>
                  <Button onClick={onApprove} size="sm" className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button onClick={onReject} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ApplicationModal({ application, onClose }: { application: CriticApplication; onClose: () => void }) {
  const initials = application.requested_display_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6">Application Details</h2>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#00BFFF] flex items-center justify-center text-[#1A1A1A] font-bold text-2xl">
              {initials}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#E0E0E0]">{application.requested_display_name}</h3>
              <p className="text-[#A0A0A0]">@{application.requested_username}</p>
            </div>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Bio</Label>
            <p className="text-[#A0A0A0]">{application.bio}</p>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Social Media</Label>
            <div className="space-y-2">
              {application.youtube_url && (
                <a href={application.youtube_url} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  YouTube: {application.youtube_url}
                </a>
              )}
              {application.twitter_url && (
                <a href={application.twitter_url} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  Twitter: {application.twitter_url}
                </a>
              )}
              {application.instagram_url && (
                <a href={application.instagram_url} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  Instagram: {application.instagram_url}
                </a>
              )}
              {application.website_url && (
                <a href={application.website_url} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  Website: {application.website_url}
                </a>
              )}
            </div>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Portfolio Links</Label>
            <div className="space-y-2">
              {application.portfolio_links.map((link, i) => (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Why Apply</Label>
            <p className="text-[#A0A0A0]">{application.why_apply}</p>
          </div>

          {application.admin_notes && (
            <div>
              <Label className="text-[#00BFFF] mb-2 block">Admin Notes</Label>
              <p className="text-[#A0A0A0]">{application.admin_notes}</p>
            </div>
          )}

          {application.status === "rejected" && application.rejection_reason && (
            <div>
              <Label className="text-red-500 mb-2 block">Rejection Reason</Label>
              <p className="text-[#A0A0A0]">{application.rejection_reason}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ApproveModal({ application, adminNotes, setAdminNotes, onConfirm, onCancel }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6 max-w-md"
      >
        <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">Approve Application</h3>
        <p className="text-[#A0A0A0] mb-4">
          Approve {application.requested_display_name} as a verified critic?
        </p>
        <div className="mb-4">
          <Label className="text-[#E0E0E0] mb-2 block">Admin Notes (Optional)</Label>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal notes about this approval..."
            rows={3}
            className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel} variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
            Approve
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function RejectModal({ application, rejectionReason, setRejectionReason, onConfirm, onCancel }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6 max-w-md"
      >
        <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">Reject Application</h3>
        <p className="text-[#A0A0A0] mb-4">
          Provide a reason for rejecting {application.requested_display_name}'s application:
        </p>
        <Textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason (will be sent to applicant)..."
          rows={4}
          className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel} variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
            Reject
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

