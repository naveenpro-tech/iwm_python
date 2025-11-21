"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ExternalLink, Ban, CheckCircle, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPost } from "@/lib/api-client"

interface Critic {
  id: number
  external_id: string
  user_id: number
  username: string
  display_name: string
  bio?: string
  avatar_url?: string
  is_verified: boolean
  verification_level?: string
  follower_count: number
  review_count: number
  created_at: string
  is_active: boolean
}

export default function AdminCriticsPage() {
  const { toast } = useToast()
  const [critics, setCritics] = useState<Critic[]>([])
  const [filteredCritics, setFilteredCritics] = useState<Critic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")

  useEffect(() => {
    fetchCritics()
  }, [])

  async function fetchCritics() {
    try {
      const data = await apiGet<Critic[]>("/api/v1/critics?limit=100")
      setCritics(data)
      setFilteredCritics(data)
    } catch (error) {
      console.error("Failed to fetch critics:", error)
      toast({
        title: "Error",
        description: "Failed to load critics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...critics]

    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter((c) => c.is_active === isActive)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCritics(filtered)
  }, [searchQuery, statusFilter, critics])

  const handleSuspend = async (criticId: number, username: string) => {
    try {
      // Call backend API to suspend critic
      await apiPost(`/api/v1/critics/${criticId}/suspend`, {})

      // Update local state
      setCritics(
        critics.map((c) =>
          c.id === criticId ? { ...c, is_active: false } : c
        )
      )

      toast({ title: "Success", description: `Critic @${username} has been suspended` })
    } catch (error) {
      console.error("Failed to suspend critic:", error)
      toast({
        title: "Error",
        description: "Failed to suspend critic",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async (criticId: number, username: string) => {
    try {
      // Call backend API to activate critic
      await apiPost(`/api/v1/critics/${criticId}/activate`, {})

      // Update local state
      setCritics(
        critics.map((c) =>
          c.id === criticId ? { ...c, is_active: true } : c
        )
      )

      toast({ title: "Success", description: `Critic @${username} has been restored` })
    } catch (error) {
      console.error("Failed to restore critic:", error)
      toast({
        title: "Error",
        description: "Failed to restore critic",
        variant: "destructive",
      })
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const activeCount = critics.filter((c) => c.is_active).length
  const suspendedCount = critics.filter((c) => !c.is_active).length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#E0E0E0] text-xl">Loading critics...</div>
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
          <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-2">Verified Critics Management</h1>
          <p className="text-[#A0A0A0]">Manage verified critics and their status</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard label="Total Critics" value={critics.length} color="#00BFFF" />
          <StatsCard label="Active" value={activeCount} color="#00FF00" />
          <StatsCard label="Suspended" value={suspendedCount} color="#FF6B6B" />
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Critics Table */}
        <div className="space-y-4">
          {filteredCritics.map((critic, index) => (
            <CriticRow
              key={critic.id}
              critic={critic}
              index={index}
              formatNumber={formatNumber}
              onSuspend={() => handleSuspend(critic.id, critic.username)}
              onRestore={() => handleRestore(critic.id, critic.username)}
            />
          ))}
        </div>

        {filteredCritics.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-[#A0A0A0]">No critics found</p>
          </div>
        )}
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

function CriticRow({ critic, index, formatNumber, onSuspend, onRestore }: any) {
  const statusColors = {
    active: "text-green-500 bg-green-500/10 border-green-500/30",
    suspended: "text-red-500 bg-red-500/10 border-red-500/30",
  }

  const status = critic.is_active ? "active" : "suspended"
  const initials = critic.display_name
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
              {critic.avatar_url ? (
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-[#00BFFF]"
                  style={{ backgroundImage: `url(${critic.avatar_url})` }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#00BFFF] flex items-center justify-center text-[#1A1A1A] font-bold border-2 border-[#00BFFF]">
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#E0E0E0]">{critic.display_name}</h3>
                  {critic.is_verified && (
                    <CheckCircle className="w-5 h-5 text-[#00BFFF]" />
                  )}
                </div>
                <p className="text-sm text-[#A0A0A0]">@{critic.username}</p>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                <div>{formatNumber(critic.follower_count)} followers</div>
                <div>{critic.review_count} reviews</div>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                Joined: {new Date(critic.created_at).toLocaleDateString()}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Link href={`/critic/${critic.username}`} target="_blank">
                <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0]">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              {critic.is_active ? (
                <Button onClick={onSuspend} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend
                </Button>
              ) : (
                <Button onClick={onRestore} size="sm" className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
                  Restore
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

