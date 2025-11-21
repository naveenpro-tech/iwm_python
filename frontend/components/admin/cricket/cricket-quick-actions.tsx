"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Plus, Edit, RefreshCw, Database, Upload, Download } from "lucide-react"

export function CricketQuickActions() {
  const actions = [
    {
      title: "Add New Match",
      icon: Plus,
      href: "/admin/cricket/matches/new",
      variant: "default" as const,
    },
    {
      title: "Update Live Score",
      icon: Edit,
      href: "/admin/cricket/live-scores",
      variant: "secondary" as const,
    },
    {
      title: "Sync API Data",
      icon: RefreshCw,
      href: "/admin/cricket/api",
      variant: "outline" as const,
    },
    {
      title: "Manage Teams",
      icon: Database,
      href: "/admin/cricket/teams",
      variant: "outline" as const,
    },
    {
      title: "Import Data",
      icon: Upload,
      href: "/admin/cricket/import",
      variant: "outline" as const,
    },
    {
      title: "Export Data",
      icon: Download,
      href: "/admin/cricket/export",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common cricket management tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button variant={action.variant} className="w-full justify-start" asChild>
              <a href={action.href}>
                <action.icon className="mr-2 h-4 w-4" />
                {action.title}
              </a>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
