"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getQuizzes } from "../utils"
import type { QuizFilterOptions } from "../types"
import Link from "next/link"

export function QuizManagementDashboard() {
  const [filters, setFilters] = useState<QuizFilterOptions>({
    status: "all",
    searchQuery: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const quizzes = getQuizzes(filters.status, filters.searchQuery, filters.sortBy, filters.sortOrder)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as any })
  }

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value as any })
  }

  const handleSortOrderToggle = () => {
    setFilters({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500 hover:bg-green-600"
      case "draft":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "archived":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mb-4 md:mb-0"
        >
          Quiz Management
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/admin/quizzes/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Quiz
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-4 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search quizzes..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40">
              <Select value={filters.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                  <SelectItem value="movieReleaseDate">Movie Release</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleSortOrderToggle} className="bg-gray-700 border-gray-600">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={quiz.moviePosterUrl || "/placeholder.svg"}
                  alt={quiz.movieTitle}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(quiz.status)}>
                    {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 text-sm text-gray-400">{new Date(quiz.updatedAt).toLocaleDateString()}</div>
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{quiz.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{quiz.description}</p>
                <div className="text-sm text-gray-400 mb-4">
                  <span className="font-semibold">Movie:</span> {quiz.movieTitle}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-gray-700 text-gray-300">
                    {quiz.numberOfQuestions} Questions
                  </Badge>
                  <Badge variant="outline" className="bg-gray-700 text-gray-300">
                    {quiz.passScore}% to Pass
                  </Badge>
                  {quiz.timeLimit && (
                    <Badge variant="outline" className="bg-gray-700 text-gray-300">
                      {Math.floor(quiz.timeLimit / 60)} min
                    </Badge>
                  )}
                  {quiz.isVerificationRequired ? (
                    <Badge className="bg-blue-600 hover:bg-blue-700">Verification Required</Badge>
                  ) : (
                    <Badge variant="outline" className="border-blue-600 text-blue-400">
                      Verification Optional
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between">
                  <Link href={`/admin/quizzes/${quiz.id}`}>
                    <Button
                      variant="outline"
                      className="text-purple-400 border-purple-400 hover:bg-purple-900 hover:text-purple-200"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/quizzes/${quiz.id}/preview`}>
                    <Button
                      variant="outline"
                      className="text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-blue-200"
                    >
                      Preview
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">No quizzes found</div>
          <Link href="/admin/quizzes/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Quiz
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
