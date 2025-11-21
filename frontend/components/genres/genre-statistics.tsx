"use client"

import type React from "react"

// Enhance with more visualizations using a mock chart component

import { motion } from "framer-motion"
import { BarChart, TrendingUp, Film, Users, CalendarDays, PieChartIcon, LineChartIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie, Cell } from "recharts"
import type { GenreDetails } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"

interface GenreStatisticsProps {
  statistics: GenreDetails["statistics"]
  genreName: string
}

const CHART_COLORS = ["#00BFFF", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF5733"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/90 text-white p-3 rounded-md shadow-lg border border-gray-700">
        <p className="label font-semibold text-sm">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color || "#00BFFF" }} className="text-xs">
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function GenreStatistics({ statistics, genreName }: GenreStatisticsProps) {
  const ratingChartData = statistics.ratingDistribution.map((item) => ({
    name: `${item.rating}/10`,
    Count: item.count,
  }))
  const popularityTrendData = statistics.popularityTrend.map((item) => ({ name: item.period, Score: item.score }))
  const releaseFreqData = statistics.releaseFrequencyByYear.map((item) => ({
    name: String(item.year),
    Movies: item.count,
  }))
  const subgenreChartData =
    statistics.subgenreBreakdown?.map((item, index) => ({
      name: item.name,
      value: item.movieCount,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    })) || []

  const StatCard = ({
    title,
    value,
    icon: Icon,
    unit,
    children,
    className,
  }: {
    title: string
    value?: string | number
    icon: React.ElementType
    unit?: string
    children?: React.ReactNode
    className?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={className}
    >
      <Card className="bg-gray-800/50 border-gray-700/70 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-4 px-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">{title}</CardTitle>
          <Icon size={16} className="text-[#00BFFF]" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {value && (
            <div className="text-xl sm:text-2xl font-bold text-white">
              {value}
              {unit && <span className="text-xs text-gray-400 ml-1">{unit}</span>}
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderChart = (
    data: any[],
    xKey: string,
    yKey: string,
    ChartComponent: any = Bar,
    yLabel?: string,
    xLabel?: string,
    chartColor?: string,
  ) => (
    <ResponsiveContainer width="100%" height={180}>
      {" "}
      {/* Reduced height for sidebar */}
      <ChartComponent data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        {" "}
        {/* Adjusted margins */}
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} stroke="#555" />
        <XAxis dataKey={xKey} fontSize={9} tick={{ fill: "#9ca3af" }} stroke="#555" />
        <YAxis
          fontSize={9}
          tick={{ fill: "#9ca3af" }}
          stroke="#555"
          label={
            yLabel
              ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 9, fill: "#9ca3af", dy: 20 }
              : undefined
          }
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100,100,100,0.1)" }} />
        {/* <Legend wrapperStyle={{fontSize: "9px", paddingTop: "5px"}}/> */}
        {ChartComponent === Bar ? (
          <Bar dataKey={yKey} fill={chartColor || "#00BFFF"} radius={[3, 3, 0, 0]} barSize={20} />
        ) : (
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={chartColor || "#00BFFF"}
            strokeWidth={1.5}
            dot={{ r: 2.5, strokeWidth: 1, fill: chartColor || "#00BFFF" }}
            activeDot={{ r: 4, strokeWidth: 1 }}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  )

  const renderPieChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={55}
          innerRadius={30}
          labelLine={false}
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
          fontSize={9}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "9px", paddingTop: "10px" }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-700/50"
    >
      <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
        <BarChart className="text-[#00BFFF] mr-2" size={20} />
        {genreName} Insights
      </h2>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <StatCard title="Total Movies" value={statistics.totalMovies.toLocaleString()} icon={Film} />
        <StatCard title="Avg. Score" value={statistics.averageRating.toFixed(1)} icon={TrendingUp} unit="/10" />
        <StatCard title="Peak Decade" value={statistics.peakDecade} icon={CalendarDays} />
        <StatCard title="Top Directors" icon={Users}>
          <ul className="space-y-0.5 mt-0.5">
            {statistics.topDirectors.slice(0, 2).map((director, index) => (
              <li key={index} className="text-[11px] text-gray-300 truncate" title={director}>
                {director}
              </li>
            ))}
          </ul>
        </StatCard>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800/50 border-gray-700/70">
          <CardHeader className="p-3">
            <CardTitle className="text-xs font-semibold text-gray-200 flex items-center">
              <LineChartIcon size={14} className="mr-1.5 text-[#00BFFF]" />
              Popularity Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 pt-0">
            {renderChart(popularityTrendData, "name", "Score", Line, undefined, undefined, "#82ca9d")}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/70">
          <CardHeader className="p-3">
            <CardTitle className="text-xs font-semibold text-gray-200 flex items-center">
              <BarChart size={14} className="mr-1.5 text-[#00BFFF]" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 pt-0">{renderChart(ratingChartData, "name", "Count")}</CardContent>
        </Card>

        {statistics.subgenreBreakdown && statistics.subgenreBreakdown.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700/70">
            <CardHeader className="p-3">
              <CardTitle className="text-xs font-semibold text-gray-200 flex items-center">
                <PieChartIcon size={14} className="mr-1.5 text-[#00BFFF]" />
                Subgenre Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-1 pt-0">{renderPieChart(subgenreChartData)}</CardContent>
          </Card>
        )}

        <Card className="bg-gray-800/50 border-gray-700/70">
          <CardHeader className="p-3">
            <CardTitle className="text-xs font-semibold text-gray-200 flex items-center">
              <CalendarDays size={14} className="mr-1.5 text-[#00BFFF]" />
              Release Frequency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-1 pt-0">
            {renderChart(releaseFreqData, "name", "Movies", Bar, undefined, undefined, "#ffc658")}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/70">
          <CardHeader className="p-3">
            <CardTitle className="text-xs font-semibold text-gray-200 flex items-center">
              <Users size={14} className="mr-1.5 text-[#00BFFF]" />
              Top Actors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <ul className="space-y-1.5">
              {statistics.topActorsInGenre.slice(0, 3).map((actor) => (
                <li key={actor.id} className="text-xs text-gray-300 flex items-center">
                  <Image
                    src={actor.imageUrl || "/placeholder.svg"}
                    alt={actor.name}
                    width={20}
                    height={20}
                    className="rounded-full mr-1.5 object-cover"
                  />
                  <Link href={actor.profileUrl} className="hover:text-[#00BFFF] truncate flex-grow" title={actor.name}>
                    {actor.name}
                  </Link>
                  <span className="ml-2 text-[10px] text-gray-500 whitespace-nowrap">{actor.movieCount} films</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
