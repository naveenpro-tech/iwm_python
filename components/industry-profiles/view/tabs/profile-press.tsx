"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import {
  FileText,
  FileArchive,
  ImageIcon,
  Download,
  ExternalLink,
  Search,
  Upload,
  Calendar,
  Newspaper,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { IndustryProfessionalProfile } from "../../types"

interface ProfilePressProps {
  profile: IndustryProfessionalProfile
  isOwnProfile?: boolean
}

export function ProfilePress({ profile, isOwnProfile = false }: ProfilePressProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [pressTab, setPressTab] = useState("materials")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Filter press kit items based on search query
  const filteredPressKit = profile.pressKit?.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mock press coverage data
  const pressCoverage = [
    {
      id: "press_001",
      title: "Christopher Nolan on the Making of Oppenheimer",
      source: "Variety",
      date: "May 10, 2024",
      url: "#",
      image: "/christopher-nolan-interview.png",
      excerpt:
        "An in-depth interview with Christopher Nolan about the challenges and triumphs of bringing Oppenheimer to the big screen.",
    },
    {
      id: "press_002",
      title: "'Oppenheimer' Review: Nolan's Masterpiece Defies Expectations",
      source: "The New York Times",
      date: "April 28, 2024",
      url: "#",
      image: "/oppenheimer-movie-review.png",
      excerpt:
        "Christopher Nolan's latest film is a tour de force of filmmaking, combining stunning visuals with powerful performances.",
    },
    {
      id: "press_003",
      title: "The Evolution of Christopher Nolan's Filmmaking Style",
      source: "Film Comment",
      date: "March 15, 2024",
      url: "#",
      image: "/christopher-nolan-filmmaking.png",
      excerpt:
        "A retrospective look at how Christopher Nolan's distinctive visual style and narrative techniques have evolved throughout his career.",
    },
  ]

  // Filter press coverage based on search query
  const filteredPressCoverage = pressCoverage.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Search Bar */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search press materials..."
              className="pl-10 bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
          </div>
          {isOwnProfile && (
            <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              <Upload className="h-4 w-4 mr-2" />
              Upload Press Material
            </Button>
          )}
        </div>
      </motion.div>

      {/* Press Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={pressTab} onValueChange={setPressTab}>
          <TabsList className="bg-[#282828] p-1 h-auto">
            <TabsTrigger
              value="materials"
              className={cn(
                "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
              )}
            >
              Press Materials
            </TabsTrigger>
            <TabsTrigger
              value="coverage"
              className={cn(
                "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
                "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
              )}
            >
              Press Coverage
            </TabsTrigger>
          </TabsList>

          {/* Press Materials Tab */}
          <TabsContent value="materials" className="mt-6">
            <Card className="bg-[#282828] border-[#3A3A3A]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredPressKit && filteredPressKit.length > 0 ? (
                    filteredPressKit.map((item, index) => (
                      <motion.div
                        key={`${item.title}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                          <div className="flex items-center">
                            {item.type === "pdf" && <FileText className="h-6 w-6 text-red-400 mr-3" />}
                            {item.type === "zip" && <FileArchive className="h-6 w-6 text-yellow-400 mr-3" />}
                            {item.type === "image" && <ImageIcon className="h-6 w-6 text-blue-400 mr-3" />}
                            <div>
                              <h4 className="font-medium text-[#E0E0E0]">{item.title}</h4>
                              <div className="flex items-center text-xs text-[#A0A0A0] mt-1">
                                <span className="uppercase">{item.type}</span>
                                <span className="mx-1">•</span>
                                <span>{item.size}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-[#3A3A3A] mb-3" />
                      <h4 className="text-lg font-medium text-[#E0E0E0]">No Press Materials Found</h4>
                      <p className="text-[#A0A0A0] mt-1 max-w-md">
                        {searchQuery
                          ? `No press materials matching "${searchQuery}"`
                          : isOwnProfile
                            ? "Upload press materials to make them available to industry professionals and fans."
                            : "This professional hasn't uploaded any press materials yet."}
                      </p>
                      {isOwnProfile && !searchQuery && (
                        <Button className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload Press Materials
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Press Coverage Tab */}
          <TabsContent value="coverage" className="mt-6">
            <Card className="bg-[#282828] border-[#3A3A3A]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredPressCoverage.length > 0 ? (
                    filteredPressCoverage.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-start p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                          <div className="w-24 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={96}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-[#E0E0E0]">{item.title}</h4>
                            <p className="text-sm text-[#A0A0A0] mt-1 line-clamp-2">{item.excerpt}</p>
                            <div className="flex items-center text-xs text-[#A0A0A0] mt-2">
                              <Newspaper className="h-3 w-3 mr-1" />
                              <span>{item.source}</span>
                              <span className="mx-1">•</span>
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{item.date}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Newspaper className="h-12 w-12 text-[#3A3A3A] mb-3" />
                      <h4 className="text-lg font-medium text-[#E0E0E0]">No Press Coverage Found</h4>
                      <p className="text-[#A0A0A0] mt-1 max-w-md">
                        {searchQuery
                          ? `No press coverage matching "${searchQuery}"`
                          : "No press coverage has been added yet."}
                      </p>
                      {isOwnProfile && (
                        <Button className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black">
                          <Upload className="h-4 w-4 mr-1" />
                          Add Press Coverage
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
