"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Film, TrendingUp, Calendar, Users, Award } from "lucide-react"

interface FeatureTourStepProps {
  onNext: () => void
  onPrevious: () => void
}

export default function FeatureTourStep({ onNext, onPrevious }: FeatureTourStepProps) {
  const features = [
    {
      icon: <Film className="text-[#00BFFF]" size={24} />,
      title: "Global Movies",
      description: "Discover cinematic masterpieces from around the world with verified reviews and insights.",
    },
    {
      icon: <TrendingUp className="text-[#00BFFF]" size={24} />,
      title: "Siddu Pulse",
      description: "Stay updated with the latest trends, discussions, and news from the entertainment world.",
    },
    {
      icon: <Calendar className="text-[#00BFFF]" size={24} />,
      title: "Movie Calendar",
      description: "Never miss a release with our comprehensive movie calendar and notifications.",
    },
    {
      icon: <Search className="text-[#00BFFF]" size={24} />,
      title: "Scene Explorer",
      description: "Search and explore iconic scenes, dialogues, and moments from your favorite films.",
    },
    {
      icon: <Users className="text-[#00BFFF]" size={24} />,
      title: "Talent Hub",
      description: "Connect with industry professionals and explore casting opportunities.",
    },
    {
      icon: <Award className="text-[#00BFFF]" size={24} />,
      title: "Cricket Updates",
      description: "Get real-time cricket updates, match details, and player statistics.",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Discover Siddu Features</h2>
      <p className="text-[#E0E0E0] mb-6">
        Explore the key features that make Siddu your ultimate entertainment destination.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-[#282828] p-4 rounded-lg flex items-start"
          >
            <div className="mr-3 mt-1">{feature.icon}</div>
            <div>
              <h3 className="text-white font-medium mb-1">{feature.title}</h3>
              <p className="text-[#E0E0E0] text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333]">
          Back
        </Button>

        <Button onClick={onNext} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white">
          Continue
        </Button>
      </div>
    </motion.div>
  )
}
