"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X } from "lucide-react"
import { NavLogo } from "./nav-logo"
import { ProfileDropdown } from "./profile-dropdown"
import { SearchOverlay } from "../search/search-overlay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"

const mainNavLinks = [
  { href: "/movies", label: "Movies" },
  { href: "/tv-shows", label: "TV Shows" },
  { href: "/people", label: "People" },
  { href: "/pulse", label: "Pulse" },
  { href: "/cricket", label: "Cricket" },
  { href: "/explore", label: "Explore" },
]

export function TopNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null) // For GooeyNav
  const isMobile = useMobile()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen, isSearchOpen])

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [pathname])

  const navVariants = {
    initial: { y: -80, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 20, delay: 0.2 } },
  }

  const mobileMenuVariants = {
    closed: { x: "100%", opacity: 0, transition: { type: "spring", stiffness: 400, damping: 40 } },
    open: { x: "0%", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  }

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300
      ${isScrolled || isMobileMenuOpen || isSearchOpen ? "bg-[#101010]/80 backdrop-blur-lg shadow-xl" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-6">
            <NavLogo />
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 relative">
                {" "}
                {/* Added position: relative */}
                {mainNavLinks.map((link) => {
                  // More precise active check, especially for home "/"
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))

                  return (
                    <Link key={link.href} href={link.href} passHref legacyBehavior>
                      <motion.a
                        onHoverStart={() => setHoveredHref(link.href)}
                        onHoverEnd={() => setHoveredHref(null)}
                        className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
              `}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <motion.span
                          className="relative z-10" // Text above the indicator
                          animate={{
                            scale: hoveredHref === link.href || isActive ? 1.03 : 1,
                            y: hoveredHref === link.href || isActive ? -1 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 15, mass: 0.7 }}
                        >
                          {link.label}
                        </motion.span>

                        {isActive && (
                          <motion.div
                            layoutId="active-nav-indicator"
                            className="absolute inset-0 bg-[#00BFFF] rounded-full" // Siddu Electric Blue
                            style={{ zIndex: 0 }} // Behind the text
                            transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
                          />
                        )}

                        {/* Optional: A subtle visual cue for hover, distinct from active */}
                        {hoveredHref === link.href && !isActive && (
                          <motion.div
                            layoutId="hover-nav-indicator" // Different layoutId or manage presence differently
                            className="absolute inset-0 bg-gray-700/50 rounded-full"
                            style={{ zIndex: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          />
                        )}
                      </motion.a>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1.5 md:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ProfileDropdown />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 md:hidden rounded-full"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-30 bg-[#101010] pt-16 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-4 space-y-2">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref legacyBehavior>
                  <a
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors
                  ${pathname.startsWith(link.href) ? "bg-gray-700/70 text-white" : "text-gray-200 hover:bg-gray-700/50 hover:text-white"}`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
