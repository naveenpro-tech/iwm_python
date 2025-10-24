"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ExternalLink, Ban, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Critic {
  username: string
  name: string
  avatar: string
  verified: boolean
  followers: number
  reviewCount: number
  verifiedDate: string
  status: "active" | "suspended"
}

export default function AdminCriticsPage() {
  const { toast } = useToast()
  const [critics, setCritics] = useState<Critic[]>([])
  const [filteredCritics, setFilteredCritics] = useState<Critic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")

  useEffect(() => {
    // Mock data
    const mockCritics: Critic[] = [
      {
        username: "siddu",
        name: "Siddu Kumar",
        avatar: "/critic-avatar-1.png",
        verified: true,
        followers: 125000,
        reviewCount: 342,
        verifiedDate: "2024-01-15",
        status: "active",
      },
      {
        username: "rajesh_cinema",
        name: "Rajesh Menon",
        avatar: "/critic-avatar-2.png",
        verified: true,
        followers: 89000,
        reviewCount: 215,
        verifiedDate: "2024-03-20",
        status: "active",
      },
      {
        username: "priya_reviews",
        name: "Priya Sharma",
        avatar: "/critic-avatar-3.png",
        verified: true,
        followers: 67000,
        reviewCount: 178,
        verifiedDate: "2024-05-10",
        status: "active",
      },
      {
        username: "arjun_movies",
        name: "Arjun Patel",
        avatar: "/critic-avatar-4.png",
        verified: true,
        followers: 54000,
        reviewCount: 156,
        verifiedDate: "2024-06-25",
        status: "active",
      },
      {
        username: "neha_film",
        name: "Neha Kapoor",
        avatar: "/critic-avatar-5.png",
        verified: true,
        followers: 42000,
        reviewCount: 134,
        verifiedDate: "2024-08-05",
        status: "suspended",
      },
    ]

    setCritics(mockCritics)
    setFilteredCritics(mockCritics)
  }, [])

  useEffect(() => {
    let filtered = [...critics]

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCritics(filtered)
  }, [searchQuery, statusFilter, critics])

  const handleRevoke = (username: string) => {
    setCritics(
      critics.map((c) =>
        c.username === username ? { ...c, status: "suspended" as const } : c
      )
    )
    toast({ title: "Success", description: "Critic verification revoked" })
  }

  const handleRestore = (username: string) => {
    setCritics(
      critics.map((c) =>
        c.username === username ? { ...c, status: "active" as const } : c
      )
    )
    toast({ title: "Success", description: "Critic verification restored" })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const activeCount = critics.filter((c) => c.status === "active").length
  const suspendedCount = critics.filter((c) => c.status === "suspended").length

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
              key={critic.username}
              critic={critic}
              index={index}
              formatNumber={formatNumber}
              onRevoke={() => handleRevoke(critic.username)}
              onRestore={() => handleRestore(critic.username)}
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

function CriticRow({ critic, index, formatNumber, onRevoke, onRestore }: any) {
  const statusColors = {
    active: "text-green-500 bg-green-500/10 border-green-500/30",
    suspended: "text-red-500 bg-red-500/10 border-red-500/30",
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
                className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-[#00BFFF]"
                style={{ backgroundImage: `url(${critic.avatar})` }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#E0E0E0]">{critic.name}</h3>
                <p className="text-sm text-[#A0A0A0]">@{critic.username}</p>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                <div>{formatNumber(critic.followers)} followers</div>
                <div>{critic.reviewCount} reviews</div>
              </div>
              <div className="text-sm text-[#A0A0A0]">
                Verified: {new Date(critic.verifiedDate).toLocaleDateString()}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[critic.status]}`}>
                {critic.status.charAt(0).toUpperCase() + critic.status.slice(1)}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Link href={`/critic/${critic.username}`} target="_blank">
                <Button variant="outline" size="sm" className="border-[#3A3A3A] text-[#E0E0E0]">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              {critic.status === "active" ? (
                <Button onClick={onRevoke} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                  <Ban className="w-4 h-4 mr-2" />
                  Revoke
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

