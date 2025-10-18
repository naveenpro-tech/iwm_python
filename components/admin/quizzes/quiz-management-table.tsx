"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { MoreHorizontal, Edit, Trash, Eye, Copy, BarChart, Archive } from "lucide-react"

interface Quiz {
  id: string
  title: string
  movie: string
  questions: number
  completions: number
  avgScore: number
  status: "active" | "draft" | "archived"
  difficulty: "easy" | "medium" | "hard"
  createdAt: string
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Inception Deep Dive",
    movie: "Inception",
    questions: 10,
    completions: 1234,
    avgScore: 72,
    status: "active",
    difficulty: "hard",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Oppenheimer Trivia",
    movie: "Oppenheimer",
    questions: 15,
    completions: 856,
    avgScore: 68,
    status: "active",
    difficulty: "medium",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Dune Universe Quiz",
    movie: "Dune: Part Two",
    questions: 12,
    completions: 0,
    avgScore: 0,
    status: "draft",
    difficulty: "medium",
    createdAt: "2024-01-20",
  },
]

interface QuizManagementTableProps {
  searchQuery: string
}

export function QuizManagementTable({ searchQuery }: QuizManagementTableProps) {
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuizzes(mockQuizzes.map((quiz) => quiz.id))
    } else {
      setSelectedQuizzes([])
    }
  }

  const handleSelectQuiz = (quizId: string, checked: boolean) => {
    if (checked) {
      setSelectedQuizzes([...selectedQuizzes, quizId])
    } else {
      setSelectedQuizzes(selectedQuizzes.filter((id) => id !== quizId))
    }
  }

  const getStatusColor = (status: Quiz["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500"
      case "archived":
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getDifficultyColor = (difficulty: Quiz["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-blue-500/10 text-blue-500"
      case "medium":
        return "bg-orange-500/10 text-orange-500"
      case "hard":
        return "bg-red-500/10 text-red-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="border rounded-lg overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox checked={selectedQuizzes.length === mockQuizzes.length} onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Movie</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Completions</TableHead>
            <TableHead>Avg Score</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockQuizzes.map((quiz, index) => (
            <motion.tr
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <TableCell>
                <Checkbox
                  checked={selectedQuizzes.includes(quiz.id)}
                  onCheckedChange={(checked) => handleSelectQuiz(quiz.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-medium">{quiz.title}</TableCell>
              <TableCell>{quiz.movie}</TableCell>
              <TableCell>{quiz.questions}</TableCell>
              <TableCell>{quiz.completions.toLocaleString()}</TableCell>
              <TableCell>{quiz.avgScore > 0 ? `${quiz.avgScore}%` : "-"}</TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                  {quiz.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(quiz.status)} variant="secondary">
                  {quiz.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye size={16} className="mr-2" />
                      Preview Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit size={16} className="mr-2" />
                      Edit Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy size={16} className="mr-2" />
                      Duplicate Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart size={16} className="mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive size={16} className="mr-2" />
                      Archive Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash size={16} className="mr-2" />
                      Delete Quiz
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}
