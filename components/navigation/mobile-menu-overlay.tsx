"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, LayoutGrid } from "lucide-react"
import {
  mobileMenuItems,
  type MobileMenuItem,
  type TileSizeOption,
  getIconStyle,
  getTextStyle,
} from "./mobile-menu-items"
import { layoutPatterns, type LayoutPattern } from "./mobile-menu-layout-patterns"
import { cn } from "@/lib/utils"

interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface CurrentLayoutItem {
  item: MobileMenuItem
  chosenSize: TileSizeOption
  dynamicData?: any
}

const overlayVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: "0%", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: "100%", transition: { duration: 0.4, ease: [0.64, 0, 0.78, 0] } },
}

const tileContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // Slightly adjusted stagger
      delayChildren: 0.2, // Delay after overlay animation
    },
  },
}

const tileContentVariants = {
  // Renamed from tileVariants to apply to content inside the grid cell
  hidden: { opacity: 0, scale: 0.8, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 20, stiffness: 150 },
  },
}

const categoryBorderColors: Record<MobileMenuItem["category"], string> = {
  Main: "border-primary/50",
  Discovery: "border-sky-500/50",
  Content: "border-rose-500/50",
  Community: "border-orange-500/50",
  Personal: "border-yellow-500/50",
  Support: "border-gray-500/50",
  Admin: "border-red-600/50",
}
const categoryHoverBorderColors: Record<MobileMenuItem["category"], string> = {
  Main: "hover:border-primary/80",
  Discovery: "hover:border-sky-500/80",
  Content: "hover:border-rose-500/80",
  Community: "hover:border-orange-500/80",
  Personal: "hover:border-yellow-500/80",
  Support: "hover:border-gray-500/80",
  Admin: "hover:border-red-600/80",
}

const backgroundImages = [
  "/dark-atmospheric-cinematic-nebula.png",
  "/moody-abstract-film-noir-cityscape.png",
  "/futuristic-data-streams.png",
  "/placeholder.svg?width=720&height=1280",
  "/placeholder.svg?width=720&height=1280",
]

export const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isOpen, onClose }) => {
  const [currentLayout, setCurrentLayout] = useState<CurrentLayoutItem[]>([])
  const [dynamicDataCache, setDynamicDataCache] = useState<Record<string, any>>({})
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [currentBgImageUrl, setCurrentBgImageUrl] = useState<string>("")

  const generateNewTileLayout = useCallback(
    (items: MobileMenuItem[], pattern: LayoutPattern, dataCache: Record<string, any>): CurrentLayoutItem[] => {
      return items.map((item) => {
        const patternOverride = pattern.itemOverrides.find((override) => override.itemId === item.id)
        let chosenSizeId = item.defaultSizeId
        if (patternOverride) {
          chosenSizeId = patternOverride.sizeId
        }

        const chosenSize =
          item.possibleSizes.find((s) => s.id === chosenSizeId) ||
          item.possibleSizes.find((s) => s.id === item.defaultSizeId) ||
          item.possibleSizes[0]

        let dynamicData: any = undefined
        if (item.dynamicContentType === "notificationCount") dynamicData = dataCache.notifications || 0
        else if (item.dynamicContentType === "itemCount") {
          if (item.id === "watchlist") dynamicData = dataCache.watchlistCount || 0
          if (item.id === "favorites") dynamicData = dataCache.favoritesCount || 0
        } else if (item.dynamicContentType === "liveIndicator") dynamicData = dataCache.cricketLive || false

        return { item, chosenSize, dynamicData }
      })
    },
    [],
  )

  useEffect(() => {
    if (isOpen) {
      const newCache = {
        notifications: Math.floor(Math.random() * 15) + 1, // Ensure some notifications for demo
        watchlistCount: Math.floor(Math.random() * 50),
        favoritesCount: Math.floor(Math.random() * 30),
        cricketLive: Math.random() > 0.6,
      }
      setDynamicDataCache(newCache)

      const nextPatternIndex = (currentPatternIndex + 1) % layoutPatterns.length
      setCurrentPatternIndex(nextPatternIndex)
      const newGeneratedLayout = generateNewTileLayout(mobileMenuItems, layoutPatterns[nextPatternIndex], newCache)
      setCurrentLayout(newGeneratedLayout)

      const nextBgIndex = Math.floor(Math.random() * backgroundImages.length)
      setCurrentBgImageUrl(backgroundImages[nextBgIndex])
    }
  }, [isOpen, generateNewTileLayout]) // currentPatternIndex removed from deps

  const categorizedLayout = useMemo(() => {
    const categories: Record<string, CurrentLayoutItem[]> = {}
    currentLayout.forEach((layoutItem) => {
      const category = layoutItem.item.category
      if (!categories[category]) categories[category] = []
      categories[category].push(layoutItem)
    })
    const categoryOrder: MobileMenuItem["category"][] = [
      "Main",
      "Discovery",
      "Content",
      "Community",
      "Personal",
      "Support",
      "Admin",
    ]
    return Object.entries(categories).sort(
      ([catA], [catB]) =>
        categoryOrder.indexOf(catA as MobileMenuItem["category"]) -
        categoryOrder.indexOf(catB as MobileMenuItem["category"]),
    )
  }, [currentLayout])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col bg-black" // z-index increased
          style={{
            backgroundImage: currentBgImageUrl ? `url(${currentBgImageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={(e) => {
            // Close only if clicking the overlay itself, not its children
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
          {/* Translucent Dark Overlay */}
          <div className="absolute inset-0 bg-black/70 z-0"></div>

          {/* Content Area (relative to allow z-indexing above overlay) */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center p-4 pt-5 shrink-0">
              <div
                className="flex items-center text-xl font-semibold text-gray-100"
                style={getTextStyle({ textShadow: true } as MobileMenuItem)}
              >
                <LayoutGrid
                  className="w-6 h-6 mr-2.5 text-primary"
                  style={getIconStyle({ iconShadow: true } as MobileMenuItem)}
                />
                Menu
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={28} style={getIconStyle({ iconShadow: true } as MobileMenuItem)} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-3 pb-20">
              <motion.div variants={tileContainerVariants} initial="hidden" animate="visible">
                {categorizedLayout.map(([category, layoutItems]) => (
                  <div key={category} className="mb-6">
                    <h3
                      className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-3 px-1.5"
                      style={getTextStyle({ textShadow: true } as MobileMenuItem)}
                    >
                      {category}
                    </h3>
                    <div className="grid grid-cols-6 gap-2.5">
                      {layoutItems.map(({ item, chosenSize, dynamicData }) => (
                        <motion.div // This is the grid cell, transparent
                          key={item.id}
                          layout
                          className={cn(
                            "rounded-xl transition-all duration-200 ease-out relative group", // Group for hover effects on children
                            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-primary",
                            `col-span-${chosenSize.colSpan}`,
                            `row-span-${chosenSize.rowSpan}`,
                            categoryBorderColors[item.category],
                            categoryHoverBorderColors[item.category],
                            "border", // Subtle border to define the area
                          )}
                          whileTap={{ scale: 0.96 }} // Tap effect on the grid cell
                        >
                          <Link href={item.href} passHref legacyBehavior>
                            <motion.a // Content container for animation
                              variants={tileContentVariants}
                              onClick={onClose}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-2.5 h-full w-full focus:outline-none",
                                item.textColor || "text-gray-100",
                                "group-hover:text-white", // Ensure text brightens if not already white
                              )}
                              // Hover effect on the link content itself
                              whileHover={{ scale: 1.05, y: -2 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              <item.icon
                                className={cn(
                                  "mb-1 md:mb-1.5 transition-colors",
                                  chosenSize.rowSpan > 1 || chosenSize.colSpan > 2
                                    ? "w-7 h-7 md:w-8 md:h-8"
                                    : "w-6 h-6 md:w-7 md:h-7",
                                  item.accentColor || "text-primary",
                                  "group-hover:brightness-125",
                                )}
                                strokeWidth={1.5}
                                style={getIconStyle(item)}
                              />
                              <span
                                className={cn(
                                  "font-medium line-clamp-2 transition-colors",
                                  chosenSize.rowSpan > 1 || chosenSize.colSpan > 2
                                    ? "text-sm md:text-base"
                                    : "text-xs md:text-sm",
                                )}
                                style={getTextStyle(item)}
                              >
                                {item.label}
                              </span>

                              {/* Dynamic Content - Styled for visibility */}
                              {item.dynamicContentType === "notificationCount" && dynamicData > 0 && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                  className={cn(
                                    "absolute top-1.5 right-1.5 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 shadow-md",
                                    item.accentColor ? `bg-${item.accentColor.split("-")[1]}-500` : "bg-red-500", // Use accent color for badge bg
                                  )}
                                >
                                  {dynamicData > 99 ? "99+" : dynamicData}
                                </motion.div>
                              )}
                              {item.dynamicContentType === "itemCount" && dynamicData > 0 && (
                                <span className="text-[10px] text-gray-200 absolute bottom-1.5 right-1.5 bg-black/50 px-1.5 py-0.5 rounded-sm shadow">
                                  {dynamicData}
                                </span>
                              )}
                              {item.dynamicContentType === "liveIndicator" && dynamicData === true && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                  className="absolute top-1.5 left-1.5 text-[9px] bg-red-600/90 text-white font-semibold px-1.5 py-0.5 rounded-sm tracking-wider shadow-md"
                                >
                                  LIVE
                                </motion.div>
                              )}
                            </motion.a>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
