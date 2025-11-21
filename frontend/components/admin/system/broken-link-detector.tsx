"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  RefreshCw,
  Search,
  ExternalLink,
  LinkIcon,
  AlertTriangle,
  CheckCircle,
  Play,
  Filter,
  Download,
  ArrowUpDown,
} from "lucide-react"

// Mock broken links data
const brokenLinks = [
  {
    id: "link_001",
    url: "https://example.com/movies/interstellar-2014",
    page: "/movies/interstellar",
    type: "external",
    status: 404,
    lastChecked: "2024-05-25 10:15:42",
    occurrences: 3,
  },
  {
    id: "link_002",
    url: "https://api.example.com/v1/movies/12345",
    page: "/api/movies/details",
    type: "api",
    status: 404,
    lastChecked: "2024-05-25 09:30:18",
    occurrences: 1,
  },
  {
    id: "link_003",
    url: "/talent/john-doe",
    page: "/movies/inception",
    type: "internal",
    status: 404,
    lastChecked: "2024-05-24 22:45:33",
    occurrences: 5,
  },
  {
    id: "link_004",
    url: "https://cdn.example.com/images/movie-poster-123.jpg",
    page: "/movies/the-dark-knight",
    type: "asset",
    status: 404,
    lastChecked: "2024-05-24 18:12:05",
    occurrences: 2,
  },
  {
    id: "link_005",
    url: "https://api.tmdb.org/3/movie/550",
    page: "/api/external/tmdb",
    type: "api",
    status: 403,
    lastChecked: "2024-05-24 15:45:33",
    occurrences: 8,
  },
  {
    id: "link_006",
    url: "/cricket/matches/2024-05-25",
    page: "/cricket",
    type: "internal",
    status: 404,
    lastChecked: "2024-05-25 11:05:22",
    occurrences: 1,
  },
  {
    id: "link_007",
    url: "https://example.com/where-to-watch/movie-123",
    page: "/movies/pulp-fiction",
    type: "external",
    status: 500,
    lastChecked: "2024-05-25 08:45:12",
    occurrences: 4,
  },
]

// Mock fixed links data
const fixedLinks = [
  {
    id: "link_008",
    url: "https://example.com/movies/avatar-2009",
    page: "/movies/avatar",
    type: "external",
    status: 200,
    fixedAt: "2024-05-24 14:30:22",
    occurrences: 2,
  },
  {
    id: "link_009",
    url: "/talent/jane-smith",
    page: "/movies/titanic",
    type: "internal",
    status: 200,
    fixedAt: "2024-05-24 12:15:45",
    occurrences: 3,
  },
  {
    id: "link_010",
    url: "https://cdn.example.com/images/movie-poster-456.jpg",
    page: "/movies/the-godfather",
    type: "asset",
    status: 200,
    fixedAt: "2024-05-23 16:45:33",
    occurrences: 1,
  },
]

export function BrokenLinkDetector() {
  const [isScanning, setIsScanning] = useState(false)
  const [activeTab, setActiveTab] = useState("broken")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const startScan = () => {
    setIsScanning(true)
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter links based on search query and selected type
  const filteredBrokenLinks = brokenLinks.filter((link) => {
    const matchesSearch = searchQuery
      ? link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.page.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = selectedType ? link.type === selectedType : true
    return matchesSearch && matchesType
  })

  const filteredFixedLinks = fixedLinks.filter((link) => {
    const matchesSearch = searchQuery
      ? link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.page.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = selectedType ? link.type === selectedType : true
    return matchesSearch && matchesType
  })

  // Sort links based on sort column and direction
  const sortedBrokenLinks = [...filteredBrokenLinks].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const sortedFixedLinks = [...filteredFixedLinks].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              Broken Link Detector
            </CardTitle>
            <CardDescription>Find and fix broken links across the platform</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={startScan} disabled={isScanning}>
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Start Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType(null)}
              className={selectedType === null ? "bg-primary text-primary-foreground" : ""}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("internal")}
              className={selectedType === "internal" ? "bg-primary text-primary-foreground" : ""}
            >
              Internal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("external")}
              className={selectedType === "external" ? "bg-primary text-primary-foreground" : ""}
            >
              External
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("api")}
              className={selectedType === "api" ? "bg-primary text-primary-foreground" : ""}
            >
              API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("asset")}
              className={selectedType === "asset" ? "bg-primary text-primary-foreground" : ""}
            >
              Assets
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="broken" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="broken" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Broken Links
              <Badge variant="secondary" className="ml-1 bg-red-500/10 text-red-500 hover:bg-red-500/10">
                {brokenLinks.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="fixed" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Fixed Links
              <Badge variant="secondary" className="ml-1 bg-green-500/10 text-green-500 hover:bg-green-500/10">
                {fixedLinks.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="broken">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("url")}>
                      <div className="flex items-center">
                        URL
                        {sortColumn === "url" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("page")}>
                      <div className="flex items-center">
                        Page
                        {sortColumn === "page" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "type" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("lastChecked")}>
                      <div className="flex items-center">
                        Last Checked
                        {sortColumn === "lastChecked" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("occurrences")}>
                      <div className="flex items-center">
                        Occurrences
                        {sortColumn === "occurrences" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBrokenLinks.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <span className="truncate max-w-[200px]">{link.url}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{link.page}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            link.type === "internal"
                              ? "bg-blue-500/10 text-blue-500"
                              : link.type === "external"
                                ? "bg-purple-500/10 text-purple-500"
                                : link.type === "api"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-green-500/10 text-green-500"
                          }
                        >
                          {link.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500">
                          {link.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{link.lastChecked}</TableCell>
                      <TableCell>{link.occurrences}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            Fix
                          </Button>
                          <Button variant="ghost" size="sm">
                            Ignore
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="fixed">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("url")}>
                      <div className="flex items-center">
                        URL
                        {sortColumn === "url" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("page")}>
                      <div className="flex items-center">
                        Page
                        {sortColumn === "page" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === "type" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                      <div className="flex items-center">
                        Status
                        {sortColumn === "status" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("fixedAt")}>
                      <div className="flex items-center">
                        Fixed At
                        {sortColumn === "fixedAt" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("occurrences")}>
                      <div className="flex items-center">
                        Occurrences
                        {sortColumn === "occurrences" && (
                          <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFixedLinks.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <span className="truncate max-w-[200px]">{link.url}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{link.page}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            link.type === "internal"
                              ? "bg-blue-500/10 text-blue-500"
                              : link.type === "external"
                                ? "bg-purple-500/10 text-purple-500"
                                : link.type === "api"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-green-500/10 text-green-500"
                          }
                        >
                          {link.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          {link.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{link.fixedAt}</TableCell>
                      <TableCell>{link.occurrences}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Recheck
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
