"use client"

import { motion } from "framer-motion"
import { Users, Film, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DataSourceSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function DataSourceSelector({ value, onChange }: DataSourceSelectorProps) {
  const dataSources = [
    {
      id: "users",
      name: "Users",
      description: "User registration, activity, and demographic data",
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: "content",
      name: "Content",
      description: "Movies, reviews, ratings, and engagement metrics",
      icon: <Film className="h-5 w-5 text-primary" />,
    },
    {
      id: "system",
      name: "System",
      description: "Platform performance, errors, and technical metrics",
      icon: <Activity className="h-5 w-5 text-primary" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {dataSources.map((source) => (
        <motion.div
          key={source.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(source.id)}
        >
          <Card
            className={`cursor-pointer transition-colors ${
              value === source.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">{source.icon}</div>
                <div>
                  <h3 className="font-medium">{source.name}</h3>
                  <p className="text-xs text-muted-foreground">{source.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
