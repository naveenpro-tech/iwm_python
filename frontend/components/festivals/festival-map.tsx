"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock festival locations
const festivalLocations = [
  {
    id: 1,
    name: "Cannes Film Festival",
    city: "Cannes",
    country: "France",
    lat: 43.5528,
    lng: 7.0174,
    dates: "May 14-25",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Venice Film Festival",
    city: "Venice",
    country: "Italy",
    lat: 45.4408,
    lng: 12.3155,
    dates: "Aug 28 - Sep 7",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Sundance Film Festival",
    city: "Park City",
    country: "USA",
    lat: 40.6461,
    lng: -111.498,
    dates: "Jan 23 - Feb 2",
    status: "past",
  },
  {
    id: 4,
    name: "Toronto International Film Festival",
    city: "Toronto",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832,
    dates: "Sep 5-15",
    status: "upcoming",
  },
  {
    id: 5,
    name: "Berlin International Film Festival",
    city: "Berlin",
    country: "Germany",
    lat: 52.52,
    lng: 13.405,
    dates: "Feb 15-25",
    status: "past",
  },
]

export function FestivalMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Festival Locations Worldwide</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Active Now
          </Badge>
          <Badge variant="outline" className="bg-[#00BFFF]/10 text-[#00BFFF] border-[#00BFFF]/20">
            Upcoming
          </Badge>
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
            Past
          </Badge>
        </div>
      </div>

      {/* Placeholder for actual map - in production, use Mapbox or Google Maps */}
      <Card className="bg-[#282828] border-gray-800 h-[500px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/5 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Interactive World Map</p>
        </div>

        {/* Festival markers */}
        {festivalLocations.map((festival, index) => (
          <motion.div
            key={festival.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute"
            style={{
              top: `${20 + index * 15}%`,
              left: `${15 + index * 12}%`,
            }}
          >
            <div className="relative group cursor-pointer">
              <div
                className={`w-3 h-3 rounded-full ${
                  festival.status === "upcoming"
                    ? "bg-[#00BFFF]"
                    : festival.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                } animate-pulse`}
              />

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Card className="bg-[#1A1A1A] border-gray-700 p-3 whitespace-nowrap">
                  <h3 className="font-semibold text-white text-sm">{festival.name}</h3>
                  <p className="text-xs text-gray-400">
                    {festival.city}, {festival.country}
                  </p>
                  <p className="text-xs text-[#00BFFF] mt-1">{festival.dates}</p>
                </Card>
              </div>
            </div>
          </motion.div>
        ))}
      </Card>

      {/* Festival List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {festivalLocations.map((festival, index) => (
          <motion.div
            key={festival.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#282828] border-gray-800 p-4 hover:bg-[#333] transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{festival.name}</h3>
                <Badge
                  variant="outline"
                  className={
                    festival.status === "upcoming"
                      ? "bg-[#00BFFF]/10 text-[#00BFFF] border-[#00BFFF]/20"
                      : festival.status === "active"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  }
                >
                  {festival.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {festival.city}, {festival.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{festival.dates}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
