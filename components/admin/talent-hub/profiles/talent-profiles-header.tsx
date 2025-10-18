"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Upload, Search, UserPlus, Grid, List } from "lucide-react"

export function TalentProfilesHeader() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talent Profiles</h1>
        <p className="text-muted-foreground">Manage and review talent profiles on the platform</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search profiles..." className="w-[200px] pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Upload className="h-4 w-4" />
        </Button>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-none rounded-l-md"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-none rounded-r-md"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Profile
        </Button>
      </div>
    </div>
  )
}
