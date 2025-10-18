"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import ExportButton from "../shared/export-button"

// Sample data
const data = [
  {
    id: 1,
    title: "Inception",
    views: 24892,
    rating: 4.8,
    engagement: "High",
    trend: "up",
  },
  {
    id: 2,
    title: "The Dark Knight",
    views: 18743,
    rating: 4.9,
    engagement: "High",
    trend: "up",
  },
  {
    id: 3,
    title: "Interstellar",
    views: 15621,
    rating: 4.7,
    engagement: "Medium",
    trend: "up",
  },
  {
    id: 4,
    title: "Parasite",
    views: 12458,
    rating: 4.6,
    engagement: "High",
    trend: "up",
  },
  {
    id: 5,
    title: "Oppenheimer",
    views: 28976,
    rating: 4.8,
    engagement: "High",
    trend: "up",
  },
]

export default function DataTable() {
  const [sorting, setSorting] = useState<{ column: string; direction: "asc" | "desc" }>({
    column: "views",
    direction: "desc",
  })

  const handleSort = (column: string) => {
    if (sorting.column === column) {
      setSorting({
        column,
        direction: sorting.direction === "asc" ? "desc" : "asc",
      })
    } else {
      setSorting({
        column,
        direction: "desc",
      })
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sorting.column as keyof typeof a]
    const bValue = b[sorting.column as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sorting.direction === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sorting.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Top Performing Content</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
            <ExportButton data={data} filename="top-content.csv" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("title")}>
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("views")}>
                    Views
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("rating")}>
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort("engagement")}>
                    Engagement
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.views.toLocaleString()}</TableCell>
                  <TableCell>{row.rating}</TableCell>
                  <TableCell>
                    <Badge variant={row.engagement === "High" ? "default" : "secondary"}>{row.engagement}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center ${row.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {row.trend === "up" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
