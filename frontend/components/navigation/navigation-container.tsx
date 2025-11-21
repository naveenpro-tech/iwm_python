"use client"

import { useState, useEffect } from "react"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"

export function NavigationContainer() {
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial load
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-[#00BFFF] focus:text-[#1A1A1A] focus:p-4 focus:m-4 focus:rounded-md"
      >
        Skip to content
      </a>

      {/* Render appropriate navigation based on screen size */}
      {isMobile ? <BottomNavigation /> : <TopNavigation isScrolled={isScrolled} />}
    </>
  )
}
