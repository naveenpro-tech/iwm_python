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
        <Button className="gap-2 w-full sm:w-auto" disabled={!hasChanges || isSaving} onClick={handleSaveChanges}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving
            ? params.id === "new"
              ? "Creating..."
              : "Saving..."
            : params.id === "new"
              ? "Create Movie"
              : "Save Changes"}
        </Button>
      </motion.div>

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
