"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search } from "lucide-react"
import { apiGet, apiPost, apiDelete } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Recommendation {
  id: number
  external_id: string
  movie_id: number
  movie_title: string
  recommendation_type: string
  reason: string
  created_at: string
}

const RECOMMENDATION_TYPES = [
  { value: "must_watch", label: "Must Watch" },
  { value: "hidden_gem", label: "Hidden Gem" },
  { value: "guilty_pleasure", label: "Guilty Pleasure" },
  { value: "underrated", label: "Underrated" },
  { value: "cult_classic", label: "Cult Classic" },
  { value: "comfort_watch", label: "Comfort Watch" },
  { value: "masterpiece", label: "Masterpiece" },
  { value: "controversial", label: "Controversial" },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [formData, setFormData] = useState({
    movie_id: 0,
    movie_title: "",
    recommendation_type: "",
    reason: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchRecommendations()
  }, [])

  async function fetchRecommendations() {
    try {
      const data = await apiGet<{ items: Recommendation[] }>("/api/v1/critic-recommendations/critic/me")
      setRecommendations(data.items || [])
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  async function searchMovies() {
    if (!searchQuery.trim()) return

    try {
      const data = await apiGet<{ results: any[] }>(`/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=movie`)
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Failed to search movies:", error)
      toast({
        title: "Error",
        description: "Failed to search movies",
        variant: "destructive",
      })
    }
  }

  async function handleCreate() {
    if (!formData.movie_id || !formData.recommendation_type || !formData.reason.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    try {
      await apiPost("/api/v1/critic-recommendations", formData)
      toast({
        title: "Success",
        description: "Recommendation created successfully",
      })
      setShowDialog(false)
      setFormData({ movie_id: 0, movie_title: "", recommendation_type: "", reason: "" })
      setSearchQuery("")
      setSearchResults([])
      fetchRecommendations()
    } catch (error: any) {
      console.error("Failed to create recommendation:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create recommendation",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: number) {
    try {
      await apiDelete(`/api/v1/critic-recommendations/${id}`)
      setRecommendations(recommendations.filter((r) => r.id !== id))
      toast({
        title: "Success",
        description: "Recommendation deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete recommendation:", error)
      toast({
        title: "Error",
        description: "Failed to delete recommendation",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recommendations</h1>
          <p className="text-muted-foreground mt-1">Manage your movie recommendations</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Recommendation
        </Button>
      </div>

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No recommendations yet</p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Recommendation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{rec.movie_title}</CardTitle>
                      <Badge>
                        {RECOMMENDATION_TYPES.find((t) => t.value === rec.recommendation_type)?.label}
                      </Badge>
                    </div>
                    <CardDescription>{rec.reason}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rec.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Recommendation</DialogTitle>
            <DialogDescription>Recommend a movie to your followers</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Movie Search */}
            <div className="space-y-2">
              <Label>Search Movie</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for a movie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchMovies()}
                />
                <Button onClick={searchMovies}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          movie_id: movie.id,
                          movie_title: movie.title,
                        })
                        setSearchResults([])
                        setSearchQuery("")
                      }}
                    >
                      {movie.title} ({movie.release_year})
                    </div>
                  ))}
                </div>
              )}
              {formData.movie_title && (
                <p className="text-sm text-muted-foreground">Selected: {formData.movie_title}</p>
              )}
            </div>

            {/* Recommendation Type */}
            <div className="space-y-2">
              <Label>Recommendation Type</Label>
              <Select
                value={formData.recommendation_type}
                onValueChange={(value) => setFormData({ ...formData, recommendation_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {RECOMMENDATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label>Why do you recommend this?</Label>
              <Textarea
                placeholder="Explain why you recommend this movie..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Recommendation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

