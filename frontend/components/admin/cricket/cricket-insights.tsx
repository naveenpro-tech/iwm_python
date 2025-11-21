"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function CricketInsights() {
  // In a real implementation, this would fetch data from an API
  const activeSeries = [
    { id: "ipl-2023", name: "IPL 2023", matches: 60, completed: 42 },
    { id: "ind-aus-2023", name: "India vs Australia", matches: 5, completed: 2 },
    { id: "eng-wi-2023", name: "England vs West Indies", matches: 3, completed: 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Series</CardTitle>
        <CardDescription>Currently active cricket series</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSeries.map((series, index) => (
          <motion.div
            key={series.id}
            className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <div>
              <h3 className="font-medium">{series.name}</h3>
              <p className="text-sm text-muted-foreground">
                {series.completed} of {series.matches} matches completed
              </p>
            </div>
            <Badge variant="outline" className="ml-2">
              {Math.round((series.completed / series.matches) * 100)}%
            </Badge>
          </motion.div>
        ))}
        <motion.a
          href="/admin/cricket/series"
          className="block text-center text-sm text-primary hover:underline mt-2"
          whileHover={{ scale: 1.05 }}
        >
          View all series
        </motion.a>
      </CardContent>
    </Card>
  )
}
