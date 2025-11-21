"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip as ShadcnChartTooltip, ChartTooltipContent } from "@/components/ui/chart" // Assuming Chart components are from shadcn/ui

// Mock data for the charts
const weeklyActivityData = [
  { date: "Mon", users: 120, views: 2400 },
  { date: "Tue", users: 150, views: 2900 },
  { date: "Wed", users: 180, views: 3400 },
  { date: "Thu", users: 220, views: 3800 },
  { date: "Fri", users: 250, views: 4000 },
  { date: "Sat", users: 280, views: 4500 },
  { date: "Sun", users: 300, views: 4700 },
]

const contentBreakdownData = [
  { name: "Movies", value: 8942, fill: "hsl(var(--chart-1))" },
  { name: "Reviews", value: 32674, fill: "hsl(var(--chart-2))" },
  { name: "Talent", value: 1578, fill: "hsl(var(--chart-3))" },
  { name: "Industry", value: 632, fill: "hsl(var(--chart-4))" },
  { name: "Quizzes", value: 58, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  users: { label: "Active Users", color: "hsl(var(--chart-1))" },
  views: { label: "Page Views", color: "hsl(var(--chart-2))" },
  movies: { label: "Movies", color: "hsl(var(--chart-1))" },
  reviews: { label: "Reviews", color: "hsl(var(--chart-2))" },
  talent: { label: "Talent Profiles", color: "hsl(var(--chart-3))" },
  industry: { label: "Industry Profiles", color: "hsl(var(--chart-4))" },
  quizzes: { label: "Quizzes", color: "hsl(var(--chart-5))" },
}

export function AnalyticsSnapshot() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Analytics Snapshot</CardTitle>
        <CardDescription>Key metrics at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-1 text-muted-foreground">Weekly User Activity</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                  yAxisId="left"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  orientation="right"
                  tickFormatter={(value) => `${value}`}
                  yAxisId="right"
                />
                <ShadcnChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Legend wrapperStyle={{ fontSize: "10px" }} height={20} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  dot={false}
                  yAxisId="left"
                  name="Page Views"
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-users)"
                  strokeWidth={2}
                  dot={false}
                  yAxisId="right"
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1 text-muted-foreground">Content Breakdown</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ShadcnChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={contentBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={10}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    )
                  }}
                >
                  {contentBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  wrapperStyle={{ fontSize: "10px" }}
                  height={20}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
