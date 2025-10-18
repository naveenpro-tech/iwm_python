"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Film } from "lucide-react" // Or your custom logo component/SVG

export function NavLogo({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <Link href="/" passHref legacyBehavior>
      <motion.a
        className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Siddu Home"
      >
        {/* Replace with your actual logo if you have one */}
        <Film className={`h-7 w-7 ${isMobile ? "text-primary" : ""}`} />
        {!isMobile && <span className="font-bold text-xl tracking-tight font-dmsans">Siddu</span>}
      </motion.a>
    </Link>
  )
}
