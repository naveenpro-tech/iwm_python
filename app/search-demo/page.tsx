"use client"

import { useState } from "react"
import { SearchOverlay } from "@/components/search/search-overlay"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchDemoPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold font-inter text-[#E0E0E0] mb-8">Search Overlay Demo</h1>

      <Button
        onClick={() => setIsSearchOpen(true)}
        className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter"
      >
        <Search className="mr-2 h-5 w-5" />
        Open Search
      </Button>

      <p className="mt-8 text-[#A0A0A0] font-dmsans text-center max-w-md">
        Click the button above to open the full-screen search overlay. You can also press the Escape key or click
        outside the content area to close it.
      </p>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
