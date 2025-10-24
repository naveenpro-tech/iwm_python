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
import { generateMockApplications, type CriticApplication } from "@/lib/critic/mock-applications"

export default function CriticApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<CriticApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<CriticApplication[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedApplication, setSelectedApplication] = useState<CriticApplication | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    const apps = generateMockApplications()
    setApplications(apps)
    setFilteredApplications(apps)
  }, [])

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

  const handleApprove = () => {
    if (!selectedApplication) return

    setApplications(
      applications.map((app) =>
        app.id === selectedApplication.id
          ? { ...app, status: "approved" as const, reviewedBy: "admin", reviewedDate: new Date().toISOString() }
          : app
      )
    )

    toast({ title: "Success", description: `${selectedApplication.fullName} has been approved as a verified critic` })
    setShowApproveModal(false)
    setSelectedApplication(null)
  }

  const handleReject = () => {
    if (!selectedApplication || !rejectionReason) {
      toast({ title: "Error", description: "Please provide a rejection reason", variant: "destructive" })
      return
    }

    setApplications(
      applications.map((app) =>
        app.id === selectedApplication.id
          ? {
              ...app,
              status: "rejected" as const,
              reviewedBy: "admin",
              reviewedDate: new Date().toISOString(),
              rejectionReason,
            }
          : app
      )
    )

    toast({ title: "Success", description: `Application rejected` })
    setShowRejectModal(false)
    setSelectedApplication(null)
    setRejectionReason("")
  }

  const pendingCount = applications.filter((a) => a.status === "pending").length
  const approvedCount = applications.filter((a) => a.status === "approved").length
  const rejectedCount = applications.filter((a) => a.status === "rejected").length

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
            <ConfirmModal
              title="Approve Application?"
              message={`Are you sure you want to approve ${selectedApplication.fullName} as a verified critic?`}
              confirmText="Approve"
              confirmColor="bg-[#00BFFF] hover:bg-[#00A3DD]"
              onConfirm={handleApprove}
              onCancel={() => setShowApproveModal(false)}
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
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${application.profilePicture})` }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#E0E0E0]">{application.fullName}</h3>
                <p className="text-sm text-[#A0A0A0]">@{application.username}</p>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                {new Date(application.appliedDate).toLocaleDateString()}
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
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${application.profilePicture})` }}
            />
            <div>
              <h3 className="text-xl font-bold text-[#E0E0E0]">{application.fullName}</h3>
              <p className="text-[#A0A0A0]">@{application.username}</p>
            </div>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Bio</Label>
            <p className="text-[#A0A0A0]">{application.bio}</p>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Social Media</Label>
            <div className="space-y-2">
              {application.youtubeUrl && (
                <a href={application.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  YouTube: {application.youtubeUrl}
                </a>
              )}
              {application.twitterUrl && (
                <a href={application.twitterUrl} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  Twitter: {application.twitterUrl}
                </a>
              )}
              {application.instagramUrl && (
                <a href={application.instagramUrl} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  Instagram: {application.instagramUrl}
                </a>
              )}
            </div>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Portfolio Links</Label>
            <div className="space-y-2">
              {application.portfolioLinks.map((link, i) => (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="block text-[#00BFFF] hover:underline">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[#E0E0E0] mb-2 block">Why Apply</Label>
            <p className="text-[#A0A0A0]">{application.whyApply}</p>
          </div>

          {application.status === "rejected" && application.rejectionReason && (
            <div>
              <Label className="text-red-500 mb-2 block">Rejection Reason</Label>
              <p className="text-[#A0A0A0]">{application.rejectionReason}</p>
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

function ConfirmModal({ title, message, confirmText, confirmColor, onConfirm, onCancel }: any) {
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
        <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">{title}</h3>
        <p className="text-[#A0A0A0] mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel} variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
            Cancel
          </Button>
          <Button onClick={onConfirm} className={confirmColor}>
            {confirmText}
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
          Provide a reason for rejecting {application.fullName}'s application:
        </p>
        <Textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
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

