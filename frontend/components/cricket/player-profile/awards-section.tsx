"use client"

import { motion } from "framer-motion"
import { Calendar, Medal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface AwardsSectionProps {
  awards: {
    id: string
    title: string
    year: string
    description: string
    imageUrl?: string
    category: string
  }[]
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Awards & Recognition
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {awards.map((award, index) => (
          <motion.div
            key={award.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-[#282828] border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="relative w-1/3 min-h-[160px]">
                    <Image
                      src={award.imageUrl || "/khel-ratna-award.png"}
                      alt={award.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-[#00BFFF]" />
                      <span className="text-sm text-gray-400">{award.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{award.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="h-4 w-4 text-[#00BFFF]" />
                      <span className="text-sm text-gray-300">{award.category}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{award.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
