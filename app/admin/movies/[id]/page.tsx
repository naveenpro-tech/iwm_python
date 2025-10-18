"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieBasicInfoForm } from "@/components/admin/movies/forms/movie-basic-info-form"
import { MovieMediaForm } from "@/components/admin/movies/forms/movie-media-form"
import { MovieCastCrewForm } from "@/components/admin/movies/forms/movie-cast-crew-form"
import { MovieStreamingForm } from "@/components/admin/movies/forms/movie-streaming-form"
import { MovieAwardsForm } from "@/components/admin/movies/forms/movie-awards-form"
import { MovieTriviaForm } from "@/components/admin/movies/forms/movie-trivia-form" // New import
import { MovieTimelineForm } from "@/components/admin/movies/forms/movie-timeline-form" // New import
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import type {
  Movie,
  CastMember,
  CrewMember,
  StreamingPlatformLink,
  AwardInfo,
  TriviaItem,
  TimelineEvent,
} from "@/components/admin/movies/types"
import { addMockMovie, getMockMovieById, updateMockMovie } from "@/components/admin/movies/mock-movie-data"
import { useToast } from "@/hooks/use-toast" // Corrected path
import { Skeleton } from "@/components/ui/skeleton"

export default function MovieEditPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [hasChanges, setHasChanges] = useState(false)
  const [movieData, setMovieData] = useState<Movie | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Gemini enrichment state
  const [enrichQuery, setEnrichQuery] = useState("")
  const [isEnriching, setIsEnriching] = useState(false)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")

  const mapBackendToAdminMovie = (data: any): Movie => {
    const streamingLinks = [] as any[]
    if (data.streamingOptions) {
      for (const region of Object.keys(data.streamingOptions)) {
        for (const item of data.streamingOptions[region] || []) {
          streamingLinks.push({
            id: `${region}-${item.provider}-${Math.random().toString(36).slice(2, 8)}`,
            provider: item.provider,
            region,
            url: item.url,
            type: (item.type || "subscription") as any,
            price: item.price || undefined,
            quality: (item.quality || "HD") as any,
            verified: !!item.verified,
          })
        }
      }
    }

    const cast = (data.cast || []).map((c: any, idx: number) => ({
      id: c.id || `${idx}`,
      name: c.name,
      character: c.character || "",
      image: c.profileUrl || undefined,
      order: idx,
    }))

    const crewRoleMap = [
      ...(data.directors || []).map((p: any) => ({ id: p.id, name: p.name, role: "Director", department: "Directing", image: p.profileUrl })),
      ...(data.writers || []).map((p: any) => ({ id: p.id, name: p.name, role: "Writer", department: "Writing", image: p.profileUrl })),
      ...(data.producers || []).map((p: any) => ({ id: p.id, name: p.name, role: "Producer", department: "Production", image: p.profileUrl })),
    ]

    const languages = data.language ? [data.language] : []

    const m: Movie = {
      id: data.id || "",
      title: data.title || "",
      originalTitle: data.title || "",
      poster: data.posterUrl || "",
      backdrop: data.backdropUrl || "",
      sidduScore: data.sidduScore || 0,
      releaseDate: data.releaseDate || undefined,
      status: (data.status || "draft") as any,
      genres: data.genres || [],
      synopsis: data.synopsis || "",
      runtime: data.runtime || 0,
      languages: languages,
      certification: (data.rating || "Unrated") as any,
      cast,
      crew: crewRoleMap,
      galleryImages: [],
      trailerUrl: "",
      trailerEmbed: "",
      streamingLinks,
      releaseDates: [],
      awards: [],
      trivia: (data.trivia || []).map((t: any, i: number) => ({ id: `${i}`, question: t.question, category: t.category, answer: t.answer, explanation: t.explanation })),
      timelineEvents: (data.timeline || []).map((tl: any, i: number) => ({ id: `${i}`, date: tl.date, title: tl.title, description: tl.description, category: tl.type })),
      isPublished: true,
      isArchived: false,
      budget: data.budget || 0,
      boxOffice: data.revenue || 0,
      productionCompanies: [],
      countriesOfOrigin: data.country ? [data.country] : [],
      tagline: data.tagline || "",
      keywords: [],
      aspectRatio: "",
      soundMix: [],
      camera: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      importedFrom: "Gemini",
    }
    return m
  }

  const handleEnrichFromGemini = async () => {
    if (!movieData) return
    const q = (enrichQuery || movieData.title || "").trim()
    if (!q) {
      toast({ variant: "destructive", title: "Missing query", description: "Enter a title to fetch from Gemini." })
      return
    }
    try {
      setIsEnriching(true)
      const res = await fetch(`${apiBase}/api/v1/admin/movies/enrich`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, provider: "gemini" }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const detail = err?.detail || err
        toast({
          variant: "destructive",
          title: `Gemini failed (${res.status})`,
          description: typeof detail === "string" ? detail : JSON.stringify(detail),
        })
        return
      }
      const data = await res.json()
      const externalId = data.external_id
      const providerUsed = data.provider_used
      const getRes = await fetch(`${apiBase}/api/v1/movies/${externalId}`)
      if (!getRes.ok) throw new Error(`Failed to fetch movie ${externalId}`)
      const backendMovie = await getRes.json()
      const mapped = mapBackendToAdminMovie(backendMovie)
      setMovieData(mapped)
      setHasChanges(true)
      toast({ title: "Enriched from Gemini", description: `Provider: ${providerUsed}. Review and publish.` })
      setActiveTab("basic")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Enrichment error", description: e?.message || "Unknown error" })
    } finally {
      setIsEnriching(false)
    }
  }

  const handlePublishToBackend = async () => {
    if (!movieData) return
    try {
      setIsSaving(true)
      const extId = movieData.id && !movieData.id.startsWith("mock-") && movieData.id !== "new"
        ? movieData.id
        : `manual-${slugify(movieData.title || "movie")}-${Date.now()}`

      // Map admin state -> backend MovieImportIn
      const directors = (movieData.crew || []).filter(c => c.role?.toLowerCase() === "director").map(c => ({ name: c.name, image: c.image }))
      const writers = (movieData.crew || []).filter(c => c.role?.toLowerCase() === "writer").map(c => ({ name: c.name, image: c.image }))
      const producers = (movieData.crew || []).filter(c => c.role?.toLowerCase() === "producer").map(c => ({ name: c.name, image: c.image }))
      const cast = (movieData.cast || []).map(c => ({ name: c.name, image: c.image, character: c.character }))

      const payload = [{
        external_id: extId,
        title: movieData.title,
        tagline: movieData.tagline || undefined,
        year: movieData.releaseDate ? movieData.releaseDate.slice(0, 4) : undefined,
        release_date: movieData.releaseDate || undefined,
        runtime: movieData.runtime || undefined,
        rating: (movieData.certification as any) || undefined,
        siddu_score: movieData.sidduScore || undefined,
        critics_score: undefined,
        imdb_rating: undefined,
        rotten_tomatoes_score: undefined,
        language: (movieData.languages && movieData.languages[0]) || undefined,
        country: (movieData.countriesOfOrigin && movieData.countriesOfOrigin[0]) || undefined,
        overview: movieData.synopsis || undefined,
        poster_url: movieData.poster || undefined,
        backdrop_url: movieData.backdrop || undefined,
        budget: movieData.budget || undefined,
        revenue: movieData.boxOffice || undefined,
        status: (movieData.status as any) || undefined,
        genres: movieData.genres || [],
        directors,
        writers,
        producers,
        cast,
        streaming: (movieData.streamingLinks || []).map((s, i) => ({
          platform: s.provider,
          region: s.region,
          type: s.type,
          price: s.price,
          quality: s.quality,
          url: s.url,
        })),
      }]

      const res = await fetch(`${apiBase}/api/v1/admin/movies/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof json === "string" ? json : JSON.stringify(json))
      }
      toast({ title: "Published", description: `Imported: ${json.imported}, Updated: ${json.updated}` })
      // Redirect to public movie page (frontend)
      const idToVisit = extId
      router.push(`/movies/${idToVisit}`)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Publish failed", description: e?.message || "Unknown error" })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      if (params.id === "new") {
        setMovieData({
          id: "", // Will be generated on save
          title: "",
          originalTitle: "",
          poster: "",
          backdrop: "",
          sidduScore: 0,
          releaseDate: new Date().toISOString().split("T")[0],
          status: "draft",
          genres: [],
          synopsis: "",
          runtime: 0,
          languages: [],
          certification: "Unrated",
          cast: [],
          crew: [],
          galleryImages: [],
          trailerUrl: "",
          trailerEmbed: "",
          streamingLinks: [],
          releaseDates: [],
          awards: [],
          trivia: [], // New field
          timelineEvents: [], // New field
          isPublished: false,
          isArchived: false,
          budget: 0,
          boxOffice: 0,
          productionCompanies: [],
          countriesOfOrigin: [],
          tagline: "",
          keywords: [],
          aspectRatio: "",
          soundMix: [],
          camera: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          importedFrom: "Manual",
        })
        setIsLoading(false)
        document.title = "Add New Movie | Siddu Admin"
        return
      }

      try {
        const movie = await getMockMovieById(params.id as string)
        if (!movie) {
          setError("Movie not found")
          setMovieData(null)
        } else {
          // Ensure new fields have default empty arrays if not present in mock data
          setMovieData({
            ...movie,
            trivia: movie.trivia || [],
            timelineEvents: movie.timelineEvents || [],
          })
          document.title = `Edit Movie: ${movie.title} | Siddu Admin`
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch movie")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleSaveChanges = async () => {
    if (!movieData) return
    setIsSaving(true)
    try {
      if (params.id === "new") {
        const { id: _, ...movieDataWithoutId } = movieData
        const newMovie = await addMockMovie(movieDataWithoutId)
        toast({
          title: "Movie Added Successfully!",
          description: `"${newMovie.title}" has been created.`,
        })
        router.push(`/admin/movies/${newMovie.id}`) // Redirect to edit page of new movie
      } else {
        await updateMockMovie(movieData)
        toast({
          title: "Movie Updated Successfully!",
          description: `Changes to "${movieData.title}" have been saved.`,
        })
      }
      setHasChanges(false)
    } catch (e: any) {
      setError(e.message || "Failed to save changes")
      toast({
        variant: "destructive",
        title: "Error Saving Movie",
        description: e.message || "An unexpected error occurred.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateMovieField = (fieldName: keyof Movie, value: any) => {
    setMovieData((prev) => {
      if (!prev) return null
      const updatedMovie = { ...prev, [fieldName]: value }
      if (fieldName === "title" && params.id !== "new") {
        document.title = `Edit Movie: ${value} | Siddu Admin`
      }
      return updatedMovie
    })
    setHasChanges(true)
  }

  const onBasicInfoChange = (updates: Partial<Movie>) => {
    setMovieData((prev) => ({ ...prev!, ...updates }))
    setHasChanges(true)
    if (updates.title && params.id !== "new") {
      document.title = `Edit Movie: ${updates.title} | Siddu Admin`
    }
  }

  const onMediaInfoChange = (
    updates: Partial<Pick<Movie, "poster" | "backdrop" | "galleryImages" | "trailerUrl" | "trailerEmbed">>,
  ) => {
    setMovieData((prev) => ({ ...prev!, ...updates }))
    setHasChanges(true)
  }

  const onCastCrewChange = (updates: { cast?: CastMember[]; crew?: CrewMember[] }) => {
    setMovieData((prev) => ({ ...prev!, ...updates }))
    setHasChanges(true)
  }

  const onStreamingChange = (updatedLinks: StreamingPlatformLink[]) => {
    setMovieData((prev) => ({ ...prev!, streamingLinks: updatedLinks }))
    setHasChanges(true)
  }

  const handleAwardsChange = (awards: AwardInfo[]) => {
    setMovieData((prev) => ({ ...prev!, awards: awards }))
    setHasChanges(true)
  }

  const handleTriviaChange = (trivia: TriviaItem[]) => {
    setMovieData((prev) => ({ ...prev!, trivia: trivia }))
    setHasChanges(true)
  }

  const handleTimelineEventsChange = (events: TimelineEvent[]) => {
    setMovieData((prev) => ({ ...prev!, timelineEvents: events }))
    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div>
              <Skeleton className="h-8 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <Skeleton className="h-10 w-full max-w-4xl rounded-md" /> {/* TabsList Skeleton */}
        <div className="mt-6 space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" /> {/* TabContent Skeleton */}
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-6">Error: {error}. Please try refreshing the page or contact support.</div>
  }

  if (!movieData && !isLoading && !error) {
    return <div className="p-6">Movie data could not be loaded. It might have been deleted or an error occurred.</div>
  }

  // Fallback for movieData if it's still null after loading and no error
  if (!movieData) {
    return <div className="p-6 text-center">Loading movie data... If this persists, please refresh.</div>
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link href="/admin/movies" aria-label="Back to movies list">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {params.id === "new" ? "Add New Movie" : `Edit: ${movieData?.title || "Movie"}`}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {params.id === "new"
                ? "Fill in the details for the new movie."
                : "Update movie details and manage its content."}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="gap-2" onClick={handlePublishToBackend} disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Publish to Backend
          </Button>
          <Button className="gap-2" disabled={!hasChanges || isSaving} onClick={handleSaveChanges}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {params.id === "new" ? "Create Draft (Local)" : "Save Draft (Local)"}
          </Button>
        </div>
      </motion.div>

      {/* Gemini Enrichment Bar */}
      <div className="w-full -mt-2 grid grid-cols-1 sm:grid-cols-6 gap-2">
        <input
          type="text"
          className="col-span-4 rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Query to fetch from Gemini (default: current Title)"
          value={enrichQuery || movieData?.title || ""}
          onChange={(e) => setEnrichQuery(e.target.value)}
        />
        <Button
          variant="outline"
          className="col-span-2 gap-2"
          onClick={handleEnrichFromGemini}
          disabled={isEnriching}
        >
          {isEnriching ? <Loader2 size={16} className="animate-spin" /> : null}
          Fetch from Gemini
        </Button>
      </div>
  
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 w-full max-w-full overflow-x-auto">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="cast-crew">Cast & Crew</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="trivia">Trivia</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <MovieBasicInfoForm
            movie={movieData}
            onFieldChange={updateMovieField}
            onChanges={() => setHasChanges(true)}
          />
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MovieMediaForm
            initialValues={{
              poster: movieData.poster,
              backdrop: movieData.backdrop,
              galleryImages: movieData.galleryImages,
              trailerUrl: movieData.trailerUrl,
              trailerEmbed: movieData.trailerEmbed,
            }}
            onChanges={onMediaInfoChange}
          />
        </TabsContent>

        <TabsContent value="cast-crew" className="mt-6">
          <MovieCastCrewForm
            initialCast={movieData.cast || []}
            initialCrew={movieData.crew || []}
            onCastChange={(newCast) => updateMovieField("cast", newCast)}
            onCrewChange={(newCrew) => updateMovieField("crew", newCrew)}
            onChanges={() => setHasChanges(true)}
          />
        </TabsContent>

        <TabsContent value="streaming" className="mt-6">
          <MovieStreamingForm
            initialLinks={movieData.streamingLinks || []}
            onStreamingLinksChange={onStreamingChange}
            onChanges={() => setHasChanges(true)}
          />
        </TabsContent>

        <TabsContent value="awards" className="mt-6">
          <MovieAwardsForm initialAwards={movieData.awards || []} onAwardsChange={handleAwardsChange} />
        </TabsContent>

        <TabsContent value="trivia" className="mt-6">
          <MovieTriviaForm initialTrivia={movieData.trivia || []} onTriviaChange={handleTriviaChange} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <MovieTimelineForm
            initialEvents={movieData.timelineEvents || []}
            onEventsChange={handleTimelineEventsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
