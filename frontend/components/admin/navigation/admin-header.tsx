"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, Search, ChevronRight, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function AdminHeader() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(3)

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === "/admin") return [{ label: "Dashboard", href: "/admin" }]

    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ label: "Dashboard", href: "/admin" }]

    let currentPath = ""
    for (let i = 1; i < paths.length; i++) {
      currentPath += `/${paths[i]}`
      breadcrumbs.push({
        label: paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace(/-/g, " "),
        href: `/admin${currentPath}`,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight size={16} className="mx-2 text-muted-foreground" />}
            <span className={index === breadcrumbs.length - 1 ? "font-medium" : "text-muted-foreground"}>
              {crumb.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search size={20} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell size={20} />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-white"
                >
                  {notifications}
                </motion.span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-medium">Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs">
                Mark all as read
              </Button>
            </div>
            <div className="py-2 px-4 text-sm text-muted-foreground">
              <div className="py-2 border-b border-border">
                <div className="font-medium text-foreground">New user registration</div>
                <div className="text-xs mt-1">A new industry professional has registered</div>
                <div className="text-xs mt-1 text-muted-foreground">2 minutes ago</div>
              </div>
              <div className="py-2 border-b border-border">
                <div className="font-medium text-foreground">Content flagged</div>
                <div className="text-xs mt-1">A review has been flagged for moderation</div>
                <div className="text-xs mt-1 text-muted-foreground">15 minutes ago</div>
              </div>
              <div className="py-2">
                <div className="font-medium text-foreground">System alert</div>
                <div className="text-xs mt-1">Database backup completed successfully</div>
                <div className="text-xs mt-1 text-muted-foreground">1 hour ago</div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-muted-foreground">Super Admin</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User size={16} className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
