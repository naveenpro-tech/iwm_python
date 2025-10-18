"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { TextFilters } from "../types"

interface TextFiltersPanelProps {
  filters: TextFilters
  onChange: (filters: TextFilters) => void
}

export function TextFiltersPanel({ filters, onChange }: TextFiltersPanelProps) {
  const [excludeWord, setExcludeWord] = useState("")

  const addExcludeWord = () => {
    if (excludeWord.trim()) {
      onChange({
        ...filters,
        excludeWords: [...(filters.excludeWords || []), excludeWord.trim()],
      })
      setExcludeWord("")
    }
  }

  const removeExcludeWord = (word: string) => {
    onChange({
      ...filters,
      excludeWords: filters.excludeWords?.filter((w) => w !== word),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="exact-phrase" className="text-gray-300">
          Exact Phrase
        </Label>
        <Input
          id="exact-phrase"
          value={filters.exactPhrase || ""}
          onChange={(e) => onChange({ ...filters, exactPhrase: e.target.value })}
          placeholder="Enter exact phrase to search"
          className="bg-[#333333] border-gray-600 text-white"
        />
      </div>

      <div>
        <Label htmlFor="title-contains" className="text-gray-300">
          Title Contains
        </Label>
        <Input
          id="title-contains"
          value={filters.titleContains || ""}
          onChange={(e) => onChange({ ...filters, titleContains: e.target.value })}
          placeholder="Words that must appear in title"
          className="bg-[#333333] border-gray-600 text-white"
        />
      </div>

      <div>
        <Label htmlFor="exclude-words" className="text-gray-300">
          Exclude Words
        </Label>
        <div className="flex gap-2">
          <Input
            id="exclude-words"
            value={excludeWord}
            onChange={(e) => setExcludeWord(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addExcludeWord()}
            placeholder="Add words to exclude"
            className="bg-[#333333] border-gray-600 text-white"
          />
          <button
            onClick={addExcludeWord}
            className="px-4 py-2 bg-[#00BFFF] hover:bg-[#0099CC] rounded text-white transition-colors"
          >
            Add
          </button>
        </div>
        {filters.excludeWords && filters.excludeWords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.excludeWords.map((word) => (
              <Badge key={word} variant="secondary" className="bg-[#333333]">
                {word}
                <button onClick={() => removeExcludeWord(word)} className="ml-2 hover:text-red-400">
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
