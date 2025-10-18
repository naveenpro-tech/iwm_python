"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash, Eye, Copy, BarChart, Archive, HelpCircle, Users, Target } from "lucide-react"

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

interface QuizGridViewProps {
  searchQuery: string
}

export function QuizGridView({ searchQuery }: QuizGridViewProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockQuizzes.map((quiz, index) => (
        <motion.div
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{quiz.movie}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={16} />
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
              </div>
              <div className="flex gap-2 mt-3">
                <Badge className={getStatusColor(quiz.status)} variant="secondary">
                  {quiz.status}
                </Badge>
                <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                  {quiz.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <HelpCircle size={16} className="text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-semibold">{quiz.questions}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Users size={16} className="text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-semibold">{quiz.completions}</p>
                  <p className="text-xs text-muted-foreground">Completions</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Target size={16} className="text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-semibold">{quiz.avgScore > 0 ? `${quiz.avgScore}%` : "-"}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-sm text-muted-foreground">Created {new Date(quiz.createdAt).toLocaleDateString()}</p>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
