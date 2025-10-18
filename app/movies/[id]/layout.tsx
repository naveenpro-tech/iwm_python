import { Metadata, ResolvingMetadata } from "next"

interface Props {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const movieId = params.id
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  try {
    const response = await fetch(`${apiBase}/api/v1/movies/${movieId}`, {
      cache: "revalidate",
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch movie")
    }

    const movie = await response.json()

    const title = `${movie.title} (${movie.year || "N/A"}) - Movie Details`
    const description = movie.synopsis || `Watch ${movie.title} and explore detailed information, reviews, and more.`
    const imageUrl = movie.posterUrl || movie.backdropUrl || "/default-movie-poster.png"
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/movies/${movieId}`

    return {
      title,
      description,
      canonical: url,
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
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: movie.title,
          },
        ],
        siteName: "Movie Database",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
        creator: "@moviedatabase",
      },
      keywords: [
        movie.title,
        "movie",
        "film",
        ...(movie.genres || []),
        movie.year,
        "reviews",
        "ratings",
      ],
      authors: movie.directors?.map((d: any) => ({ name: d.name })) || [],
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error)
    return {
      title: "Movie Details",
      description: "Explore movie details, reviews, and ratings",
    }
  }
}

export default function MovieLayout({ children }: Props) {
  return <>{children}</>
}

