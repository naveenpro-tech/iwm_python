import type React from "react"
import {
  Home,
  Compass,
  Film,
  Flame,
  Users,
  Clapperboard,
  Award,
  Heart,
  Search,
  Settings,
  HelpCircle,
  Sparkles,
  Ticket,
  BarChart3,
  ListVideo,
  Star,
  Map,
  Bell,
  type LucideIcon,
} from "lucide-react"

export interface TileSizeOption {
  id: string
  colSpan: number // Based on a 6-column mobile grid
  rowSpan: number
}

export interface MobileMenuItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  category: "Main" | "Discovery" | "Content" | "Community" | "Personal" | "Support" | "Admin"

  possibleSizes: TileSizeOption[]
  defaultSizeId: string
  layoutPriority?: number // Higher number means more likely to get a larger/prominent spot (0-10)

  dynamicContentType?: "notificationCount" | "itemCount" | "liveIndicator"

  // Visual properties for transparent tiles
  textColor?: string // Default will be light, e.g., text-gray-100
  accentColor?: string // For icon, badges, hover effects
  iconShadow?: boolean | string // true for default, string for custom filter
  textShadow?: boolean | string // true for default, string for custom text-shadow
}

// Define some common sizes
const size1x1: TileSizeOption = { id: "1x1", colSpan: 2, rowSpan: 1 }
const size2x1: TileSizeOption = { id: "2x1", colSpan: 4, rowSpan: 1 }
const size1x2: TileSizeOption = { id: "1x2", colSpan: 2, rowSpan: 2 }
const size2x2: TileSizeOption = { id: "2x2", colSpan: 4, rowSpan: 2 }
const size3x1: TileSizeOption = { id: "3x1", colSpan: 6, rowSpan: 1 }
const sizeFullWidthCard: TileSizeOption = { id: "fullCard", colSpan: 6, rowSpan: 2 } // Example larger tile

const defaultTextColor = "text-gray-100"
const defaultIconShadow = "drop-shadow(0 1px 2px rgba(0,0,0,0.6))"
const defaultTextShadow = "0 1px 4px rgba(0,0,0,0.8)"

export const mobileMenuItems: MobileMenuItem[] = [
  // Main
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: Home,
    category: "Main",
    possibleSizes: [size2x1, size3x1, size2x2, sizeFullWidthCard],
    defaultSizeId: "3x1",
    layoutPriority: 10,
    accentColor: "text-primary", // Use Vercel's primary color
    textColor: "text-white",
    iconShadow: true,
    textShadow: true,
  },

  // Discovery
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    icon: Compass,
    category: "Discovery",
    possibleSizes: [size2x1, size2x2],
    defaultSizeId: "2x1",
    layoutPriority: 9,
    accentColor: "text-sky-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "search",
    label: "Search",
    href: "/search",
    icon: Search,
    category: "Discovery",
    possibleSizes: [size1x1, size2x1],
    defaultSizeId: "2x1", // Made search more prominent
    layoutPriority: 8, // Increased priority
    accentColor: "text-green-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },

  // Content
  {
    id: "movies",
    label: "Movies",
    href: "/movies",
    icon: Film,
    category: "Content",
    possibleSizes: [size2x1, size2x2],
    defaultSizeId: "2x1",
    layoutPriority: 8,
    accentColor: "text-rose-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "visual-treats",
    label: "Visual Treats",
    href: "/visual-treats",
    icon: Sparkles,
    category: "Content",
    possibleSizes: [size2x1, size1x2],
    defaultSizeId: "2x1",
    layoutPriority: 7,
    accentColor: "text-purple-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "cricket",
    label: "Cricket",
    href: "/cricket",
    icon: BarChart3,
    category: "Content",
    possibleSizes: [size2x1, size1x1, size1x2],
    defaultSizeId: "2x1",
    layoutPriority: 7,
    dynamicContentType: "liveIndicator",
    accentColor: "text-emerald-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "scene-explorer",
    label: "Scenes",
    href: "/scene-explorer",
    icon: Clapperboard,
    category: "Content",
    possibleSizes: [size1x1, size2x1],
    defaultSizeId: "1x1",
    layoutPriority: 6,
    accentColor: "text-red-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "awards",
    label: "Awards",
    href: "/awards",
    icon: Award,
    category: "Content",
    possibleSizes: [size1x1],
    defaultSizeId: "1x1",
    layoutPriority: 5,
    accentColor: "text-yellow-300",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "festivals",
    label: "Festivals",
    href: "/festivals",
    icon: Map,
    category: "Content",
    possibleSizes: [size1x1],
    defaultSizeId: "1x1",
    layoutPriority: 5,
    accentColor: "text-lime-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "box-office",
    label: "Box Office",
    href: "/box-office",
    icon: Ticket,
    category: "Content",
    possibleSizes: [size1x1],
    defaultSizeId: "1x1",
    layoutPriority: 5,
    accentColor: "text-green-500",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },

  // Community
  {
    id: "pulse",
    label: "Pulse",
    href: "/pulse",
    icon: Flame,
    category: "Community",
    possibleSizes: [size2x1, size2x2],
    defaultSizeId: "2x1",
    layoutPriority: 8,
    accentColor: "text-orange-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "talent-hub",
    label: "Talent Hub",
    href: "/talent-hub",
    icon: Users, // Using Users icon for Talent Hub
    category: "Community",
    possibleSizes: [size2x1, size1x1],
    defaultSizeId: "2x1",
    layoutPriority: 6,
    accentColor: "text-indigo-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "industry-hub",
    label: "Industry",
    href: "/industry",
    icon: Clapperboard, // Consider a different icon if Clapperboard is too similar to Scenes
    category: "Community",
    possibleSizes: [size2x1, size1x1],
    defaultSizeId: "1x1", // Smaller default
    layoutPriority: 6,
    accentColor: "text-cyan-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },

  // Personal
  {
    id: "profile",
    label: "My Profile",
    href: "/profile",
    icon: Users, // Using Users icon for Profile
    category: "Personal",
    possibleSizes: [size2x1, size1x1],
    defaultSizeId: "1x1", // Smaller default
    layoutPriority: 7,
    accentColor: "text-yellow-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    category: "Personal",
    possibleSizes: [size1x1, size1x2],
    defaultSizeId: "1x1",
    layoutPriority: 9, // High priority for notifications
    dynamicContentType: "notificationCount",
    accentColor: "text-red-500", // For the badge
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "watchlist",
    label: "Watchlist",
    href: "/watchlist",
    icon: Heart,
    category: "Personal",
    possibleSizes: [size1x1, size2x1],
    defaultSizeId: "1x1",
    layoutPriority: 6,
    dynamicContentType: "itemCount",
    accentColor: "text-pink-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "favorites",
    label: "Favorites",
    href: "/favorites",
    icon: Star,
    category: "Personal",
    possibleSizes: [size1x1],
    defaultSizeId: "1x1",
    layoutPriority: 5,
    dynamicContentType: "itemCount",
    accentColor: "text-amber-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "collections",
    label: "Collections",
    href: "/collections",
    icon: ListVideo,
    category: "Personal",
    possibleSizes: [size1x1],
    defaultSizeId: "1x1",
    layoutPriority: 5,
    accentColor: "text-teal-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },

  // Support
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    category: "Support",
    possibleSizes: [size1x1],
    defaultSizeId: "1x1",
    layoutPriority: 4,
    accentColor: "text-gray-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  {
    id: "help",
    label: "Help Center",
    href: "/help",
    icon: HelpCircle,
    category: "Support",
    possibleSizes: [size1x1, size2x1],
    defaultSizeId: "1x1",
    layoutPriority: 4,
    accentColor: "text-gray-400",
    textColor: defaultTextColor,
    iconShadow: true,
    textShadow: true,
  },
  // Admin (conditionally rendered or accessed)
  // {
  //   id: "admin",
  //   label: "Admin Panel",
  //   href: "/admin",
  //   icon: ShieldCheck,
  //   category: "Admin",
  //   possibleSizes: [size1x1, size2x1],
  //   defaultSizeId: "1x1",
  //   layoutPriority: 1, // Low priority for general users
  //   accentColor: "text-red-600",
  //   textColor: defaultTextColor,
  //   iconShadow: true,
  //   textShadow: true,
  // },
]

// Helper function to apply default shadows if requested
export const getIconStyle = (item: MobileMenuItem): React.CSSProperties => {
  const style: React.CSSProperties = {}
  if (item.iconShadow) {
    style.filter = typeof item.iconShadow === "string" ? item.iconShadow : defaultIconShadow
  }
  return style
}

export const getTextStyle = (item: MobileMenuItem): React.CSSProperties => {
  const style: React.CSSProperties = {}
  if (item.textShadow) {
    style.textShadow = typeof item.textShadow === "string" ? item.textShadow : defaultTextShadow
  }
  return style
}
