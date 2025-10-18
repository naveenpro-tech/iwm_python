"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { UserCheck, UserPlus, FileText, AlertTriangle, Settings, BarChart3, MessageSquare, Flag } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: UserCheck,
      label: "Review Verification Requests",
      href: "/admin/industry/verification",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: UserPlus,
      label: "Add New Professional",
      href: "/admin/industry/professionals/new",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: FileText,
      label: "Manage Filmography Credits",
      href: "/admin/industry/credits",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: AlertTriangle,
      label: "Review Flagged Profiles",
      href: "/admin/industry/flagged",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: MessageSquare,
      label: "Manage Pulse Posts",
      href: "/admin/industry/pulse",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Flag,
      label: "Content Moderation",
      href: "/admin/industry/moderation",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      href: "/admin/industry/analytics",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: Settings,
      label: "Industry Settings",
      href: "/admin/industry/settings",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto flex flex-col items-center justify-center py-3 px-2 gap-2 ${action.bgColor} hover:${action.bgColor} border-border`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
