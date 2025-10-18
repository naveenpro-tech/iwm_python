"use client"

import { motion } from "framer-motion"
import { Award, Calendar, Film, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HistoricalAwardsTimeline() {
  const timelineEvents = [
    {
      year: "1929",
      title: "First Academy Awards",
      description: "The first Academy Awards ceremony was held at the Hollywood Roosevelt Hotel.",
      icon: <Trophy className="h-6 w-6" />,
    },
    {
      year: "1944",
      title: "Golden Globe Awards Begin",
      description: "The Hollywood Foreign Press Association held the first Golden Globe Awards ceremony.",
      icon: <Award className="h-6 w-6" />,
    },
    {
      year: "1947",
      title: "First Cannes Film Festival",
      description: "The inaugural Cannes Film Festival was held in the French Riviera.",
      icon: <Film className="h-6 w-6" />,
    },
    {
      year: "1954",
      title: "First BAFTA Film Awards",
      description: "The British Academy of Film and Television Arts held its first dedicated film awards ceremony.",
      icon: <Award className="h-6 w-6" />,
    },
    {
      year: "2000",
      title: "Modern Awards Era",
      description: "The turn of the millennium marked a new era in film awards with global recognition.",
      icon: <Calendar className="h-6 w-6" />,
    },
  ]

  return (
    <section className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-8 text-center"
      >
        Historical Awards Timeline
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-800" />

        {/* Timeline events */}
        <div className="space-y-12">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } justify-center`}
            >
              <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="mr-2 text-primary">{event.icon}</div>
                      <h3 className="text-xl font-bold">{event.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <div className="bg-primary text-white rounded-full h-12 w-12 flex items-center justify-center z-10 text-sm font-bold">
                  {event.year}
                </div>
              </div>

              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
