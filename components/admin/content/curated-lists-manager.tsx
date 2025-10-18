"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Plus, Search, MoreHorizontal, Edit, Trash, Star, Download, Upload } from "lucide-react"
import { JsonImportDialog } from "../movies/json-import-dialog"
import { JsonExportDialog } from "../movies/json-export-dialog"

interface CuratedList {
  id: string
  title: string
  description: string
  movieCount: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

const mockLists: CuratedList[] = [
  {
    id: "1",
    title: "Mind-Bending Sci-Fi",
    description: "Films that challenge perception and reality",
    movieCount: 25,
    featured: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Award Season Favorites",
    description: "Oscar contenders and winners",
    movieCount: 40,
    featured: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Hidden Gems",
    description: "Underrated masterpieces worth discovering",
    movieCount: 30,
    featured: false,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-15",
  },
]

export function CuratedListsManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Curated Lists</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Create and manage themed movie collections</p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload size={16} className="mr-1" />
                    Import/Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                    <Upload size={16} className="mr-2" />
                    Import Lists (JSON)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                    <Download size={16} className="mr-2" />
                    Export Lists (JSON)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Create List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Movies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLists.map((list, index) => (
                <motion.tr
                  key={list.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {list.title}
                      {list.featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{list.description}</TableCell>
                  <TableCell>{list.movieCount}</TableCell>
                  <TableCell>
                    {list.featured ? (
                      <Badge className="bg-yellow-500/10 text-yellow-500">Featured</Badge>
                    ) : (
                      <Badge variant="outline">Regular</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(list.updatedAt).toLocaleDateString()}</TableCell>
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
                          <Edit size={16} className="mr-2" />
                          Edit List
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star size={16} className="mr-2" />
                          {list.featured ? "Remove from Featured" : "Make Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash size={16} className="mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <JsonImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} type="lists" />
      <JsonExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} type="lists" />
    </div>
  )
}
