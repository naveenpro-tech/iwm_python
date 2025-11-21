"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock data for casting calls
const castingCallsData = [
  { month: "Jan", active: 42, closed: 28, applications: 320 },
  { month: "Feb", active: 48, closed: 32, applications: 380 },
  { month: "Mar", active: 52, closed: 38, applications: 420 },
  { month: "Apr", active: 58, closed: 42, applications: 480 },
  { month: "May", active: 64, closed: 46, applications: 520 },
  { month: "Jun", active: 70, closed: 52, applications: 580 },
  { month: "Jul", active: 76, closed: 58, applications: 640 },
]

export function CastingCallsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Casting Calls Activity</CardTitle>
          <CardDescription>Casting calls and applications over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calls">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="calls">Casting Calls</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calls" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={castingCallsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" name="Active Calls" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="closed" name="Closed Calls" fill="#6B7280" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="applications" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={castingCallsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applications" name="Applications" fill="#EC4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
