"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Home, Film, Compass, Flame, LayoutGrid } from "lucide-react"
import { usePathname } from "next/navigation"
import { NavLink } from "./nav-link" // Assuming NavLink is flexible for this new style
import { useMobile } from "@/hooks/use-mobile"
import { MobileMenuOverlay } from "./mobile-menu-overlay"

const mainNavItems = [
  { href: "/", label: "Home", icon: <Home size={20} />, exact: true }, // Slightly smaller icons for the dock
  { href: "/explore", label: "Explore", icon: <Compass size={20} /> },
  { href: "/movies", label: "Movies", icon: <Film size={20} /> },
  { href: "/pulse", label: "Pulse", icon: <Flame size={20} /> },
]

export function BottomNavigation() {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

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
            className="h-[56px] bg-neutral-800/60 backdrop-blur-md border border-neutral-700/70 rounded-xl shadow-2xl px-3 flex items-center"
            // Glassmorphic dock container: slightly shorter, adjusted opacity and blur
          >
            <div className="flex items-end space-x-1.5">
              {" "}
              {/* items-end for upward scaling, adjusted spacing */}
              {mainNavItems.map((item) => (
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
                    className="!w-14 !h-14 sm:!w-14 sm:!h-14 !text-[10px] !leading-tight" // More compact NavLink
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
                  w-14 h-14  /* Consistent sizing with NavLink overrides */
                  text-[10px] leading-tight font-medium transition-colors duration-150 ease-in-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 rounded-lg
                  ${isMoreMenuOpen ? "text-primary" : "text-gray-400 hover:text-gray-200"}
                `}
                  aria-label="More options"
                  aria-expanded={isMoreMenuOpen}
                >
                  <LayoutGrid size={20} className="mb-0.5" /> {/* Consistent icon size */}
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
