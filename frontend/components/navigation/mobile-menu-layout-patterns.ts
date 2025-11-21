import type { MobileMenuItem, TileSizeOption } from "./mobile-menu-items"

export interface LayoutPattern {
  name: string
  itemOverrides: Array<{
    itemId: MobileMenuItem["id"]
    sizeId: TileSizeOption["id"] // Reference to one of the item's possibleSizes
  }>
}

// Define specific TileSizeOption instances that items can reference
const size1x1: TileSizeOption = { id: "1x1", colSpan: 2, rowSpan: 1 }
const size2x1: TileSizeOption = { id: "2x1", colSpan: 4, rowSpan: 1 }
const size1x2: TileSizeOption = { id: "1x2", colSpan: 2, rowSpan: 2 }
const size2x2: TileSizeOption = { id: "2x2", colSpan: 4, rowSpan: 2 }
const size3x1: TileSizeOption = { id: "3x1", colSpan: 6, rowSpan: 1 }

export const layoutPatterns: LayoutPattern[] = [
  {
    name: "Discovery Focus",
    itemOverrides: [
      { itemId: "home", sizeId: "2x1" },
      { itemId: "explore", sizeId: "2x2" }, // Larger explore
      { itemId: "search", sizeId: "2x1" }, // Wider search
      { itemId: "movies", sizeId: "2x1" },
      { itemId: "pulse", sizeId: "2x1" },
      { itemId: "notifications", sizeId: "1x2" }, // Taller notifications
      { itemId: "cricket", sizeId: "1x1" },
    ],
  },
  {
    name: "Content Centric",
    itemOverrides: [
      { itemId: "home", sizeId: "3x1" }, // Prominent home
      { itemId: "movies", sizeId: "2x2" }, // Larger movies
      { itemId: "visual-treats", sizeId: "2x1" },
      { itemId: "pulse", sizeId: "2x2" }, // Larger pulse
      { itemId: "cricket", sizeId: "2x1" }, // Wider cricket
      { itemId: "explore", sizeId: "1x1" },
      { itemId: "notifications", sizeId: "1x1" },
    ],
  },
  {
    name: "Personalized View",
    itemOverrides: [
      { itemId: "home", sizeId: "2x1" },
      { itemId: "profile", sizeId: "2x1" },
      { itemId: "notifications", sizeId: "2x2" }, // Prominent notifications
      { itemId: "watchlist", sizeId: "2x1" },
      { itemId: "favorites", sizeId: "1x1" },
      { itemId: "explore", sizeId: "2x1" },
      { itemId: "movies", sizeId: "1x1" },
      { itemId: "pulse", sizeId: "1x1" },
    ],
  },
  {
    name: "Balanced Default", // A more standard, less opinionated layout
    itemOverrides: [
      // Most items will use their defaultSizeId from mobile-menu-items.ts
      // Only specify overrides if needed for this "balanced" theme
      { itemId: "home", sizeId: "2x1" },
      { itemId: "explore", sizeId: "2x1" },
      { itemId: "movies", sizeId: "2x1" },
      { itemId: "pulse", sizeId: "2x1" },
      { itemId: "notifications", sizeId: "1x1" },
      { itemId: "search", sizeId: "1x1" },
      { itemId: "cricket", sizeId: "1x1" },
    ],
  },
]
