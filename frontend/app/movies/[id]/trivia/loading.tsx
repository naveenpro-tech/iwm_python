import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Lightbulb, Filter, Search, ListFilter, Users, CheckCircle, ShieldAlert } from "lucide-react"

export default function MovieTriviaPageSkeleton() {
  const mockMovieId = "loading"
  const mockMovieTitle = "Loading Movie..."

  const breadcrumbItems = [
    { label: "Movies", href: "/movies" },
    { label: mockMovieTitle, href: `/movies/${mockMovieId}` },
    { label: "Trivia", href: `/movies/${mockMovieId}/trivia` },
  ]

  return (
    <div className="min-h-screen bg-[#141414] text-gray-100">
      <MovieDetailsNavigation movieId={mockMovieId} movieTitle={mockMovieTitle} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation items={breadcrumbItems} />

        <div className="my-8">
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center">
            <Lightbulb className="w-10 h-10 mr-3 text-gray-600" />
            <Skeleton className="h-10 w-64 bg-gray-700" />:{" "}
            <span className="text-gray-600">
              <Skeleton className="h-10 w-40 inline-block bg-gray-700" />
            </span>
          </h1>
          <Skeleton className="h-6 w-3/4 mt-2 bg-gray-700" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="bg-[#1C1C1C] rounded-xl p-4 sm:p-6 mb-6 shadow-2xl border border-gray-700/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Skeleton className="h-10 w-full pl-10 bg-gray-700" />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Skeleton className="h-10 w-32 bg-gray-700" /> {/* Sort */}
                  <Skeleton className="h-10 w-10 bg-gray-700" /> {/* Spoilers */}
                  <Skeleton className="h-10 w-32 bg-gray-700" /> {/* Add Trivia */}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Skeleton className="h-5 w-40 bg-gray-700" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full bg-gray-700" />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-[#282828] border-gray-700 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Skeleton className="h-6 w-20 rounded-md bg-gray-700" />
                    <Skeleton className="h-6 w-24 rounded-md bg-gray-700" />
                  </div>
                  <Skeleton className="h-5 w-full mb-2 bg-gray-600" />
                  <Skeleton className="h-5 w-5/6 mb-4 bg-gray-600" />
                  <Skeleton className="h-4 w-1/2 mb-3 bg-gray-700" /> {/* Source */}
                  <div className="flex items-center text-xs text-gray-500 gap-3">
                    <Skeleton className="h-4 w-24 bg-gray-700" /> {/* Submitted by */}
                    <Skeleton className="h-4 w-20 bg-gray-700" /> {/* Date */}
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-700/70 mt-3 pt-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-16 bg-gray-700" />
                      <Skeleton className="h-8 w-16 bg-gray-700" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-[#1C1C1C] rounded-xl p-6 sticky top-24 shadow-2xl border border-gray-700/50">
              <Skeleton className="h-7 w-3/4 mb-6 bg-gray-700" /> {/* Trivia Insights Title */}
              <div className="space-y-5 text-sm">
                {[
                  { icon: ListFilter, label: "Total Trivia" },
                  { icon: CheckCircle, label: "Verified Facts" },
                  { icon: ShieldAlert, label: "Spoilers Marked" },
                  { icon: Users, label: "Unique Contributors" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <div className="flex items-center text-gray-300">
                      <stat.icon className="h-4 w-4 mr-2.5 text-gray-600" />
                      <Skeleton className="h-5 w-32 bg-gray-700" />
                    </div>
                    <Skeleton className="h-5 w-8 bg-gray-700" />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700">
                <Skeleton className="h-6 w-1/2 mb-4 bg-gray-700" /> {/* Top Categories Title */}
                <div className="space-y-3 text-sm">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-5 w-2/3 bg-gray-700" />
                      <Skeleton className="h-5 w-10 bg-gray-700 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700">
                <Skeleton className="h-6 w-3/4 mb-4 bg-gray-700" /> {/* Guidelines Title */}
                <ul className="space-y-2.5 text-xs text-gray-400">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-gray-700" />
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
