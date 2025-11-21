"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Film } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FestivalCalendarProps {
  showOnlyUpcoming?: boolean
}

const monthlyFestivals = {
  January: [
    { name: "Sundance", dates: "23-Feb 2", location: "Park City, USA" },
    { name: "Rotterdam", dates: "25-Feb 4", location: "Rotterdam, Netherlands" },
  ],
  February: [
    { name: "Berlin", dates: "15-25", location: "Berlin, Germany" },
    { name: "Glasgow", dates: "21-Mar 3", location: "Glasgow, UK" },
  ],
  May: [{ name: "Cannes", dates: "14-25", location: "Cannes, France" }],
  August: [
    { name: "Venice", dates: "28-Sep 7", location: "Venice, Italy" },
    { name: "Telluride", dates: "30-Sep 2", location: "Colorado, USA" },
  ],
  September: [
    { name: "TIFF", dates: "5-15", location: "Toronto, Canada" },
    { name: "San Sebastian", dates: "20-28", location: "San Sebastian, Spain" },
  ],
  October: [
    { name: "London", dates: "4-15", location: "London, UK" },
    { name: "Mumbai (MAMI)", dates: "27-Nov 5", location: "Mumbai, India" },
  ],
}

export function FestivalCalendar({ showOnlyUpcoming = false }: FestivalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const months = Object.keys(monthlyFestivals)

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      const newMonth = prev + direction
      if (newMonth < 0) return 11
      if (newMonth > 11) return 0
      return newMonth
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-[#00BFFF]" />
          Festival Calendar 2024
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="bg-[#282828] border-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white font-medium w-32 text-center">{months[currentMonth]}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="bg-[#282828] border-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map((month, index) => {
          const festivals = monthlyFestivals[month as keyof typeof monthlyFestivals] || []
          if (festivals.length === 0) return null

          return (
            <motion.div
              key={month}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#282828] border-gray-800 p-4">
                <h3 className="text-lg font-semibold text-white mb-3">{month}</h3>
                <div className="space-y-3">
                  {festivals.map((festival) => (
                    <div
                      key={festival.name}
                      className="bg-[#1A1A1A] rounded-lg p-3 hover:bg-[#333] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-white">{festival.name}</h4>
                        <Film className="h-4 w-4 text-[#00BFFF]" />
                      </div>
                      <p className="text-sm text-gray-400">{festival.dates}</p>
                      <p className="text-xs text-gray-500">{festival.location}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
