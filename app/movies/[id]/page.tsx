"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { MovieHeroSection } from "@/components/movie-hero-section"
import { MovieInfoSection } from "@/components/movie-info-section"
import { MovieScenesSection } from "@/components/scene-explorer/movie-scenes-section"
import { ReviewSystemSection } from "@/components/review-system-section"
import { RelatedMoviesSection } from "@/components/related-movies-section"
import { SidduPulseSection } from "@/components/siddu-pulse-section"
import { WhereToWatchSection } from "@/components/where-to-watch-section"
import { MovieDetailsNavigation } from "@/components/movie-details-navigation"
import Link from "next/link"

// Mock movie data
const movieData = {
  id: "tt1375666",
  title: "Inception",
  backdropUrl: "/dark-blue-city-skyline.png",
  posterUrl: "/inception-movie-poster.png",
  year: "2010",
  duration: "2h 28m",
  language: "English",
  rating: "PG-13",
  sidduScore: 9.2,
  criticsScore: 8.8,
  reviewCount: 1458,
  ratingDistribution: [
    { rating: 10, count: 642 },
    { rating: 9, count: 423 },
    { rating: 8, count: 215 },
    { rating: 7, count: 98 },
    { rating: 6, count: 35 },
    { rating: 5, count: 22 },
    { rating: 4, count: 12 },
    { rating: 3, count: 6 },
    { rating: 2, count: 3 },
    { rating: 1, count: 2 },
  ],
  sentimentAnalysis: {
    positive: 78,
    neutral: 15,
    negative: 7,
    keyPhrases: ["Mind-bending", "Visually stunning", "Great acting", "Complex plot", "Nolan masterpiece"],
  },
  synopsis:
    "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved.",
  directors: [{ id: "nm0634240", name: "Christopher Nolan", role: "Director" }],
  writers: [{ id: "nm0634240", name: "Christopher Nolan", role: "Writer" }],
  producers: [
    { id: "nm0634240", name: "Christopher Nolan", role: "Producer" },
    { id: "nm0185584", name: "Emma Thomas", role: "Producer" },
  ],
  genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
  cast: [
    {
      id: "nm0000138",
      name: "Leonardo DiCaprio",
      role: "Actor",
      character: "Dom Cobb",
      profileUrl: "/leonardo-dicaprio.png",
    },
    {
      id: "nm0330687",
      name: "Joseph Gordon-Levitt",
      role: "Actor",
      character: "Arthur",
      profileUrl: "/joseph-gordon-levitt.png",
    },
    {
      id: "nm0680983",
      name: "Elliot Page",
      role: "Actor",
      character: "Ariadne",
      profileUrl: "/elliot-page.png",
    },
    {
      id: "nm0362766",
      name: "Tom Hardy",
      role: "Actor",
      character: "Eames",
      profileUrl: "/tom-hardy.png",
    },
    {
      id: "nm0913822",
      name: "Ken Watanabe",
      role: "Actor",
      character: "Saito",
      profileUrl: "/ken-watanabe.png",
    },
    {
      id: "nm0614165",
      name: "Dileep Rao",
      role: "Actor",
      character: "Yusuf",
      profileUrl: "/dileep-rao.png",
    },
    {
      id: "nm0000297",
      name: "Michael Caine",
      role: "Actor",
      character: "Miles",
      profileUrl: "/michael-caine.png",
    },
    {
      id: "nm1567113",
      name: "Marion Cotillard",
      role: "Actor",
      character: "Mal",
      profileUrl: "/marion-cotillard.png",
    },
  ],
  featuredScene: {
    thumbnailUrl: "/inception-scene-thumbnail.png",
    title: "The Rotating Hallway Fight",
    timestamp: "1:23:45",
    duration: "3:12",
  },
  reviews: [
    {
      id: "r1",
      userId: "u1",
      username: "MovieBuff42",
      avatarUrl: "/user-avatar-1.png",
      rating: 10,
      verified: true,
      date: "2 days ago",
      content:
        "Christopher Nolan's 'Inception' is a masterpiece of modern cinema that seamlessly blends mind-bending concepts with breathtaking visuals. The film's exploration of dreams within dreams creates a labyrinthine narrative that rewards multiple viewings. Leonardo DiCaprio delivers one of his finest performances as Cobb, a man haunted by his past and seeking redemption. The supporting cast, including Joseph Gordon-Levitt and Marion Cotillard, is equally impressive. Hans Zimmer's score perfectly complements the film's tone, with 'Time' being particularly memorable. The rotating hallway fight scene remains one of the most innovative action sequences in recent memory. While some viewers might find the plot overly complex, the emotional core of the story grounds the high-concept premise. A true cinematic achievement that continues to inspire discussion and analysis years after its release.",
      containsSpoilers: false,
      helpfulCount: 128,
      unhelpfulCount: 12,
    },
    {
      id: "r2",
      userId: "u2",
      username: "FilmCritic101",
      avatarUrl: "/user-avatar-2.png",
      rating: 9,
      verified: true,
      date: "1 week ago",
      content:
        "Inception stands as one of Nolan's most ambitious works, blending high-concept science fiction with emotional depth. The dream-heist premise is executed with precision, though the exposition can feel heavy-handed at times. The film's greatest strength lies in its visual storytelling - the folding Paris scene and zero-gravity hotel fight are particularly stunning. The ending remains perfectly ambiguous, leaving viewers to debate whether Cobb's top stops spinning. My only critique is that some characters feel underdeveloped, serving mainly as vehicles for explaining the dream mechanics. Despite this minor flaw, the film remains a landmark achievement in cinema.",
      containsSpoilers: false,
      helpfulCount: 95,
      unhelpfulCount: 8,
    },
    {
      id: "r3",
      userId: "u3",
      username: "DreamExplorer",
      avatarUrl: "/user-avatar-3.png",
      rating: 10,
      verified: false,
      date: "2 weeks ago",
      content:
        "This film completely changed how I view dreams and reality. The way Nolan constructs the dream layers is genius, and the rules of the dream world are internally consistent. The emotional core of the story - Cobb's guilt over Mal's death and his desperate desire to return to his children - gives weight to the high-concept premise. SPOILER ALERT: The ending with the spinning top is perfect - we don't need to know if Cobb is in reality or a dream, because he's finally accepted his reality and reunited with his children. That's what matters. The scene where Mal appears on the ledge across from Ariadne, explaining how she planted the idea in Mal's mind that her world wasn't real, is heartbreaking. The way this film explores grief and guilt through the metaphor of dreams is incredibly powerful.",
      containsSpoilers: true,
      helpfulCount: 87,
      unhelpfulCount: 5,
    },
    {
      id: "r4",
      userId: "u4",
      username: "CasualViewer",
      avatarUrl: "/user-avatar-4.png",
      rating: 7,
      verified: true,
      date: "3 weeks ago",
      content:
        "Inception is visually impressive and has some great action sequences, but I found the plot unnecessarily convoluted. Sometimes it feels like the film is being complex just for the sake of it. That said, the performances are strong across the board, and the special effects hold up remarkably well. The concept of dream invasion is fascinating, even if the execution gets muddled at times. Worth watching, but be prepared to pay close attention.",
      containsSpoilers: false,
      helpfulCount: 42,
      unhelpfulCount: 15,
    },
  ],
  relatedMovies: [
    {
      id: "tt0816692",
      title: "Interstellar",
      posterUrl: "/interstellar-poster.png",
      sidduScore: 9.0,
    },
    {
      id: "tt1130884",
      title: "Shutter Island",
      posterUrl: "/shutter-island-poster.png",
      sidduScore: 8.5,
    },
    {
      id: "tt0468569",
      title: "The Dark Knight",
      posterUrl: "/dark-knight-poster.png",
      sidduScore: 9.5,
    },
    {
      id: "tt0137523",
      title: "Fight Club",
      posterUrl: "/fight-club-poster.png",
      sidduScore: 8.8,
    },
    {
      id: "tt0133093",
      title: "The Matrix",
      posterUrl: "/matrix-poster.png",
      sidduScore: 9.1,
    },
    {
      id: "tt0482571",
      title: "The Prestige",
      posterUrl: "/prestige-poster.png",
      sidduScore: 8.7,
    },
    {
      id: "tt0209144",
      title: "Memento",
      posterUrl: "/memento-poster.png",
      sidduScore: 8.6,
    },
    {
      id: "tt1853728",
      title: "Django Unchained",
      posterUrl: "/django-unchained-poster.png",
      sidduScore: 8.9,
    },
  ],
  pulses: [
    {
      id: "p1",
      userId: "u5",
      username: "DreamArchitect",
      isVerified: true,
      avatarUrl: "/user-avatar-5.png",
      timestamp: "3 hours ago",
      content:
        "Just rewatched Inception for the 10th time and I'm still noticing new details. The way the music slows down in the deeper dream levels is pure genius. #Inception #Nolan #FilmDetails",
      hashtags: ["Inception", "Nolan", "FilmDetails"],
      likes: 87,
      comments: 12,
      shares: 5,
      userHasLiked: false,
    },
    {
      id: "p2",
      userId: "u6",
      username: "CinematicDreamer",
      isVerified: false,
      avatarUrl: "/user-avatar-6.png",
      timestamp: "Yesterday",
      content:
        "That moment when the city folds in on itself still gives me chills. Visual effects that actually serve the story rather than just looking cool. #Inception #VisualEffects",
      hashtags: ["Inception", "VisualEffects"],
      likes: 54,
      comments: 8,
      shares: 2,
      userHasLiked: true,
    },
    {
      id: "p3",
      userId: "u7",
      username: "FilmComposerFan",
      isVerified: true,
      avatarUrl: "/user-avatar-7.png",
      timestamp: "2 days ago",
      content:
        "Hans Zimmer's score for Inception is a masterpiece on its own. The way 'Time' builds to that emotional climax... I get goosebumps every single time. Listening to it on repeat today. #Inception #HansZimmer #FilmScore",
      hashtags: ["Inception", "HansZimmer", "FilmScore"],
      likes: 112,
      comments: 23,
      shares: 15,
      userHasLiked: false,
    },
    {
      id: "p4",
      userId: "u8",
      username: "MovieTheories",
      isVerified: true,
      avatarUrl: "/user-avatar-8.png",
      timestamp: "3 days ago",
      content:
        "My theory: The entire movie is Cobb's dream, not just the ending. Notice how we never see how the inception idea actually originated? That's because Cobb is the one being incepted. #Inception #FilmTheories #MindBlown",
      hashtags: ["Inception", "FilmTheories", "MindBlown"],
      likes: 203,
      comments: 45,
      shares: 28,
      userHasLiked: true,
    },
    {
      id: "p5",
      userId: "u9",
      username: "CasualMovieGoer",
      isVerified: false,
      avatarUrl: "/user-avatar-9.png",
      timestamp: "1 week ago",
      content:
        "Unpopular opinion: Inception is good but overrated. The exposition is too heavy-handed and some of the dream logic doesn't hold up to scrutiny. Still a solid 7/10 though. #Inception #UnpopularOpinion",
      hashtags: ["Inception", "UnpopularOpinion"],
      likes: 31,
      comments: 67,
      shares: 3,
      userHasLiked: false,
    },
  ],
  streamingOptions: {
    US: [
      {
        id: "netflix-us-sub",
        provider: "Netflix",
        logoUrl: "/netflix-inspired-logo.png",
        type: "subscription",
        quality: "4K",
        url: "https://www.netflix.com/title/70131314",
        verified: true,
      },
      {
        id: "hbo-max-us-sub",
        provider: "HBO Max",
        logoUrl: "/hbo-max-logo.png",
        type: "subscription",
        quality: "HD",
        url: "https://play.hbomax.com/page/urn:hbo:page:GXdkpqAvDDaXCPQEAADe7:type:feature",
        verified: true,
      },
      {
        id: "amazon-us-rent",
        provider: "Amazon Prime Video",
        logoUrl: "/amazon-prime-video-logo.png",
        type: "rent",
        price: "$3.99",
        quality: "HD",
        url: "https://www.amazon.com/Inception-Leonardo-DiCaprio/dp/B0047WJ11G",
        verified: true,
      },
      {
        id: "amazon-us-buy",
        provider: "Amazon Prime Video",
        logoUrl: "/amazon-prime-video-logo.png",
        type: "buy",
        price: "$14.99",
        quality: "4K",
        url: "https://www.amazon.com/Inception-Leonardo-DiCaprio/dp/B0047WJ11G",
        verified: true,
      },
      {
        id: "apple-us-rent",
        provider: "Apple TV+",
        logoUrl: "/apple-tv-plus-logo.png",
        type: "rent",
        price: "$3.99",
        quality: "HD",
        url: "https://tv.apple.com/us/movie/inception/umc.cmc.5z6ypbvmgzs8e8iabj7mwy3wa",
        verified: true,
      },
      {
        id: "apple-us-buy",
        provider: "Apple TV+",
        logoUrl: "/apple-tv-plus-logo.png",
        type: "buy",
        price: "$14.99",
        quality: "4K",
        url: "https://tv.apple.com/us/movie/inception/umc.cmc.5z6ypbvmgzs8e8iabj7mwy3wa",
        verified: true,
      },
    ],
    UK: [
      {
        id: "netflix-uk-sub",
        provider: "Netflix",
        logoUrl: "/netflix-inspired-logo.png",
        type: "subscription",
        quality: "4K",
        url: "https://www.netflix.com/title/70131314",
        verified: true,
      },
      {
        id: "amazon-uk-rent",
        provider: "Amazon Prime Video",
        logoUrl: "/amazon-prime-video-logo.png",
        type: "rent",
        price: "£3.49",
        quality: "HD",
        url: "https://www.amazon.co.uk/Inception-Leonardo-DiCaprio/dp/B00ET1ORSU",
        verified: true,
      },
      {
        id: "amazon-uk-buy",
        provider: "Amazon Prime Video",
        logoUrl: "/amazon-prime-video-logo.png",
        type: "buy",
        price: "£9.99",
        quality: "4K",
        url: "https://www.amazon.co.uk/Inception-Leonardo-DiCaprio/dp/B00ET1ORSU",
        verified: true,
      },
    ],
    IN: [
      {
        id: "amazon-in-rent",
        provider: "Amazon Prime Video",
        logoUrl: "/amazon-prime-video-logo.png",
        type: "rent",
        price: "₹99",
        quality: "HD",
        url: "https://www.primevideo.com/detail/Inception/0HBINLPFPDQNPC9QLVG0XD9BDZ",
        verified: true,
      },
      {
        id: "amazon-in-buy",
        provider: "Amazon Prime Video",
        logoUrl: "/amazon-prime-video-logo.png",
        type: "buy",
        price: "₹499",
        quality: "HD",
        url: "https://www.primevideo.com/detail/Inception/0HBINLPFPDQNPC9QLVG0XD9BDZ",
        verified: true,
      },
      {
        id: "jiocinema-in-free",
        provider: "JioCinema",
        logoUrl: "/jiocinema-logo.png",
        type: "free",
        quality: "HD",
        url: "https://www.jiocinema.com/movies/inception/3732088",
        verified: false,
      },
    ],
    AU: [
      {
        id: "netflix-au-sub",
        provider: "Netflix",
        logoUrl: "/netflix-inspired-logo.png",
        type: "subscription",
        quality: "4K",
        url: "https://www.netflix.com/title/70131314",
        verified: true,
      },
      {
        id: "stan-au-sub",
        provider: "Stan",
        logoUrl: "/generic-streaming-logo.png",
        type: "subscription",
        quality: "HD",
        url: "https://www.stan.com.au/watch/inception",
        verified: true,
      },
    ],
  },
}

export default function MovieDetailsPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const movieId = params.id

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#1A1A1A]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link href="/movies" className="text-[#E0E0E0] hover:text-[#00BFFF] transition-colors">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <MovieHeroSection movie={movieData} />

      {/* Navigation */}
      <MovieDetailsNavigation movieId={movieId} movieTitle={movieData.title} />

      {/* Key Information & Cast Section */}
      <MovieInfoSection movie={movieData} />

      {/* Where to Watch Section */}
      <WhereToWatchSection
        movieId={movieData.id}
        movieTitle={movieData.title}
        streamingOptions={movieData.streamingOptions}
        userRegion="US"
      />

      {/* Movie Scenes Section - NEW COMPONENT */}
      <MovieScenesSection movieId={movieData.id} movieTitle={movieData.title} limit={4} showViewAll={true} />

      {/* Review System Section */}
      <ReviewSystemSection movie={movieData} />

      {/* Related Movies Section */}
      <RelatedMoviesSection movies={movieData.relatedMovies} />

      {/* Siddu Pulse Section */}
      <SidduPulseSection movieTitle={movieData.title} movieId={movieData.id} pulses={movieData.pulses} />

      {/* Rest of the content would go here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* This is just a placeholder for the rest of the movie details page */}
        <div className="h-[20vh] flex items-center justify-center text-[#A0A0A0] text-lg font-dmsans">
          Additional movie details would appear here
        </div>
      </div>
    </div>
  )
}
