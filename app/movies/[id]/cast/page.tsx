"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

interface CastMember {
  id: string
  name: string
  character: string
  image?: string
  role?: string
}

export default function CastPage() {
  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string
  const { toast } = useToast()

  const [cast, setCast] = useState<CastMember[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [movieTitle, setMovieTitle] = useState("Movie")

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        const response = await fetch(`${apiBase}/api/v1/movies/${movieId}`)
        if (response.ok) {
          const data = await response.json()
          console.log("Movie data received:", data)
          console.log("Cast data:", data.cast)

          // Transform cast data to use 'image' field from 'profileUrl'
          const transformedCast = (data.cast || []).map((member: any) => ({
            id: member.id,
            name: member.name,
            character: member.character,
            image: member.profileUrl || member.image, // Use profileUrl from backend
            role: member.role,
          }))

          console.log("Transformed cast:", transformedCast)
          setCast(transformedCast)
          setMovieTitle(data.title || "Movie")
        }
      } catch (error) {
        console.error("Failed to fetch cast:", error)
        toast({ title: "Error", description: "Failed to load cast", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchCast()
  }, [movieId, toast])

  const breadcrumbItems = [
    { label: "Movies", href: "/movies" },
    { label: movieTitle, href: `/movies/${movieId}` },
    { label: "Cast & Crew", href: `/movies/${movieId}/cast` },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414]">
        <MovieDetailsNavigation movieId={movieId} movieTitle={movieTitle} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] text-gray-100">
      <MovieDetailsNavigation movieId={movieId} movieTitle={movieTitle} />

      <div className="container mx-auto py-8 px-4">
        <BreadcrumbNavigation items={breadcrumbItems} />

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold mb-2 text-[#E0E0E0]">Cast & Crew</h1>
          <p className="text-[#A0A0A0]">Meet the actors in this movie</p>
        </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")}>
          Grid View
        </Button>
        <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
          List View
        </Button>
      </div>

      {/* Cast Grid */}
      {cast.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No cast information available</p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {cast.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/people/${member.id}`)}>
                  <div className="relative aspect-square bg-muted">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", member.image)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-sm line-clamp-2">{member.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{member.character}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          <AnimatePresence>
            {cast.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/people/${member.id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover rounded"
                          onError={(e) => {
                            console.error("Image failed to load:", member.image)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">as {member.character}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      </div>
    </div>
  )
}

