"use client"

import type { CricketMatch } from "../types"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Users, Calendar, Clock, Cloud } from "lucide-react"
import { format } from "date-fns"

interface MatchVenueInfoProps {
  match: CricketMatch
}

export function MatchVenueInfo({ match }: MatchVenueInfoProps) {
  const venue = match.venue

  // Generate mock weather data
  const generateWeatherData = () => {
    const weatherTypes = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
    const temperatures = Array.from({ length: 5 }, () => Math.floor(Math.random() * 15) + 20) // 20-35°C
    const humidity = Array.from({ length: 5 }, () => Math.floor(Math.random() * 30) + 50) // 50-80%
    const windSpeed = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 5) // 5-25 km/h

    return Array.from({ length: 5 }, (_, i) => ({
      time: format(new Date(match.startTime).setHours(9 + i * 3), "h:mm a"),
      type: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      temperature: temperatures[i],
      humidity: humidity[i],
      windSpeed: windSpeed[i],
    }))
  }

  const weatherData = generateWeatherData()

  // Generate mock pitch report
  const generatePitchReport = () => {
    const pitchTypes = [
      "Batting friendly with even bounce",
      "Dry surface with some turn for spinners",
      "Green top offering assistance to seamers",
      "Balanced pitch with something for everyone",
      "Slow and low, might be difficult for stroke play",
    ]

    return pitchTypes[Math.floor(Math.random() * pitchTypes.length)]
  }

  const pitchReport = generatePitchReport()

  // Generate mock venue stats
  const generateVenueStats = () => {
    return {
      averageFirstInningsScore: Math.floor(Math.random() * 100) + 150,
      averageSecondInningsScore: Math.floor(Math.random() * 100) + 140,
      highestTotal: Math.floor(Math.random() * 100) + 200,
      lowestTotal: Math.floor(Math.random() * 50) + 80,
      battingFirst: Math.floor(Math.random() * 30) + 20,
      battingSecond: Math.floor(Math.random() * 30) + 20,
    }
  }

  const venueStats = generateVenueStats()

  return (
    <div className="space-y-6">
      {/* Venue overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#282828] rounded-lg overflow-hidden"
      >
        <div className="relative h-48 w-full">
          <Image
            src={venue.image || "/placeholder.svg?height=400&width=800&query=cricket stadium"}
            alt={venue.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-2xl font-bold text-white">{venue.name}</h2>
            <div className="flex items-center text-white/80">
              <MapPin size={16} className="mr-1" />
              <span>
                {venue.city}, {venue.country}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Users size={20} className="text-[#A0A0A0] mr-3" />
              <div>
                <div className="text-sm text-[#A0A0A0]">Capacity</div>
                <div className="text-[#E0E0E0] font-medium">{venue.capacity?.toLocaleString() || "Unknown"}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar size={20} className="text-[#A0A0A0] mr-3" />
              <div>
                <div className="text-sm text-[#A0A0A0]">Match Date</div>
                <div className="text-[#E0E0E0] font-medium">{format(new Date(match.startTime), "MMMM d, yyyy")}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Clock size={20} className="text-[#A0A0A0] mr-3" />
              <div>
                <div className="text-sm text-[#A0A0A0]">Match Time</div>
                <div className="text-[#E0E0E0] font-medium">{format(new Date(match.startTime), "h:mm a")}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Weather Forecast</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weatherData.map((weather, index) => (
            <div key={index} className="bg-[#333333] rounded-lg p-3 text-center">
              <div className="text-sm text-[#A0A0A0] mb-2">{weather.time}</div>
              <div className="mb-2">
                <Cloud size={24} className="mx-auto text-[#E0E0E0]" />
              </div>
              <div className="text-[#E0E0E0] font-medium mb-1">{weather.type}</div>
              <div className="text-sm text-[#A0A0A0]">{weather.temperature}°C</div>
              <div className="text-xs text-[#A0A0A0]">Humidity: {weather.humidity}%</div>
              <div className="text-xs text-[#A0A0A0]">Wind: {weather.windSpeed} km/h</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pitch report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Pitch Report</h3>

        <p className="text-[#A0A0A0] mb-4">{pitchReport}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#333333] rounded-lg p-3">
            <h4 className="font-medium text-[#E0E0E0] mb-2">Batting Conditions</h4>
            <ul className="text-sm text-[#A0A0A0] space-y-1">
              <li>• Average first innings score: {venueStats.averageFirstInningsScore}</li>
              <li>• Average second innings score: {venueStats.averageSecondInningsScore}</li>
              <li>• Highest total: {venueStats.highestTotal}</li>
              <li>• Lowest total: {venueStats.lowestTotal}</li>
            </ul>
          </div>

          <div className="bg-[#333333] rounded-lg p-3">
            <h4 className="font-medium text-[#E0E0E0] mb-2">Match Results</h4>
            <ul className="text-sm text-[#A0A0A0] space-y-1">
              <li>• Batting first wins: {venueStats.battingFirst}</li>
              <li>• Batting second wins: {venueStats.battingSecond}</li>
              <li>
                • Win percentage batting first:{" "}
                {Math.round((venueStats.battingFirst / (venueStats.battingFirst + venueStats.battingSecond)) * 100)}%
              </li>
              <li>• Toss winners winning: {Math.round(Math.random() * 20 + 40)}%</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Venue history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Venue History</h3>

        <p className="text-[#A0A0A0] mb-4">
          {venue.name} in {venue.city} is one of the premier cricket venues in {venue.country}. The stadium has hosted
          numerous international matches across all formats of the game.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#333333] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#E0E0E0] mb-1">{Math.floor(Math.random() * 30) + 20}</div>
            <div className="text-sm text-[#A0A0A0]">Test Matches</div>
          </div>

          <div className="bg-[#333333] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#E0E0E0] mb-1">{Math.floor(Math.random() * 50) + 50}</div>
            <div className="text-sm text-[#A0A0A0]">ODI Matches</div>
          </div>

          <div className="bg-[#333333] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#E0E0E0] mb-1">{Math.floor(Math.random() * 40) + 30}</div>
            <div className="text-sm text-[#A0A0A0]">T20 Matches</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
