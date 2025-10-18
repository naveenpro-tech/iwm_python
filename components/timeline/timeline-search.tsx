"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TimelineSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function TimelineSearch({ searchTerm, setSearchTerm }: TimelineSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <Input
        type="text"
        placeholder="Search timeline events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-1 focus:ring-[#00BFFF] focus:border-[#00BFFF]"
        aria-label="Search timeline events"
      />
    </div>
  )
}
