"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  exact?: boolean
}

export function NavLink({ href, label, icon, exact = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        className={cn(
          "flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors duration-200",
          isActive ? "text-primary" : "text-gray-400 hover:text-white",
        )}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-current={isActive ? "page" : undefined}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </motion.a>
    </Link>
  )
}
