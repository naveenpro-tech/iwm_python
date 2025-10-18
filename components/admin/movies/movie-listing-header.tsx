"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  List,
  LayoutGrid,
  Search,
  Filter,
  PlusCircle,
  UploadCloud,
  ChevronDown,
  FileJson,
  DatabaseZap,
} from "lucide-react"
import { useRouter } from "next/navigation" // Corrected import

interface MovieListingHeaderProps {
  viewMode: "table" | "grid"
  onViewModeChange: (mode: "table" | "grid") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  onOpenApiImportModal: () => void
  onOpenJsonImportModal: () => void // New prop for JSON import
  onOpenJsonExportModal: () => void // New prop for JSON export
}

export function MovieListingHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  onOpenApiImportModal,
  onOpenJsonImportModal,
  onOpenJsonExportModal,
}: MovieListingHeaderProps) {
  const router = useRouter()

  const handleAddNewMovie = () => {
    router.push("/admin/movies/new")
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full md:w-80"
            aria-label="Search movies"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={onToggleFilters} className="gap-2">
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          <div className="flex items-center rounded-md border bg-muted p-0.5">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className="gap-1 px-3"
              aria-pressed={viewMode === "table"}
            >
              <List size={18} />
              Table
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="gap-1 px-3"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid size={18} />
              Grid
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UploadCloud size={18} />
                Import / Export
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpenApiImportModal} className="gap-2">
                <DatabaseZap size={16} /> Import from API (TMDB/OMDB)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenJsonImportModal} className="gap-2">
                <FileJson size={16} /> Import Movies (JSON)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenJsonExportModal} className="gap-2">
                <FileJson size={16} /> Export Movies (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAddNewMovie} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle size={18} />
            Add New Movie
          </Button>
        </div>
      </div>
    </div>
  )
}
