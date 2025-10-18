"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Film,
  UserCheck,
  Briefcase,
  BirdIcon as Cricket,
  HelpCircle,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Content Moderation",
    href: "/admin/moderation",
    icon: ShieldAlert,
  },
  {
    title: "Movie Management",
    href: "/admin/movies",
    icon: Film,
  },
  {
    title: "Talent Hub Management",
    href: "/admin/talent-hub",
    icon: UserCheck,
  },
  {
    title: "Industry Professional Management",
    href: "/admin/industry",
    icon: Briefcase,
  },
  {
    title: "Cricket Content Management",
    href: "/admin/cricket",
    icon: Cricket,
  },
  {
    title: "Quiz System Management",
    href: "/admin/quizzes",
    icon: HelpCircle,
  },
  {
    title: "Platform Content Management",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Analytics & Reporting",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "System Optimization",
    href: "/admin/optimization",
    icon: Zap,
    highlight: true,
  },
  {
    title: "System Management",
    href: "/admin/system",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card border-r border-border h-screen overflow-y-auto flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={cn("font-bold text-xl", collapsed && "invisible")}
        >
          Siddu Admin
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10 px-3",
                      isActive && "bg-primary/10 text-primary",
                      collapsed && "justify-center px-0",
                      item.highlight && !isActive && "text-primary",
                    )}
                  >
                    <item.icon size={20} className={cn("shrink-0", !collapsed && "mr-2")} />
                    {!collapsed && (
                      <span>
                        {item.title}
                        {item.highlight && !isActive && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </span>
                    )}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={cn("text-xs text-muted-foreground", collapsed && "invisible")}
        >
          Siddu Global Entertainment Hub
          <div className="mt-1">Admin Panel v1.0</div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
