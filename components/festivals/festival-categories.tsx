"use client"

import { motion } from "framer-motion"
import { Globe, Trophy, Film, Sparkles, Users, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "major-international",
    name: "Major International",
    icon: Globe,
    description: "The world's most prestigious film festivals",
    festivals: ["Cannes", "Venice", "Berlin", "Toronto", "Sundance"],
    color: "text-[#00BFFF]",
  },
  {
    id: "regional-spotlight",
    name: "Regional Spotlight",
    icon: Trophy,
    description: "Celebrating regional cinema excellence",
    festivals: ["MAMI Mumbai", "Busan", "Cairo", "Mar del Plata"],
    color: "text-purple-500",
  },
  {
    id: "genre-specific",
    name: "Genre Specific",
    icon: Film,
    description: "Festivals dedicated to specific genres",
    festivals: ["Fantasia", "Sitges", "SXSW", "Annecy Animation"],
    color: "text-green-500",
  },
  {
    id: "emerging-talent",
    name: "Emerging Talent",
    icon: Sparkles,
    description: "Showcasing new voices in cinema",
    festivals: ["Clermont-Ferrand", "Palm Springs", "Tribeca"],
    color: "text-yellow-500",
  },
  {
    id: "documentary",
    name: "Documentary Focus",
    icon: Camera,
    description: "Celebrating non-fiction storytelling",
    festivals: ["IDFA", "Hot Docs", "Sheffield Doc/Fest"],
    color: "text-orange-500",
  },
  {
    id: "audience-favorites",
    name: "Audience Favorites",
    icon: Users,
    description: "Festivals with strong audience engagement",
    festivals: ["Edinburgh", "Melbourne", "Dubai", "Tokyo"],
    color: "text-pink-500",
  },
]

export function FestivalCategories() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-[#282828] border-gray-800 hover:bg-[#333] transition-colors cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-[#1A1A1A] rounded-lg ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-400">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {category.festivals.map((festival) => (
                      <div key={festival} className="text-sm text-gray-300 hover:text-[#00BFFF] transition-colors">
                        • {festival}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
