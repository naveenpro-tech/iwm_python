"use client"

import { useState } from "react"
import { QuizManagementTable } from "@/components/admin/quizzes/quiz-management-table"
import { QuizGridView } from "@/components/admin/quizzes/quiz-grid-view"
import { QuizListingHeader } from "@/components/admin/quizzes/quiz-listing-header"
import { motion } from "framer-motion"

export default function QuizManagementPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage movie quizzes for user verification and engagement
        </p>
      </motion.div>

      <QuizListingHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {viewMode === "table" ? (
        <QuizManagementTable searchQuery={searchQuery} />
      ) : (
        <QuizGridView searchQuery={searchQuery} />
      )}
    </div>
  )
}
