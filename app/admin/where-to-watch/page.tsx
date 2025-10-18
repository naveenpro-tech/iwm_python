"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Plus, Search, MoreHorizontal, Edit, Trash, Globe, Link, Check, X, ExternalLink } from "lucide-react"
import Image from "next/image"

interface StreamingService {
  id: string
  name: string
  logo: string
  website: string
  regions: string[]
  active: boolean
}

interface RegionalAvailability {
  id: string
  region: string
  code: string
  services: number
  movies: number
  lastUpdated: string
}

const mockStreamingServices: StreamingService[] = [
  {
    id: "1",
    name: "Netflix",
    logo: "/netflix-inspired-logo.png",
    website: "https://netflix.com",
    regions: ["US", "UK", "CA", "AU", "IN", "JP", "KR", "DE", "FR", "ES"],
    active: true,
  },
  {
    id: "2",
    name: "Amazon Prime Video",
    logo: "/amazon-prime-video-logo.png",
    website: "https://primevideo.com",
    regions: ["US", "UK", "CA", "AU", "IN", "JP", "DE", "FR"],
    active: true,
  },
  {
    id: "3",
    name: "Disney+",
    logo: "/disney-plus-logo.png",
    website: "https://disneyplus.com",
    regions: ["US", "UK", "CA", "AU", "JP", "DE", "FR", "ES"],
    active: true,
  },
  {
    id: "4",
    name: "HBO Max",
    logo: "/hbo-max-logo.png",
    website: "https://hbomax.com",
    regions: ["US"],
    active: false,
  },
]

const mockRegions: RegionalAvailability[] = [
  {
    id: "1",
    region: "United States",
    code: "US",
    services: 15,
    movies: 1250,
    lastUpdated: "2024-01-20",
  },
  {
    id: "2",
    region: "United Kingdom",
    code: "UK",
    services: 12,
    movies: 980,
    lastUpdated: "2024-01-18",
  },
  {
    id: "3",
    region: "Canada",
    code: "CA",
    services: 10,
    movies: 920,
    lastUpdated: "2024-01-15",
  },
  {
    id: "4",
    region: "Australia",
    code: "AU",
    services: 9,
    movies: 850,
    lastUpdated: "2024-01-12",
  },
  {
    id: "5",
    region: "India",
    code: "IN",
    services: 8,
    movies: 780,
    lastUpdated: "2024-01-10",
  },
]

export default function WhereToWatchManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Where to Watch Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage streaming services, regional availability, and content links
        </p>
      </motion.div>

      <Tabs defaultValue="services">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="services">Streaming Services</TabsTrigger>
          <TabsTrigger value="regions">Regional Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Streaming Services</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage supported streaming platforms and their regional availability
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Add Service
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Logo</TableHead>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Regions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStreamingServices.map((service, index) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="relative w-8 h-8 rounded overflow-hidden">
                          <Image
                            src={service.logo || "/placeholder.svg"}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <a
                          href={service.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          {service.website}
                          <ExternalLink size={12} />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.regions.slice(0, 3).map((region) => (
                            <Badge key={region} variant="outline" className="text-xs">
                              {region}
                            </Badge>
                          ))}
                          {service.regions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.regions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {service.active ? (
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
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
                              Edit Service
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Globe size={16} className="mr-2" />
                              Manage Regions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link size={16} className="mr-2" />
                              View Linked Movies
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {service.active ? (
                                <>
                                  <X size={16} className="mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Check size={16} className="mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash size={16} className="mr-2" />
                              Delete Service
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
        </TabsContent>

        <TabsContent value="regions" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Regional Availability</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Manage content availability by region</p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Add Region
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Search regions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Movies</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRegions.map((region, index) => (
                    <motion.tr
                      key={region.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-medium">{region.region}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{region.code}</Badge>
                      </TableCell>
                      <TableCell>{region.services}</TableCell>
                      <TableCell>{region.movies.toLocaleString()}</TableCell>
                      <TableCell>{new Date(region.lastUpdated).toLocaleDateString()}</TableCell>
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
                              Edit Region
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link size={16} className="mr-2" />
                              Manage Services
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Check size={16} className="mr-2" />
                              Verify Links
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash size={16} className="mr-2" />
                              Delete Region
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
