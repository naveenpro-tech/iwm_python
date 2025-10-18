"use client"

import { motion } from "framer-motion"
import { Book, ExternalLink } from "lucide-react"
import type { HelpCategory } from "./types"
import Link from "next/link"

interface KnowledgeBaseSectionProps {
  category: HelpCategory
}

export default function KnowledgeBaseSection({ category }: KnowledgeBaseSectionProps) {
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
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Book className="mr-3 text-[#00BFFF]" size={24} />
        Knowledge Base
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.articles?.map((article) => (
          <motion.div
            key={article.id}
            variants={itemVariants}
            className="bg-[#282828] border border-gray-700 rounded-lg p-4 hover:border-[#00BFFF] transition-colors"
          >
            <Link href={`/help/${category.id}/${article.id}`}>
              <h3 className="text-white font-semibold mb-2 flex items-center justify-between">
                {article.title}
                <ExternalLink size={16} className="text-gray-400" />
              </h3>
              <p className="text-gray-400 text-sm">{article.excerpt}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
