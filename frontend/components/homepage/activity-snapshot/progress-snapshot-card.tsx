"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { ProgressSnapshotCardProps } from "./types"
import { ArrowRight } from "lucide-react"

export const ProgressSnapshotCard: React.FC<ProgressSnapshotCardProps> = ({ item, isActive }) => {
  const IconComponent = item.icon

  const cardVariants = {
    initial: { opacity: 0, y: 20, filter: "blur(5px)" },
    animate: {
      opacity: isActive ? 1 : 0.7,
      y: isActive ? 0 : 10,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-6 rounded-xl shadow-xl h-full flex flex-col justify-between border border-gray-700 hover:border-primary/70 transition-all duration-300 min-h-[280px] md:min-h-[300px]"
    >
      <div>
        <div className="flex items-center mb-3">
          <IconComponent className={`w-8 h-8 mr-3 ${item.color.split(" ")[0]}`} />
          <h3 className="text-xl font-semibold text-gray-100">{item.title}</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{item.description}</p>
        <div className="mb-4">
          <Progress
            value={item.percentage}
            className="w-full h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-purple-500 rounded-full"
          />
          <p className="text-xs text-gray-500 mt-1.5 text-right">{item.percentage}% complete</p>
        </div>
      </div>
      {item.ctaText && item.ctaLink && (
        <Link href={item.ctaLink} passHref legacyBehavior>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full group text-gray-300 border-gray-600 hover:bg-primary hover:text-gray-900 hover:border-primary mt-auto"
          >
            <a>
              {item.ctaText}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </Link>
      )}
    </motion.div>
  )
}
