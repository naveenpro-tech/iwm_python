// This file was updated in the previous response and should be correct.
// Ensuring it's here for completeness.
"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Star, MessageSquare, Video, ExternalLink } from "lucide-react"

interface CoverageItem {
  id: string
  type: "review" | "article" | "interview" | "video"
  title: string
  source: string // e.g., Siddu Reviews, Variety, THR
  author?: string
  publicationDate: string // ISO Date string
  excerpt?: string
  imageUrl?: string
  link: string // External link to the full content
  rating?: number // For reviews
  sentiment?: "positive" | "neutral" | "negative" // For articles/reviews
}

interface FestivalCoverageProps {
  festivalId: string
  // In a real app, you'd fetch this data based on festivalId
  coverageItems?: CoverageItem[]
}

const mockCoverageItems: CoverageItem[] = [
  {
    id: "review-1",
    type: "review",
    title: "First Look: Competition Films Impress at Cannes",
    source: "Siddu Reviews",
    author: "Sarah Chen",
    publicationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    imageUrl: "/placeholder.svg?height=200&width=300",
    link: "#",
    rating: 4.5,
    excerpt:
      "The initial slate of competition films at Cannes 2025 showcases bold directorial visions and powerhouse performances. A strong start to the festival.",
    sentiment: "positive",
  },
  {
    id: "article-1",
    type: "article",
    title: "Cannes Market Buzz: Hot Titles and Emerging Trends",
    source: "Variety",
    publicationDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    imageUrl: "/placeholder.svg?height=200&width=300",
    link: "#",
    excerpt:
      "The Marché du Film is bustling with activity. We break down the most talked-about projects and distribution deals taking shape.",
  },
  // Add more mock items if needed
]

const getTypeIcon = (type: CoverageItem["type"]) => {
  switch (type) {
    case "review":
      return <Star className="h-4 w-4 text-yellow-400" />
    case "article":
      return <Newspaper className="h-4 w-4 text-sky-400" />
    case "interview":
      return <MessageSquare className="h-4 w-4 text-green-400" />
    case "video":
      return <Video className="h-4 w-4 text-red-400" />
    default:
      return null
  }
}

export function FestivalCoverage({ festivalId, coverageItems = mockCoverageItems }: FestivalCoverageProps) {
  if (!coverageItems || coverageItems.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <Newspaper className="mx-auto h-12 w-12 mb-2 opacity-50" />
        No coverage available for this festival yet. Check back soon!
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6">
      <h2 className="text-3xl font-bold text-gray-100 px-4 md:px-0">Festival Coverage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {coverageItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700 text-gray-100 h-full flex flex-col overflow-hidden hover:shadow-xl hover:shadow-sky-500/20 transition-shadow duration-300">
              {item.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} layout="fill" objectFit="cover" />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={item.type === "review" ? "default" : "secondary"}
                    className={
                      item.type === "review"
                        ? "bg-yellow-500 text-black"
                        : item.type === "article"
                          ? "bg-sky-600"
                          : item.type === "interview"
                            ? "bg-green-600"
                            : "bg-red-600"
                    }
                  >
                    {getTypeIcon(item.type)}
                    <span className="ml-1.5 capitalize">{item.type}</span>
                  </Badge>
                  {item.rating && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-5 w-5 mr-1 fill-current" />
                      <span className="font-semibold">{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl leading-tight hover:text-sky-400 transition-colors">
                  <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-400 line-clamp-3">{item.excerpt}</p>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 border-t border-gray-700 pt-3 flex justify-between items-center">
                <div>
                  <span>{item.source}</span>
                  {item.author && <span> by {item.author}</span>}
                  <span className="mx-1">•</span>
                  <span>{new Date(item.publicationDate).toLocaleDateString()}</span>
                </div>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 flex items-center"
                >
                  Read More <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
