"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { PlayerProfile } from "./types"

interface StatisticsChartProps {
  player: PlayerProfile
  format: string
  type: "batting" | "bowling"
}

export default function StatisticsChart({ player, format, type }: StatisticsChartProps) {
  const [metric, setMetric] = useState(type === "batting" ? "runs" : "wickets")

  // Get the appropriate data based on format and type
  const getData = () => {
    if (type === "batting") {
      return player.statistics.batting.yearlyStats
    } else if (player.statistics.bowling) {
      return player.statistics.bowling.yearlyStats
    }
    return []
  }

  const data = getData()

  // Get the appropriate color based on metric
  const getColor = () => {
    if (type === "batting") {
      return metric === "runs" ? "#00BFFF" : metric === "average" ? "#52C41A" : "#FF9933"
    } else {
      return metric === "wickets" ? "#00BFFF" : metric === "average" ? "#FF4D4F" : "#722ED1"
    }
  }

  return (
    <div>
      <div className="flex mb-4 overflow-x-auto pb-2">
        {type === "batting" ? (
          <>
            <button
              onClick={() => setMetric("runs")}
              className={`px-4 py-2 mr-2 rounded-md ${metric === "runs" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
            >
              Runs
            </button>
            <button
              onClick={() => setMetric("average")}
              className={`px-4 py-2 mr-2 rounded-md ${metric === "average" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
            >
              Average
            </button>
            <button
              onClick={() => setMetric("centuries")}
              className={`px-4 py-2 mr-2 rounded-md ${metric === "centuries" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
            >
              Centuries
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setMetric("wickets")}
              className={`px-4 py-2 mr-2 rounded-md ${metric === "wickets" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
            >
              Wickets
            </button>
            <button
              onClick={() => setMetric("average")}
              className={`px-4 py-2 mr-2 rounded-md ${metric === "average" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
            >
              Average
            </button>
            <button
              onClick={() => setMetric("economy")}
              className={`px-4 py-2 mr-2 rounded-md ${metric === "economy" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
            >
              Economy
            </button>
          </>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="year" tick={{ fill: "#E0E0E0" }} />
            <YAxis tick={{ fill: "#E0E0E0" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", borderColor: "#444" }}
              itemStyle={{ color: "#E0E0E0" }}
              formatter={(value) => [value, metric.charAt(0).toUpperCase() + metric.slice(1)]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={getColor()}
              strokeWidth={2}
              dot={{ r: 4, fill: getColor() }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
