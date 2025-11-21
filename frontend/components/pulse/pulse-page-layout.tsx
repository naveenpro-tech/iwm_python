'use client'

/**
 * Pulse Page Layout Component
 * Three-column responsive grid layout
 */

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PulsePageLayoutProps {
  leftSidebar: ReactNode
  mainFeed: ReactNode
  rightSidebar: ReactNode
}

export default function PulsePageLayout({
  leftSidebar,
  mainFeed,
  rightSidebar,
}: PulsePageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#1A1A1A] pt-16"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-[240px_1fr_320px] lg:gap-6">
          {/* Left Sidebar */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="sticky top-20 h-fit"
          >
            {leftSidebar}
          </motion.aside>

          {/* Main Feed */}
          <main className="max-w-[680px] mx-auto w-full">
            {mainFeed}
          </main>

          {/* Right Sidebar */}
          <motion.aside
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
            className="sticky top-20 h-fit"
          >
            {rightSidebar}
          </motion.aside>
        </div>

        {/* Tablet: 2 columns (icon-only left sidebar + main + right sidebar) */}
        <div className="hidden md:grid md:grid-cols-[60px_1fr_280px] md:gap-4 lg:hidden">
          {/* Left Sidebar (Icon-only) */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="sticky top-20 h-fit"
          >
            {/* Icon-only version - simplified */}
            <div className="flex flex-col gap-4">
              {/* Placeholder for icon-only nav */}
            </div>
          </motion.aside>

          {/* Main Feed */}
          <main className="max-w-[680px] mx-auto w-full">
            {mainFeed}
          </main>

          {/* Right Sidebar */}
          <motion.aside
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
            className="sticky top-20 h-fit"
          >
            {rightSidebar}
          </motion.aside>
        </div>

        {/* Mobile: 1 column */}
        <div className="md:hidden">
          <main className="w-full">
            {mainFeed}
          </main>
        </div>
      </div>
    </motion.div>
  )
}

