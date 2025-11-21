"use client"

import { motion } from "framer-motion"
import { Star, Users, Award, TrendingUp } from "lucide-react"
import type { VoiceOfSidduSummaryProps } from "@/types/review-page"
import RatingDistributionChart from "./rating-distribution-chart"
import SentimentAnalysisChart from "./sentiment-analysis-chart"
import KeywordTagCloud from "./keyword-tag-cloud"

export default function VoiceOfSidduSummary({ stats }: VoiceOfSidduSummaryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-6 border border-[#3A3A3A]">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#E0E0E0] font-inter flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#00BFFF]" />
          Voice of Siddu Verse
        </h2>
        <p className="text-[#A0A0A0] text-sm mt-1">
          Aggregated insights from all reviews across the platform
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Siddu Score */}
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center p-6 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
          <div className="relative w-32 h-32 mb-4">
            {/* Circular Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#3A3A3A"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#00BFFF"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(stats.siddu_score / 10) * 351.86} 351.86`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-[#00BFFF] font-inter">
                {stats.siddu_score.toFixed(1)}
              </span>
              <span className="text-sm text-[#A0A0A0]">/10</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter">Siddu Score</h3>
          <p className="text-xs text-[#A0A0A0] text-center mt-1">Weighted Average</p>
        </motion.div>

        {/* Total Reviews */}
        <motion.div variants={itemVariants} className="flex flex-col justify-center p-6 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-[#FFD700]" />
            <div>
              <h3 className="text-2xl font-bold text-[#E0E0E0] font-inter">
                {stats.total_reviews.official + stats.total_reviews.critics + stats.total_reviews.users}
              </h3>
              <p className="text-sm text-[#A0A0A0]">Total Reviews</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A0A0A0]">
                <Star className="w-3 h-3 inline mr-1 text-[#FFD700]" />
                Official
              </span>
              <span className="text-[#E0E0E0] font-semibold">{stats.total_reviews.official}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A0A0A0]">
                <Award className="w-3 h-3 inline mr-1 text-[#00BFFF]" />
                Critics
              </span>
              <span className="text-[#E0E0E0] font-semibold">{stats.total_reviews.critics}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A0A0A0]">
                <Users className="w-3 h-3 inline mr-1 text-[#10B981]" />
                Users
              </span>
              <span className="text-[#E0E0E0] font-semibold">{stats.total_reviews.users}</span>
            </div>
          </div>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div variants={itemVariants} className="flex flex-col justify-center p-6 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
          <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-4">Rating Distribution</h3>
          <RatingDistributionChart distribution={stats.rating_distribution} />
        </motion.div>

        {/* Sentiment Analysis */}
        <motion.div variants={itemVariants} className="flex flex-col justify-center p-6 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A]">
          <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-4">Sentiment Analysis</h3>
          <SentimentAnalysisChart sentiment={stats.sentiment_analysis} />
        </motion.div>
      </motion.div>

      {/* Top Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-6"
      >
        <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-3">Top Keywords</h3>
        <KeywordTagCloud keywords={stats.top_keywords} />
      </motion.div>
    </div>
  )
}

