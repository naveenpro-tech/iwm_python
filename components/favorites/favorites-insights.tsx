"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, BarChart3, Film, Tv, User, ImageIcon, FileText, Heart } from "lucide-react" // Renamed Image to ImageIcon
import type { FavoriteItem } from "./types"

interface FavoritesInsightsProps {
  favorites: FavoriteItem[]
}

export function FavoritesInsights({ favorites }: FavoritesInsightsProps) {
  if (favorites.length === 0) {
    return <div className="p-4 text-center text-gray-500">Add some favorites to see insights here!</div>
  }

  const typeCounts = favorites.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    },
    {} as Record<FavoriteItem["type"], number>,
  )

  const totalFavorites = favorites.length

  const insightCards = [
    { title: "Total Favorites", value: totalFavorites, icon: <Heart className="h-6 w-6 text-red-500" /> },
    { title: "Movies", value: typeCounts.movie || 0, icon: <Film className="h-6 w-6 text-sky-500" /> },
    { title: "TV Shows", value: typeCounts["tv-show"] || 0, icon: <Tv className="h-6 w-6 text-green-500" /> },
    { title: "People", value: typeCounts.person || 0, icon: <User className="h-6 w-6 text-purple-500" /> },
    { title: "Scenes", value: typeCounts.scene || 0, icon: <ImageIcon className="h-6 w-6 text-orange-500" /> },
    { title: "Articles", value: typeCounts.article || 0, icon: <FileText className="h-6 w-6 text-yellow-500" /> },
  ]

  // Placeholder for more complex charts (e.g., using Recharts)
  // For now, just displaying simple stats.

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-100">Favorites Insights</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {insightCards.map((card) => (
          <Card key={card.title} className="bg-gray-800 border-gray-700 text-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.title !== "Total Favorites" && (
                <p className="text-xs text-gray-400">{((card.value / totalFavorites) * 100).toFixed(1)}% of total</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Placeholder for charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700 text-gray-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-indigo-400" /> Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">Chart visualization of favorite types would go here.</p>
            {/* Example: <PieChartComponent data={typeCountsData} /> */}
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-gray-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-teal-400" /> Activity Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">Chart of favorites added over time would go here.</p>
            {/* Example: <BarChartComponent data={activityData} /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
