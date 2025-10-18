"use client"

import { motion } from "framer-motion"
import { WeekendSummary } from "./weekend-summary"
import { TrendChart } from "./trend-chart"
import { YearToDateComparison } from "./year-to-date-comparison"

interface BoxOfficeDashboardProps {
  weekendData: any[]
  trendData: any[]
  yearToDateData: any[]
}

export function BoxOfficeDashboard({ weekendData, trendData, yearToDateData }: BoxOfficeDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <WeekendSummary />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <TrendChart />
        </motion.div>

        <motion.div variants={itemVariants}>
          <YearToDateComparison />
        </motion.div>
      </div>
    </motion.div>
  )
}
