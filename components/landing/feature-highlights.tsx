"use client"

import { motion } from "framer-motion"
import { ChevronDown, Star, Shield, Users, Award, TrendingUp, Film } from "lucide-react"

interface FeatureHighlightsProps {
  onContinue: () => void
}

export function FeatureHighlights({ onContinue }: FeatureHighlightsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const features = [
    {
      icon: <Star className="w-6 h-6 text-[#FFD700]" />,
      title: "SidduScore",
      description: "Proprietary rating system with verified user reviews and sentiment analysis",
    },
    {
      icon: <Shield className="w-6 h-6 text-[#00BFFF]" />,
      title: "Verified Reviews",
      description: "Strict verification system to ensure authentic, trustworthy opinions",
    },
    {
      icon: <Users className="w-6 h-6 text-[#FFD700]" />,
      title: "Talent Hub",
      description: "Transparent platform for casting calls and talent discovery",
    },
    {
      icon: <Award className="w-6 h-6 text-[#00BFFF]" />,
      title: "Industry Profiles",
      description: "Official presence for verified filmmakers with data-driven insights",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#FFD700]" />,
      title: "Cricket System",
      description: "Dedicated hub for live scores, schedules, and comprehensive statistics",
    },
    {
      icon: <Film className="w-6 h-6 text-[#00BFFF]" />,
      title: "Scene Explorer",
      description: "Dive deep into iconic movie scenes with interactive exploration",
    },
  ]

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-12 text-center font-inter"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#FFD700]">
          Unparalleled Features
        </span>
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-[#282828] rounded-xl p-6 border border-[#3A3A3A] hover:border-[#00BFFF]/50 transition-colors duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-[#1A1A1A] mr-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#E0E0E0] font-inter">{feature.title}</h3>
            </div>
            <p className="text-[#A0A0A0] font-dmsans">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute bottom-8 cursor-pointer"
        onClick={onContinue}
      >
        <ChevronDown size={32} className="text-[#E0E0E0]" />
      </motion.div>
    </div>
  )
}
