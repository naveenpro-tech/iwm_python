"use client"
import { useRouter } from "next/navigation"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AwardCeremonyCardProps {
  ceremony: {
    id: string
    name: string
    shortName: string
    year: number
    date: string
    location: string
    imageUrl: string
    description: string
    categories: number
    highlights: string[]
  }
}

export function AwardCeremonyCard({ ceremony }: AwardCeremonyCardProps) {
  const router = useRouter()

  // Safely format the date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Date TBA"
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    } catch (error) {
      return "Date TBA"
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ceremony.imageUrl || "/award-ceremony.png"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-primary text-white">
            {ceremony.year}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{ceremony.name}</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(ceremony.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{ceremony.location || "Location TBA"}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{ceremony.description}</p>
        {ceremony.highlights && ceremony.highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Highlights:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
              {ceremony.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={() => router.push(`/awards/${ceremony.id}`)}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
