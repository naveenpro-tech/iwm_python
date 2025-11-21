"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TopGrossingFilmsTableProps {
  topFilms: any[]
}

export function TopGrossingFilmsTable({ topFilms }: TopGrossingFilmsTableProps) {
  const [sortField, setSortField] = useState<string>("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const mockData = [
    {
      rank: 1,
      title: "Avatar: The Way of Water",
      weekendGross: "$12.4M",
      totalGross: "$2.32B",
      weeksInRelease: 8,
      change: "-5.2%",
      isPositive: false,
      poster: "/avatar-poster.png",
    },
    {
      rank: 2,
      title: "Top Gun: Maverick",
      weekendGross: "$8.7M",
      totalGross: "$1.49B",
      weeksInRelease: 12,
      change: "+2.1%",
      isPositive: true,
      poster: "/top-gun-maverick-inspired-poster.png",
    },
    {
      rank: 3,
      title: "Black Panther: Wakanda Forever",
      weekendGross: "$6.3M",
      totalGross: "$859.2M",
      weeksInRelease: 6,
      change: "-8.9%",
      isPositive: false,
      poster: "/action-movie-poster.png",
    },
    {
      rank: 4,
      title: "Jurassic World Dominion",
      weekendGross: "$4.8M",
      totalGross: "$1.00B",
      weeksInRelease: 15,
      change: "-12.3%",
      isPositive: false,
      poster: "/sci-fi-movie-poster.png",
    },
    {
      rank: 5,
      title: "Doctor Strange 2",
      weekendGross: "$3.2M",
      totalGross: "$956.4M",
      weeksInRelease: 18,
      change: "-15.7%",
      isPositive: false,
      poster: "/generic-sci-fi-poster.png",
    },
  ]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <Card className="bg-[#282828] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Top Grossing Films</CardTitle>
        <p className="text-gray-400 text-sm">Current box office leaders worldwide</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("rank")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Rank {getSortIcon("rank")}
                  </Button>
                </th>
                <th className="text-left py-3 px-2">Movie</th>
                <th className="text-left py-3 px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("weekend")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Weekend {getSortIcon("weekend")}
                  </Button>
                </th>
                <th className="text-left py-3 px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("total")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Total Gross {getSortIcon("total")}
                  </Button>
                </th>
                <th className="text-left py-3 px-2">Weeks</th>
                <th className="text-left py-3 px-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((film, index) => (
                <motion.tr
                  key={film.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-800 hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="py-4 px-2">
                    <span className="text-[#00BFFF] font-bold text-lg">{film.rank}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-8 rounded overflow-hidden">
                        <Image src={film.poster || "/placeholder.svg"} alt={film.title} fill className="object-cover" />
                      </div>
                      <span className="text-white font-medium">{film.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-gray-300">{film.weekendGross}</td>
                  <td className="py-4 px-2 text-white font-medium">{film.totalGross}</td>
                  <td className="py-4 px-2 text-gray-400">{film.weeksInRelease}</td>
                  <td className="py-4 px-2">
                    <span className={film.isPositive ? "text-green-400" : "text-red-400"}>{film.change}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
