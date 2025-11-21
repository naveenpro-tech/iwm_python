"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { motion } from "framer-motion"

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  return (
    <motion.nav
      className="flex items-center text-sm text-[#A0A0A0] mb-4 overflow-x-auto scrollbar-hide py-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/" className="flex items-center hover:text-[#00BFFF] transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-3 h-3 mx-2 flex-shrink-0" />
          {index === items.length - 1 ? (
            <span className="text-[#E0E0E0] font-medium truncate">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-[#00BFFF] transition-colors truncate">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  )
}
