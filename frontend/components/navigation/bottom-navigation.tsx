"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Home, Film, Compass, Flame, LayoutGrid } from "lucide-react"
import { usePathname } from "next/navigation"
import { NavLink } from "./nav-link" // Assuming NavLink is flexible for this new style
import { useMobile } from "@/hooks/use-mobile"
import { MobileMenuOverlay } from "./mobile-menu-overlay"

const mainNavItems = [
  { href: "/", label: "Home", icon: <Home size={24} />, exact: true, showLabel: true },
  { href: "/explore", label: "Explore", icon: <Compass size={24} />, showLabel: true },
  { href: "/movies", label: "Movies", icon: <Film size={24} />, showLabel: true },
  { href: "/pulse", label: "Pulse", icon: <Flame size={24} />, showLabel: true },
]

export function BottomNavigation() {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  // MVP: Show all nav items without feature flag filtering
  const filteredNavItems = mainNavItems

  useEffect(() => {
    setIsMoreMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMoreMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMoreMenuOpen])

  if (!isMobile) {
    return null
  }

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 30, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-2 pt-1" // z-index adjusted, padding for spacing from screen edge
      >
        <div className="container mx-auto flex justify-center">
          {" "}
          {/* Center the dock */}
          <div
            className="h-[64px] bg-neutral-800/60 backdrop-blur-md border border-neutral-700/70 rounded-xl shadow-2xl px-3 flex items-center"
            // Glassmorphic dock container: increased height to 64px for better touch targets
          >
            <div className="flex items-end space-x-1.5">
              {" "}
              {/* items-end for upward scaling, adjusted spacing */}
              {filteredNavItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.3, y: -10, zIndex: 1 }} // Magnify, lift, and bring to front
                  whileTap={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 380, damping: 12 }}
                  className="relative cursor-pointer" // Relative for zIndex, cursor pointer for better UX
                >
                  {/* Assuming NavLink is styled with appropriate padding for dock items, or use className prop */}
                  <NavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    exact={item.exact}
                    // Pass a className to NavLink to adjust its internal padding/sizing if needed for the dock
                    // e.g., className="!p-2 !text-[10px] !leading-tight" to make it more compact
                    // For this QuickEdit, we assume NavLink's default or slightly modified styling works.
                    // The NavLink component itself might need to be adjusted to be more flexible.
                    // A common pattern for dock items is icon-only, with label on hover, but here we keep label.
                    className="!w-16 !h-16 sm:!w-16 sm:!h-16 !text-[10px] !leading-tight" // Increased to 64px (16 * 4) for better touch targets
                  />
                </motion.div>
              ))}
              {/* More Button - styled as a dock item */}
              <motion.div
                whileHover={{ scale: 1.3, y: -10, zIndex: 1 }}
                whileTap={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 380, damping: 12 }}
                className="relative cursor-pointer"
              >
                <button
                  onClick={() => setIsMoreMenuOpen(true)}
                  className={`
                  flex flex-col items-center justify-center text-center
                  w-16 h-16  /* Increased to 64px for better touch targets */
                  text-[10px] leading-tight font-medium transition-colors duration-150 ease-in-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 rounded-lg
                  ${isMoreMenuOpen ? "text-primary" : "text-gray-400 hover:text-gray-200"}
                `}
                  aria-label="More options"
                  aria-expanded={isMoreMenuOpen}
                >
                  <LayoutGrid size={24} className="mb-0.5" /> {/* Increased icon size for better visibility */}
                  <span>More</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenuOverlay isOpen={isMoreMenuOpen} onClose={() => setIsMoreMenuOpen(false)} />
    </>
  )
}
