"use client"

import type { BattingStats, BowlingStats } from "./types"

interface StatisticsTableProps {
  stats: BattingStats | BowlingStats
  type: "batting" | "bowling"
}

export default function StatisticsTable({ stats, type }: StatisticsTableProps) {
  if (type === "batting") {
    const battingStats = stats as BattingStats
    return (
      <div className="overflow-x-auto">
        <table className="w-full bg-[#333] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#3A3A3A]">
              <th className="p-3 text-left text-[#E0E0E0]">Format</th>
              <th className="p-3 text-left text-[#E0E0E0]">M</th>
              <th className="p-3 text-left text-[#E0E0E0]">Inn</th>
              <th className="p-3 text-left text-[#E0E0E0]">Runs</th>
              <th className="p-3 text-left text-[#E0E0E0]">HS</th>
              <th className="p-3 text-left text-[#E0E0E0]">Avg</th>
              <th className="p-3 text-left text-[#E0E0E0]">SR</th>
              <th className="p-3 text-left text-[#E0E0E0]">100s</th>
              <th className="p-3 text-left text-[#E0E0E0]">50s</th>
              <th className="p-3 text-left text-[#E0E0E0]">4s</th>
              <th className="p-3 text-left text-[#E0E0E0]">6s</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#444]">
              <td className="p-3 text-white">Test</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.matches}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.innings}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.runs.toLocaleString()}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.highestScore}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.average}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.strikeRate}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.centuries}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.halfCenturies}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.fours}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.test.sixes}</td>
            </tr>
            <tr className="border-b border-[#444]">
              <td className="p-3 text-white">ODI</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.matches}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.innings}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.runs.toLocaleString()}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.highestScore}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.average}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.strikeRate}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.centuries}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.halfCenturies}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.fours}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.odi.sixes}</td>
            </tr>
            <tr>
              <td className="p-3 text-white">T20</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.matches}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.innings}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.runs.toLocaleString()}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.highestScore}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.average}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.strikeRate}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.centuries}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.halfCenturies}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.fours}</td>
              <td className="p-3 text-[#E0E0E0]">{battingStats.formats.t20.sixes}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } else {
    const bowlingStats = stats as BowlingStats
    return (
      <div className="overflow-x-auto">
        <table className="w-full bg-[#333] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#3A3A3A]">
              <th className="p-3 text-left text-[#E0E0E0]">Format</th>
              <th className="p-3 text-left text-[#E0E0E0]">M</th>
              <th className="p-3 text-left text-[#E0E0E0]">Inn</th>
              <th className="p-3 text-left text-[#E0E0E0]">Wkts</th>
              <th className="p-3 text-left text-[#E0E0E0]">BBI</th>
              <th className="p-3 text-left text-[#E0E0E0]">Avg</th>
              <th className="p-3 text-left text-[#E0E0E0]">Econ</th>
              <th className="p-3 text-left text-[#E0E0E0]">5W</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#444]">
              <td className="p-3 text-white">Test</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.test.matches}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.test.innings}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.test.wickets}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.test.bestBowling}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.test.average}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.test.economy}</td>
              <td className="p-3 text-[#E0E0E0]">-</td>
            </tr>
            <tr className="border-b border-[#444]">
              <td className="p-3 text-white">ODI</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.odi.matches}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.odi.innings}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.odi.wickets}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.odi.bestBowling}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.odi.average}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.odi.economy}</td>
              <td className="p-3 text-[#E0E0E0]">-</td>
            </tr>
            <tr>
              <td className="p-3 text-white">T20</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.t20.matches}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.t20.innings}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.t20.wickets}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.t20.bestBowling}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.t20.average}</td>
              <td className="p-3 text-[#E0E0E0]">{bowlingStats.formats.t20.economy}</td>
              <td className="p-3 text-[#E0E0E0]">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
