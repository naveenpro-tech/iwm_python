"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { WhatsNextSnapshotCardProps } from "./types"
import { Zap } from "lucide-react"

export const WhatsNextSnapshotCard: React.FC<WhatsNextSnapshotCardProps> = ({ item, isActive }) => {
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, filter: "blur(5px)" },
    animate: {
      opacity: isActive ? 1 : 0.7,
      scale: isActive ? 1 : 0.95,
      filter: isActive ? "blur(0px)" : "blur(2px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden h-full flex flex-col border border-gray-700 hover:border-primary/70 transition-all duration-300 group min-h-[420px] md:min-h-[450px]"
    >
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={item.imageUrl || "/placeholder.svg?width=400&height=225&text=Siddu"}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <span className="absolute top-3 right-3 bg-primary/90 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
          {item.category}
        </span>
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-3">{item.description}</p>
        <Link href={item.ctaLink} passHref legacyBehavior>
          <Button
            asChild
            variant="default"
            className="w-full group/button bg-primary hover:bg-primary/90 text-gray-900 mt-auto"
          >
            <a>
              {item.ctaText}
              <Zap className="w-4 h-4 ml-2 group-hover/button:animate-pulse" />
            </a>
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
