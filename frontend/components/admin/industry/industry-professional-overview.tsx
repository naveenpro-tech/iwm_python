"use client"

import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, Award, Clock, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "New Verification Requests",
    value: "24",
    change: "+8",
    trend: "up",
    icon: Clock,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Total Verified Professionals",
    value: "1,284",
    change: "+32",
    trend: "up",
    icon: UserCheck,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Professionals with Pending Credits",
    value: "76",
    change: "-5",
    trend: "down",
    icon: Award,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Flagged Profiles",
    value: "12",
    change: "+3",
    trend: "up",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-500",
  },
]

export function IndustryProfessionalOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div
                  className={`text-sm font-medium flex items-center ${
                    stat.trend === "up"
                      ? stat.title === "Flagged Profiles"
                        ? "text-red-500"
                        : "text-green-500"
                      : stat.title === "Professionals with Pending Credits"
                        ? "text-green-500"
                        : "text-red-500"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.916.384l-4.573-1.435a.75.75 0 01.45-1.43l3.317 1.041a19.422 19.422 0 00-3.058-6.048L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
