"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getMoviesForCuration, updateMovieCuration, type MovieCurationResponse } from "@/lib/api/admin-curation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react"

const CURATION_STATUSES = ["draft", "pending_review", "approved", "rejected"]

export default function MovieCurationEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const movieId = Number(params.id)

  const [movie, setMovie] = useState<MovieCurationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    curation_status: "",
    quality_score: "",
    curator_notes: "",
  })

  // Fetch movie
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getMoviesForCuration({
          page: 1,
          page_size: 1,
        })

        const foundMovie = response.items.find((m) => m.id === movieId)
        if (!foundMovie) {
          throw new Error("Movie not found")
        }

        setMovie(foundMovie)
        setFormData({
          curation_status: foundMovie.curation.curation_status || "",
          quality_score: foundMovie.curation.quality_score?.toString() || "",
          curator_notes: foundMovie.curation.curator_notes || "",
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load movie"
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

    fetchMovie()
  }, [movieId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      const qualityScore = formData.quality_score ? Number(formData.quality_score) : null

      if (qualityScore !== null && (qualityScore < 0 || qualityScore > 100)) {
        throw new Error("Quality score must be between 0 and 100")
      }

      const updated = await updateMovieCuration(movieId, {
        curation_status: formData.curation_status || null,
        quality_score: qualityScore,
        curator_notes: formData.curator_notes || null,
      })

      setMovie(updated)
      toast({
        title: "Success",
        description: "Movie curation updated successfully",
      })

      setTimeout(() => {
        router.push("/admin/curation")
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update movie"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">Movie not found</p>
          <Button onClick={() => router.push("/admin/curation")} className="mt-4">
            Back to Curation List
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/curation")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-600">{movie.year || "N/A"}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Curation Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">Curation Status</label>
            <select
              value={formData.curation_status}
              onChange={(e) => setFormData({ ...formData, curation_status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              {CURATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Score */}
          <div>
            <label className="block text-sm font-semibold mb-2">Quality Score (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.quality_score}
              onChange={(e) => setFormData({ ...formData, quality_score: e.target.value })}
              placeholder="Enter quality score"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              0-20: Poor | 21-40: Below Average | 41-60: Average | 61-80: Good | 81-100: Excellent
            </p>
          </div>

          {/* Curator Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">Curator Notes</label>
            <textarea
              value={formData.curator_notes}
              onChange={(e) => setFormData({ ...formData, curator_notes: e.target.value })}
              placeholder="Add notes about this movie's curation..."
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Current Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Curated By</p>
                <p className="font-medium">
                  {movie.curation.curated_by?.name || "Not curated"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Curated At</p>
                <p className="font-medium">
                  {movie.curation.curated_at
                    ? new Date(movie.curation.curated_at).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Reviewed</p>
                <p className="font-medium">
                  {movie.curation.last_reviewed_at
                    ? new Date(movie.curation.last_reviewed_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/curation")}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

