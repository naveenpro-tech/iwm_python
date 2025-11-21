import { Star, ThumbsUp, Eye, MessageSquare, Award } from "lucide-react" // Added more icons
import type { ProgressData, WhatsNextData, InfluenceData, RecommendationData, WeeklyGemData } from "./types"

export const mockProgressData: ProgressData[] = [
  {
    id: "1",
    title: "Film Connoisseur",
    description: "You've watched 75% of the Siddu Classics list! Keep exploring cinematic history.",
    percentage: 75,
    icon: Award, // Changed icon
    color: "text-amber-400 bg-amber-400", // Gold-ish for award
    ctaText: "View Classics List",
    ctaLink: "/collections/classics",
  },
  {
    id: "2",
    title: "Review Contributor",
    description: 'Write 5 more verified reviews to earn the "Trusted Critic" badge.',
    percentage: 50,
    icon: ThumbsUp,
    color: "text-green-500 bg-green-500",
    ctaText: "Write a Review",
    ctaLink: "/reviews/create",
  },
  {
    id: "3",
    title: "Pulse Engager",
    description: 'You are 20 interactions away from "Pulse Influencer" status. Share your thoughts!',
    percentage: 80,
    icon: MessageSquare,
    color: "text-sky-500 bg-sky-500", // Changed color
    ctaText: "Go to Pulse",
    ctaLink: "/pulse",
  },
]

export const mockWhatsNextData: WhatsNextData[] = [
  {
    id: "1",
    title: 'Explore "Dune: Part Two"',
    description: "Dive deep into the world of Arrakis. Reviews, scenes, and exclusive Siddu insights.",
    imageUrl: "/dune-part-two-desert.png",
    category: "Featured Movie",
    ctaText: "Explore Dune",
    ctaLink: "/movies/dune-part-two",
  },
  {
    id: "2",
    title: "Cricket World Cup Highlights",
    description: "Catch up on the latest thrilling moments and expert analysis from the ongoing tournament.",
    imageUrl: "/placeholder-8hlnh.png", // Query: "dynamic cricket match action shot"
    category: "Cricket Hub",
    ctaText: "View Highlights",
    ctaLink: "/cricket/tournaments/world-cup/highlights",
  },
  {
    id: "3",
    title: "New Talent Hub Casting Call",
    description: "An exciting opportunity for aspiring actors in a sci-fi short film. Apply now!",
    imageUrl: "/sci-fi-casting-call.png", // Query: "futuristic casting call poster"
    category: "Talent Hub",
    ctaText: "View Casting Call",
    ctaLink: "/talent-hub/calls/sci-fi-short-123",
  },
]

export const mockInfluenceData: InfluenceData[] = [
  {
    id: "1",
    title: "Reviews Read by Others",
    description: "Your insights are making an impact on the community!",
    metricValue: 1250,
    metricUnit: "Reads",
    change: 15,
    icon: Eye,
    color: "text-teal-400", // Adjusted color
  },
  {
    id: "2",
    title: "Pulse Likes Received",
    description: "Your posts are resonating! Keep the conversation going.",
    metricValue: "850", // Kept as string for AnimatedNumber flexibility
    metricUnit: "Likes",
    icon: ThumbsUp, // Can be Zap or Flame for Pulse
    color: "text-rose-500",
    change: 8,
  },
  {
    id: "3",
    title: "Watchlist Inspirations",
    description: "Users added movies to their watchlist from your recommendations.",
    metricValue: 75,
    metricUnit: "Adds",
    change: 5,
    icon: Star,
    color: "text-yellow-400", // Adjusted color
  },
]

export const mockRecommendationData: RecommendationData[] = [
  {
    id: "1",
    title: "Blade Runner 2049",
    posterUrl: "/blade-runner-2049-poster.png", // Corrected from -inspired
    genres: ["Sci-Fi", "Thriller", "Drama"],
    rating: 4.7,
    reason: "Based on your love for visually stunning sci-fi and complex narratives.",
    ctaLink: "/movies/blade-runner-2049",
  },
  {
    id: "2",
    title: "Parasite",
    posterUrl: "/parasite-movie-poster.png", // Corrected from placeholder
    genres: ["Thriller", "Drama", "Comedy"],
    rating: 4.8,
    reason: 'You rated "Snowpiercer" highly; explore more from Bong Joon-ho.',
    ctaLink: "/movies/parasite",
  },
  {
    id: "3",
    title: "The Handmaiden",
    posterUrl: "/placeholder.svg?width=300&height=450", // Corrected from -inspired
    genres: ["Drama", "Romance", "Thriller"],
    rating: 4.6,
    reason: "For fans of intricate plots, beautiful cinematography, and Park Chan-wook's style.",
    ctaLink: "/movies/the-handmaiden",
  },
]

export const mockWeeklyGemData: WeeklyGemData[] = [
  {
    id: "1",
    title: 'The "Tears in Rain" Monologue',
    description:
      "Revisit Rutger Hauer's iconic speech from Blade Runner. A masterclass in sci-fi poignancy and existentialism.",
    imageUrl: "/placeholder.svg?width=400&height=225",
    category: "Classic Scene",
    tags: ["Sci-Fi", "Monologue", "Iconic", "BladeRunner"],
    ctaText: "Watch Scene",
    ctaLink: "/scene-explorer/blade-runner-tears-in-rain",
  },
  {
    id: "2",
    title: 'Hidden Gem: "Coherence" (2013)',
    description:
      "A mind-bending low-budget sci-fi thriller that will keep you guessing until the very end. Perfect for a movie night.",
    imageUrl: "/placeholder.svg?width=400&height=225",
    category: "Indie Film",
    tags: ["Sci-Fi", "Thriller", "Indie", "Mindbender"],
    ctaText: "Learn More",
    ctaLink: "/movies/coherence",
  },
]
