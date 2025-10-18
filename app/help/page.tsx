"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import HelpHeader from "@/components/help/help-header"
import HelpNavigation from "@/components/help/help-navigation"
import FAQSection from "@/components/help/faq-section"
import KnowledgeBaseSection from "@/components/help/knowledge-base-section"
import ContactSection from "@/components/help/contact-section"
import { helpCategories, popularTopics } from "@/components/help/mock-data"

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState("getting-started")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real app, this would trigger a search API call
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#1A1A1A]"
    >
      <HelpHeader onSearch={handleSearch} popularTopics={popularTopics} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <HelpNavigation
              categories={helpCategories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <div className="md:w-3/4">
            {searchQuery ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Search Results for "{searchQuery}"</h2>
                {/* Search results would go here */}
                <p className="text-[#E0E0E0]">No results found. Please try a different search term.</p>
              </div>
            ) : (
              <>
                <FAQSection category={helpCategories.find((cat) => cat.id === activeCategory)!} />

                <KnowledgeBaseSection category={helpCategories.find((cat) => cat.id === activeCategory)!} />

                <ContactSection />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
