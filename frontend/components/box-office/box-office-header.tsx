"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Globe, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BoxOfficeHeader() {
  const [selectedRegion, setSelectedRegion] = useState("global")
  const [selectedPeriod, setSelectedPeriod] = useState("weekend")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Box Office Dashboard</h1>
          <p className="text-gray-400">Track global box office performance and trends</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px] bg-[#282828] border-gray-700">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-gray-700">
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="china">China</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[160px] bg-[#282828] border-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-gray-700">
              <SelectItem value="weekend">This Weekend</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
