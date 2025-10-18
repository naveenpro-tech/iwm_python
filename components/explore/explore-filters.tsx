"use client"

import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface ExploreFiltersProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
}

export function ExploreFilters({ activeFilters, onFilterToggle }: ExploreFiltersProps) {
  const filterSections = [
    {
      title: "Genres",
      filters: [
        { id: "action", label: "Action" },
        { id: "comedy", label: "Comedy" },
        { id: "drama", label: "Drama" },
        { id: "sci-fi", label: "Sci-Fi" },
        { id: "thriller", label: "Thriller" },
        { id: "horror", label: "Horror" },
      ],
    },
    {
      title: "Languages",
      filters: [
        { id: "english", label: "English" },
        { id: "hindi", label: "Hindi" },
        { id: "tamil", label: "Tamil" },
        { id: "telugu", label: "Telugu" },
        { id: "malayalam", label: "Malayalam" },
        { id: "japanese", label: "Japanese" },
      ],
    },
    {
      title: "Release Year",
      filters: [
        { id: "2024", label: "2024" },
        { id: "2023", label: "2023" },
        { id: "2022", label: "2022" },
        { id: "2021", label: "2021" },
        { id: "2020", label: "2020" },
        { id: "older", label: "Older" },
      ],
    },
  ]

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      className="bg-[#282828] rounded-lg p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {filterSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1 * sectionIndex,
              },
            },
          }}
        >
          <h3 className="text-lg font-medium mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.filters.map((filter) => (
              <motion.div key={filter.id} className="flex items-center space-x-2" variants={itemVariants}>
                <Checkbox
                  id={filter.id}
                  checked={activeFilters.includes(filter.id)}
                  onCheckedChange={() => onFilterToggle(filter.id)}
                  className="data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                />
                <Label htmlFor={filter.id} className="text-sm cursor-pointer">
                  {filter.label}
                </Label>
              </motion.div>
            ))}
          </div>

          {sectionIndex < filterSections.length - 1 && <Separator className="my-4 bg-[#3A3A3A]" />}
        </motion.div>
      ))}
    </motion.div>
  )
}
