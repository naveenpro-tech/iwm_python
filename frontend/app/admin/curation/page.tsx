"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getMoviesForCuration, updateMovieCuration, type MovieCurationListResponse } from "@/lib/api/admin-curation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

const CURATION_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const SORT_OPTIONS = [
  { value: "curated_at", label: "Curation Date" },
  { value: "quality_score", label: "Quality Score" },
]

export default function MovieCurationPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [data, setData] = useState<MovieCurationListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [curationStatus, setCurationStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("curated_at")
  const [sortOrder, setSortOrder] = useState("desc")

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getMoviesForCuration({
          page,
          page_size: pageSize,
          curation_status: curationStatus === "all" ? null : curationStatus,
          sort_by: sortBy,
          sort_order: sortOrder,
        })
        
        setData(response)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load movies"
        setError(message)
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [page, pageSize, curationStatus, sortBy, sortOrder, toast])

  const getStatusBadgeColor = (status: string | null) => {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-800"
      case "pending_review":
        return "bg-yellow-200 text-yellow-800"
      case "approved":
        return "bg-green-200 text-green-800"
      case "rejected":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getQualityScoreColor = (score: number | null) => {
    if (!score) return "text-gray-500"
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Movie Curation Management</h1>
        <p className="text-gray-600 mt-2">Manage movie curation status, quality scores, and curator notes</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Curation Status</label>
            <select
              value={curationStatus || "all"}
              onChange={(e) => {
                setCurationStatus(e.target.value === "all" ? null : e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              {CURATION_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Items Per Page</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Movies Table */}
      {data && data.items.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Movie</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Quality Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Curator</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Curated At</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{movie.title}</p>
                        <p className="text-sm text-gray-500">{movie.year || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusBadgeColor(movie.curation.curation_status)}>
                        {movie.curation.curation_status || "Not Set"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${getQualityScoreColor(movie.curation.quality_score)}`}>
                        {movie.curation.quality_score !== null ? `${movie.curation.quality_score}/100` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {movie.curation.curated_by ? (
                          <>
                            <p className="font-medium">{movie.curation.curated_by.name}</p>
                            <p className="text-gray-500">{movie.curation.curated_by.email}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">Not curated</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {movie.curation.curated_at
                        ? new Date(movie.curation.curated_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/curation/${movie.id}`)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No movies found</p>
        </Card>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <Card className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.total)} of {data.total} movies
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {page} of {data.total_pages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(data.total_pages, page + 1))}
              disabled={page === data.total_pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

