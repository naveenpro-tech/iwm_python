"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { InfluenceSnapshotCardProps } from "./types"
import { TrendingUp, TrendingDown } from "lucide-react"
import AnimatedNumber from "@/components/effects/animated-number" // Ensure this path is correct

export const InfluenceSnapshotCard: React.FC<InfluenceSnapshotCardProps> = ({ item, isActive }) => {
  const IconComponent = item.icon
  const hasChange = typeof item.change === "number"
  const isPositiveChange = hasChange && item.change! > 0
  const isNegativeChange = hasChange && item.change! < 0

  const cardVariants = {
    initial: { opacity: 0, y: -20, filter: "blur(5px)" },
    animate: {
      opacity: isActive ? 1 : 0.7,
      y: isActive ? 0 : -10,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-6 rounded-xl shadow-xl h-full flex flex-col justify-center border border-gray-700 hover:border-primary/70 transition-all duration-300 min-h-[220px] md:min-h-[240px]"
    >
      <div className="flex items-center mb-3">
        <IconComponent className={`w-7 h-7 mr-3 ${item.color}`} />
        <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
      </div>
      <div className="text-4xl font-bold text-gray-50 mb-1">
        <AnimatedNumber
          value={
            typeof item.metricValue === "number" ? item.metricValue : Number.parseFloat(item.metricValue.toString())
          }
        />
        {item.metricUnit && <span className="text-2xl text-gray-400 ml-1">{item.metricUnit}</span>}
      </div>
      {hasChange && (
        <div
          className={`flex items-center text-sm font-medium ${isPositiveChange ? "text-green-400" : isNegativeChange ? "text-red-400" : "text-gray-500"}`}
        >
          {isPositiveChange && <TrendingUp className="w-4 h-4 mr-1" />}
          {isNegativeChange && <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(item.change!)}% {isPositiveChange ? "increase" : isNegativeChange ? "decrease" : "change"}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">{item.description}</p>
    </motion.div>
  )
}
