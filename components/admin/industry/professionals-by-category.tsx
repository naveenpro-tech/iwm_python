"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Film, Video, Music, Mic, Camera, Brush, Scissors, Lightbulb, Users } from "lucide-react"

const categories = [
  {
    id: "directors",
    name: "Directors",
    icon: Film,
    count: 342,
    verified: 289,
    pending: 53,
    color: "text-blue-500",
  },
  {
    id: "producers",
    name: "Producers",
    icon: Video,
    count: 278,
    verified: 231,
    pending: 47,
    color: "text-purple-500",
  },
  {
    id: "composers",
    name: "Music Composers",
    icon: Music,
    count: 156,
    verified: 132,
    pending: 24,
    color: "text-green-500",
  },
  {
    id: "actors",
    name: "Actors",
    icon: Mic,
    count: 624,
    verified: 498,
    pending: 126,
    color: "text-amber-500",
  },
  {
    id: "cinematographers",
    name: "Cinematographers",
    icon: Camera,
    count: 187,
    verified: 154,
    pending: 33,
    color: "text-red-500",
  },
  {
    id: "art-directors",
    name: "Art Directors",
    icon: Brush,
    count: 112,
    verified: 98,
    pending: 14,
    color: "text-pink-500",
  },
  {
    id: "editors",
    name: "Editors",
    icon: Scissors,
    count: 143,
    verified: 121,
    pending: 22,
    color: "text-cyan-500",
  },
  {
    id: "writers",
    name: "Writers",
    icon: Lightbulb,
    count: 231,
    verified: 187,
    pending: 44,
    color: "text-indigo-500",
  },
  {
    id: "casting-directors",
    name: "Casting Directors",
    icon: Users,
    count: 89,
    verified: 76,
    pending: 13,
    color: "text-teal-500",
  },
]

export function ProfessionalsByCategory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professionals by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center p-4 rounded-lg border border-border bg-card/50">
                    <div className={`p-2 rounded-full bg-card ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-2xl font-bold">{category.count}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.verified} verified, {category.pending} pending
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="verified" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center p-4 rounded-lg border border-border bg-card/50">
                    <div className={`p-2 rounded-full bg-card ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-2xl font-bold">{category.verified}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((category.verified / category.count) * 100)}% of total
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center p-4 rounded-lg border border-border bg-card/50">
                    <div className={`p-2 rounded-full bg-card ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-2xl font-bold">{category.pending}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((category.pending / category.count) * 100)}% of total
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
