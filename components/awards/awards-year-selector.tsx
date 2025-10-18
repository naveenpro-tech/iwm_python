"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AwardsYearSelector() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Awards Season {selectedYear}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedYear((prev) => Math.min(prev + 1, currentYear))}
            disabled={selectedYear >= currentYear}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Year</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedYear((prev) => Math.max(prev - 1, currentYear - 9))}
            disabled={selectedYear <= currentYear - 9}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Year</span>
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
        {years.map((year) => (
          <Button
            key={year}
            variant={year === selectedYear ? "default" : "outline"}
            className={`min-w-[80px] ${year === selectedYear ? "bg-primary text-white" : ""}`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </motion.div>
  )
}
