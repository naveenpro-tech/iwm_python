"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Star,
  Pin,
  Link as LinkIcon,
  Briefcase,
  BarChart3,
  Settings,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/studio",
    icon: LayoutDashboard,
  },
  {
    name: "Blog Posts",
    href: "/studio/blog",
    icon: FileText,
  },
  {
    name: "Recommendations",
    href: "/studio/recommendations",
    icon: Star,
  },
  {
    name: "Pinned Content",
    href: "/studio/pinned",
    icon: Pin,
  },
  {
    name: "Affiliate Links",
    href: "/studio/affiliate",
    icon: LinkIcon,
  },
  {
    name: "Brand Deals",
    href: "/studio/deals",
    icon: Briefcase,
  },
  {
    name: "Analytics",
    href: "/studio/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/studio/settings",
    icon: Settings,
  },
]

export function StudioSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <Link href="/studio" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Critic Studio</h1>
            <p className="text-xs text-muted-foreground">Content Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>← Back to Site</span>
        </Link>
      </div>
    </aside>
  )
}

