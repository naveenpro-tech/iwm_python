"use client"

import { use, useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"
import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import { TimelineEvent } from "@/components/timeline/timeline-event"
import { TimelineFilter } from "@/components/timeline/timeline-filter"
import { TimelineZoom } from "@/components/timeline/timeline-zoom"
import { TimelineNavigation } from "@/components/timeline/timeline-navigation"
import { TimelineEventModal } from "@/components/timeline/timeline-event-modal"
import { TimelineSearch } from "@/components/timeline/timeline-search" // New import
import type { TimelineEventData, TimelineCategory } from "@/components/timeline/types" // New import for types
import { Button } from "@/components/ui/button"
import { Search, List, LayoutGrid, Loader2 } from "lucide-react"

// Enhanced Mock Data
const mockMovieTimelineEvents: TimelineEventData[] = [
  {
    id: "dev1",
    title: "Initial Concept & Script Development",
    date: "2008-01-15",
    formattedDate: "January 15, 2008",
    description:
      "Christopher Nolan begins fleshing out the complex narrative of Inception, focusing on the themes of dreams, reality, and grief.",
    category: "development",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["script", "Nolan", "concept", "writing"],
    details:
      "Nolan spent nearly a decade refining the screenplay, ensuring every layer of the dream-within-a-dream structure was meticulously planned. The initial pitch was a simpler heist film, which evolved into the intricate psychological thriller audiences know.",
    significance: "key-milestone",
    sourceCitations: [{ text: "Interview with Christopher Nolan, Empire Magazine, 2010" }],
    relatedLinks: [{ title: "Early Inception Concepts", url: "#" }],
  },
  {
    id: "dev2",
    title: "Warner Bros. Greenlights Project",
    date: "2009-02-11",
    formattedDate: "February 11, 2009",
    description:
      "Warner Bros. officially greenlights Inception, impressed by Nolan's vision and the success of The Dark Knight.",
    category: "development",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["greenlight", "Warner Bros.", "funding"],
    significance: "major",
  },
  {
    id: "prod1",
    title: "Leonardo DiCaprio Cast as Cobb",
    date: "2009-03-02",
    formattedDate: "March 2, 2009",
    description:
      "Leonardo DiCaprio signs on to play Dom Cobb, the lead role. His involvement significantly boosts the film's profile.",
    category: "production",
    image: "/leonardo-dicaprio.png",
    videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example placeholder
    tags: ["casting", "Leonardo DiCaprio", "Dom Cobb"],
    significance: "key-milestone",
    relatedEventIds: ["dev2"],
  },
  {
    id: "prod2",
    title: "Ensemble Cast Finalized",
    date: "2009-05-15",
    formattedDate: "May 15, 2009",
    description:
      "The star-studded ensemble cast, including Joseph Gordon-Levitt, Elliot Page, Tom Hardy, and Ken Watanabe, is finalized.",
    category: "production",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["casting", "ensemble", "actors"],
    significance: "major",
  },
  {
    id: "prod3",
    title: "Principal Photography Begins in Tokyo",
    date: "2009-07-13",
    formattedDate: "July 13, 2009",
    description: "Filming kicks off in Tokyo, Japan, capturing some of the film's most visually striking early scenes.",
    category: "production",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["filming", "Tokyo", "principal photography"],
    significance: "key-milestone",
  },
  {
    id: "prod4",
    title: "Complex Zero-Gravity Scene Filmed",
    date: "2009-09-01",
    formattedDate: "September 1, 2009",
    description: "The challenging zero-gravity hallway fight scene is filmed using a massive rotating set.",
    category: "production",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["special effects", "stunts", "rotating set"],
    details:
      "This sequence required weeks of planning and rehearsal. The custom-built centrifuge set allowed actors to perform stunts that appeared to defy gravity, minimizing the need for CGI.",
    significance: "major",
  },
  {
    id: "postprod1",
    title: "Hans Zimmer Composes Score",
    date: "2009-12-01",
    formattedDate: "December 1, 2009",
    description:
      "Hans Zimmer begins composing the iconic and influential score for Inception, collaborating closely with Nolan.",
    category: "post-production",
    image: "/hans-zimmer-portrait.png",
    tags: ["music", "score", "Hans Zimmer", "soundtrack"],
    significance: "major",
  },
  {
    id: "postprod2",
    title: "Visual Effects Work Intensifies",
    date: "2010-02-15",
    formattedDate: "February 15, 2010",
    description:
      "The post-production team works on over 500 visual effects shots, including the Parisian street folding and dream world collapses.",
    category: "post-production",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["VFX", "CGI", "post-production"],
    significance: "major",
  },
  {
    id: "mark1",
    title: "First Teaser Trailer Released",
    date: "2009-08-21",
    formattedDate: "August 21, 2009",
    description: "The enigmatic first teaser trailer drops, sparking widespread speculation and excitement.",
    category: "marketing",
    videoEmbed: "https://www.youtube.com/embed/YoHD9XEInc0", // Official trailer link
    tags: ["trailer", "teaser", "promotion"],
    significance: "major",
    relatedLinks: [{ title: "Watch Teaser on YouTube", url: "https://www.youtube.com/watch?v=YoHD9XEInc0" }],
  },
  {
    id: "mark2",
    title: "Viral Marketing Campaign 'Mind Crime'",
    date: "2010-04-01",
    formattedDate: "April 1, 2010",
    description: "An innovative viral marketing campaign, including the 'Mind Crime' game, engages audiences online.",
    category: "marketing",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["viral marketing", "online game", "promotion"],
    significance: "minor",
  },
  {
    id: "rel1",
    title: "World Premiere in London",
    date: "2010-07-08",
    formattedDate: "July 8, 2010",
    description: "Inception holds its grand world premiere at Leicester Square, London, attended by cast and crew.",
    category: "release",
    image: "/inception-premiere.png",
    tags: ["premiere", "London", "red carpet"],
    significance: "key-milestone",
  },
  {
    id: "rel2",
    title: "Theatrical Release (USA)",
    date: "2010-07-16",
    formattedDate: "July 16, 2010",
    description: "Inception is released in theaters across the United States, captivating audiences and critics alike.",
    category: "release",
    image: "/inception-movie-poster.png",
    tags: ["theatrical release", "box office", "USA"],
    significance: "key-milestone",
  },
  {
    id: "rec1",
    title: "Critical Acclaim and Audience Buzz",
    date: "2010-07-20",
    formattedDate: "July 20, 2010",
    description:
      "The film receives overwhelmingly positive reviews, praised for its originality, complexity, and visual spectacle. It generates significant online discussion.",
    category: "reception",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["reviews", "critics", "audience reaction", "buzz"],
    significance: "major",
  },
  {
    id: "award1",
    title: "Academy Award Nominations Announced",
    date: "2011-01-25",
    formattedDate: "January 25, 2011",
    description: "Inception receives 8 Academy Award nominations, including Best Picture and Best Original Screenplay.",
    category: "award",
    image: "/oscar-trophy.png",
    tags: ["Oscars", "nominations", "Academy Awards"],
    significance: "major",
  },
  {
    id: "award2",
    title: "Wins 4 Academy Awards",
    date: "2011-02-27",
    formattedDate: "February 27, 2011",
    description:
      "The film wins 4 Oscars: Best Cinematography, Best Sound Editing, Best Sound Mixing, and Best Visual Effects.",
    category: "award",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["Oscars", "wins", "awards ceremony"],
    significance: "key-milestone",
    relatedEventIds: ["award1"],
  },
  {
    id: "rel3",
    title: "10th Anniversary IMAX Re-release",
    date: "2020-08-12",
    formattedDate: "August 12, 2020",
    description:
      "Inception is re-released in IMAX for its 10th anniversary, allowing new and old fans to experience it on the big screen.",
    category: "release",
    image: "/placeholder.svg?width=400&height=200",
    tags: ["re-release", "IMAX", "anniversary"],
    significance: "minor",
  },
]

export default function MovieTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params Promise (Next.js 15 requirement)
  const { id: movieId } = use(params)

  const [selectedEvent, setSelectedEvent] = useState<TimelineEventData | null>(null)
  const [zoomLevel, setZoomLevel] = useState(3) // 1-5, with 5 being most zoomed in
  const [activeCategory, setActiveCategory] = useState<TimelineCategory | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline")
  const [isLoading, setIsLoading] = useState(true)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEventData[]>([])
  const [movieTitle, setMovieTitle] = useState("Movie")

  // Movie data
  const movie = {
    id: movieId,
    title: movieTitle,
  }

  useEffect(() => {
    const fetchMovieAndTimeline = async () => {
      setIsLoading(true)
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        const response = await fetch(`${apiBase}/api/v1/movies/${movieId}`)
        if (response.ok) {
          const data = await response.json()
          setMovieTitle(data.title || "Movie")

          // Convert backend timeline format to TimelineEventData
          const events = (data.timeline || []).map((event: any, index: number) => ({
            id: `timeline-${index}`,
            title: event.title,
            date: event.date,
            formattedDate: new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            description: event.description,
            category: (event.type || "production") as TimelineCategory,
            tags: [event.type || "production"],
            significance: "major" as const,
          }))
          setTimelineEvents(events)
        }
      } catch (error) {
        console.error("Failed to fetch movie timeline:", error)
        // Fall back to mock data if fetch fails
        setTimelineEvents(mockMovieTimelineEvents)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovieAndTimeline()
  }, [movieId])

  const filteredEvents = useMemo(() => {
    const eventsToFilter = timelineEvents.length > 0 ? timelineEvents : mockMovieTimelineEvents
    return eventsToFilter
      .filter((event) => {
        if (!activeCategory) return true
        return event.category === activeCategory
      })
      .filter((event) => {
        if (!searchTerm) return true
        const lowerSearchTerm = searchTerm.toLowerCase()
        return (
          event.title.toLowerCase().includes(lowerSearchTerm) ||
          event.description.toLowerCase().includes(lowerSearchTerm) ||
          (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm)))
        )
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ensure chronological order
  }, [activeCategory, searchTerm, timelineEvents])

  const getEventSpacing = () => {
    // Controls vertical spacing in timeline view
    const spacingClasses = ["space-y-2", "space-y-4", "space-y-6", "space-y-8", "space-y-10"]
    return spacingClasses[zoomLevel - 1] || "space-y-6"
  }

  const breadcrumbItems = [
    { label: "Movies", href: "/movies" },
    { label: movie.title, href: `/movies/${movie.id}` },
    { label: "Timeline", href: `/movies/${movie.id}/timeline` },
  ]

  const categoryCounts = useMemo(() => {
    const eventsToCount = timelineEvents.length > 0 ? timelineEvents : mockMovieTimelineEvents
    const counts: { [key in TimelineCategory]?: number } & { all?: number } = { all: eventsToCount.length }
    eventsToCount.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1
    })
    return counts
  }, [timelineEvents])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#00BFFF] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#101010] font-dmsans">
      <MovieDetailsNavigation movieId={movie.id} movieTitle={movie.title} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BreadcrumbNavigation items={breadcrumbItems} />

        <header className="my-8 text-center sm:text-left">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#00DFFF]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {movie.title}: Timeline
          </motion.h1>
          <motion.p
            className="text-lg text-[#A0A0A0] mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore the chronological journey of {movie.title} from inception to impact.
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            {/* Controls Bar */}
            <motion.div
              className="bg-[#1C1C1C] rounded-xl p-4 sm:p-6 mb-8 shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
                <TimelineSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                  <TimelineZoom zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
                  <div className="flex border border-[#3A3A3A] rounded-md overflow-hidden self-start sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("timeline")}
                      className={`px-3 py-1.5 ${viewMode === "timeline" ? "bg-[#00BFFF] text-black" : "text-[#A0A0A0] hover:bg-[#2A2A2A]"}`}
                      aria-pressed={viewMode === "timeline"}
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" /> Timeline
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 ${viewMode === "list" ? "bg-[#00BFFF] text-black" : "text-[#A0A0A0] hover:bg-[#2A2A2A]"}`}
                      aria-pressed={viewMode === "list"}
                    >
                      <List className="h-4 w-4 mr-2" /> List
                    </Button>
                  </div>
                </div>
              </div>
              <TimelineFilter
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categoryCounts={categoryCounts}
              />
              <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                <TimelineNavigation events={filteredEvents} />
              </div>
            </motion.div>

            {/* Timeline/List View */}
            <AnimatePresence mode="wait">
              {viewMode === "timeline" ? (
                <motion.div
                  key="timeline-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative ${getEventSpacing()}`}
                >
                  <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-1 bg-gradient-to-b from-[#00BFFF]/50 via-[#00BFFF]/80 to-[#00BFFF]/50 rounded-full -translate-x-1/2"></div>
                  {filteredEvents.map((event, index) => (
                    <TimelineEvent
                      key={event.id}
                      event={event}
                      position={index % 2 === 0 ? "left" : "right"}
                      onClick={() => setSelectedEvent(event)}
                      zoomLevel={zoomLevel}
                      searchTerm={searchTerm}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#1C1C1C] rounded-lg p-4 cursor-pointer hover:bg-[#2A2A2A] transition-colors shadow-md"
                      onClick={() => setSelectedEvent(event)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#E0E0E0]">{event.title}</h3>
                          <p className="text-sm text-[#00BFFF]">{event.formattedDate}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium
                          ${
                            event.category === "production"
                              ? "bg-blue-500/20 text-blue-300"
                              : event.category === "release"
                                ? "bg-green-500/20 text-green-300"
                                : event.category === "award"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : event.category === "development"
                                    ? "bg-purple-500/20 text-purple-300"
                                    : event.category === "post-production"
                                      ? "bg-indigo-500/20 text-indigo-300"
                                      : event.category === "marketing"
                                        ? "bg-pink-500/20 text-pink-300"
                                        : event.category === "reception"
                                          ? "bg-teal-500/20 text-teal-300"
                                          : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-[#B0B0B0] mt-2 line-clamp-2">{event.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {filteredEvents.length === 0 && !isLoading && (
              <motion.div className="text-center py-10 text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-xl">No timeline events match your criteria.</p>
                <p>Try adjusting your filters or search term.</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start" // Adjusted sticky position
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-[#1C1C1C] rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Timeline Highlights</h2>
              <div className="space-y-3">
                {(timelineEvents.length > 0 ? timelineEvents : mockMovieTimelineEvents)
                  .filter((event) => event.significance === "key-milestone")
                  .slice(0, 5)
                  .map((event) => (
                    <motion.div
                      key={`highlight-${event.id}`}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedEvent(event)
                        // Optional: Scroll to event in timeline view
                        const element = document.getElementById(`event-${event.id}`)
                        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" })
                      }}
                      whileHover={{ x: 2 }}
                    >
                      <h3 className="text-sm font-medium text-[#E0E0E0] group-hover:text-[#00BFFF] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#808080] group-hover:text-[#00BFFF]/80 transition-colors">
                        {event.formattedDate}
                      </p>
                    </motion.div>
                  ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
                <h2 className="text-xl font-semibold text-white mb-4">Event Categories</h2>
                <div className="space-y-1.5">
                  {(Object.keys(categoryCounts) as Array<TimelineCategory | "all">)
                    .filter((cat) => cat !== "all" && categoryCounts[cat]! > 0) // Ensure cat is a valid TimelineCategory
                    .map((category) => (
                      <div key={category} className="flex justify-between items-center text-sm">
                        <span className="text-[#A0A0A0] capitalize">{category.replace("-", " ")}</span>
                        <span className="font-medium text-white bg-[#2A2A2A] px-2 py-0.5 rounded-md">
                          {categoryCounts[category as TimelineCategory]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedEvent && <TimelineEventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  )
}
