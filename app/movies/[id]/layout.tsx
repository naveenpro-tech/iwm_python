import { Metadata, ResolvingMetadata } from "next"

interface Props {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const movieId = params.id
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Fallback metadata
  const fallbackMetadata: Metadata = {
    title: "Movie Details - Siddu Global Entertainment Hub",
    description: "Explore detailed information, reviews, and more about this movie.",
    openGraph: {
      title: "Movie Details",
      description: "Explore detailed information, reviews, and more about this movie.",
      siteName: "Siddu Global Entertainment Hub",
    },
  }

  try {
    const response = await fetch(`${apiBase}/api/v1/movies/${movieId}`, {
      cache: "no-store", // Changed from revalidate to avoid caching issues during development
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.warn(`Failed to fetch movie metadata for ${movieId}: ${response.statusText}`)
      return fallbackMetadata
    }

    const movie = await response.json()

    const title = `${movie.title} (${movie.year || "N/A"}) - Movie Details`
    const description = movie.overview || movie.synopsis || `Watch ${movie.title} and explore detailed information, reviews, and more.`
    const imageUrl = movie.posterUrl || movie.poster_url || movie.backdropUrl || movie.backdrop_url || "/placeholder.svg"
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/movies/${movieId}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "video.movie",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: movie.title,
          },
        ],
        siteName: "Siddu Global Entertainment Hub",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      keywords: [
        movie.title,
        "movie",
        "film",
        "Telugu cinema",
        ...(movie.genres || []),
        String(movie.year),
        "reviews",
        "ratings",
      ].filter(Boolean),
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for movie ${movieId}:`, error)
    return fallbackMetadata
  }
}

export default function MovieLayout({ children }: Props) {
  return <>{children}</>
}

