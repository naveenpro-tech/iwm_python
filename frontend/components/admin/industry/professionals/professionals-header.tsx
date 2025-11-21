"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Download, Upload, LayoutGrid, LayoutList } from "lucide-react"
import Link from "next/link"
import { JsonImportDialog } from "./json-import-dialog"
import { JsonExportDialog } from "./json-export-dialog"

export function ProfessionalsHeader() {
  const [view, setView] = useState("table")
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Industry Professionals</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/industry/professionals/new">
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" />
              Add Professional
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowExportDialog(true)}
            title="Export Professionals (JSON)"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowImportDialog(true)}
            title="Import Professionals (JSON)"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full sm:w-auto gap-2">
          <Input placeholder="Search professionals..." className="w-full sm:w-[300px]" />
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView("table")}
              className={view === "table" ? "bg-primary/10" : ""}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-primary/10" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="producer">Producer</SelectItem>
              <SelectItem value="actor">Actor</SelectItem>
              <SelectItem value="writer">Writer</SelectItem>
              <SelectItem value="cinematographer">Cinematographer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="composer">Music Composer</SelectItem>
              <SelectItem value="art-director">Art Director</SelectItem>
              <SelectItem value="casting-director">Casting Director</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Verification status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Professionals</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>
      </Tabs>
      <JsonImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} />
      <JsonExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  )
}
