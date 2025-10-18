"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, ShieldCheck, Settings, AlertTriangle, MessageSquare, Search, BarChart2 } from "lucide-react"

const actions = [
  {
    title: "Verify Talent Profiles",
    description: "Review pending verification requests",
    icon: ShieldCheck,
    href: "/admin/talent-hub/verification",
  },
  {
    title: "Manage Casting Calls",
    description: "Review and moderate casting calls",
    icon: FileText,
    href: "/admin/talent-hub/casting-calls",
  },
  {
    title: "Review Reported Content",
    description: "Handle reported profiles and calls",
    icon: AlertTriangle,
    href: "/admin/talent-hub/reports",
  },
  {
    title: "Browse Talent Profiles",
    description: "Search and manage talent profiles",
    icon: Search,
    href: "/admin/talent-hub/profiles",
  },
  {
    title: "Messaging System",
    description: "Manage talent hub communications",
    icon: MessageSquare,
    href: "/admin/talent-hub/messages",
  },
  {
    title: "Talent Hub Analytics",
    description: "View detailed usage statistics",
    icon: BarChart2,
    href: "/admin/talent-hub/analytics",
  },
  {
    title: "Talent Hub Settings",
    description: "Configure talent hub parameters",
    icon: Settings,
    href: "/admin/talent-hub/settings",
  },
]

export function TalentHubActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common talent hub management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button variant="ghost" className="w-full justify-start text-left h-auto py-3" asChild>
                <a href={action.href}>
                  <div className={`p-1.5 rounded-md bg-primary/10 text-primary mr-3`}>
                    <action.icon size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
