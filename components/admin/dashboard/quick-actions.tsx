"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import {
  UserPlus,
  FilePlus,
  ShieldAlert,
  Settings,
  UserCheck,
  Briefcase,
  HelpCircle,
  BarChart3,
  Zap,
  FileText,
  Tv,
} from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Add New User",
    description: "Create a new user account",
    icon: UserPlus,
    href: "/admin/users/new", // Assuming a route for new user creation
    color: "text-blue-500",
  },
  {
    title: "Add New Movie",
    description: "Add a movie to the database",
    icon: FilePlus,
    href: "/admin/movies/new", // Assuming a route for new movie creation
    color: "text-purple-500",
  },
  {
    title: "Moderate Content",
    description: "Review flagged content",
    icon: ShieldAlert,
    href: "/admin/moderation",
    color: "text-amber-500",
  },
  {
    title: "Verify Talent Profile",
    description: "Review talent verifications",
    icon: UserCheck,
    href: "/admin/talent-hub/verification",
    color: "text-teal-500",
  },
  {
    title: "Verify Industry Profile",
    description: "Review industry verifications",
    icon: Briefcase,
    href: "/admin/industry/verification",
    color: "text-indigo-500",
  },
  {
    title: "Create New Quiz",
    description: "Add a movie knowledge quiz",
    icon: HelpCircle,
    href: "/admin/quizzes/create",
    color: "text-rose-500",
  },
  {
    title: "Manage Platform Content",
    description: "Update homepage, lists, etc.",
    icon: FileText,
    href: "/admin/content",
    color: "text-green-500",
  },
  {
    title: "View Analytics",
    description: "Access reports & dashboards",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "text-sky-500",
  },
  {
    title: "System Optimization",
    description: "Performance & health checks",
    icon: Zap,
    href: "/admin/optimization",
    color: "text-lime-500",
  },
  {
    title: "Manage Streaming Sources",
    description: "Update 'Where to Watch' data",
    icon: Tv,
    href: "/admin/where-to-watch",
    color: "text-orange-500",
  },
  {
    title: "System Settings",
    description: "Configure platform settings",
    icon: Settings,
    href: "/admin/system",
    color: "text-slate-500",
  },
]

export function QuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[350px] md:h-[400px] pr-2">
          <div className="space-y-2">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Button variant="ghost" className="w-full justify-start text-left h-auto py-2.5 px-3" asChild>
                  <Link href={action.href}>
                    <div className={`p-1.5 rounded-md bg-muted mr-3`}>
                      <action.icon size={16} className={action.color} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
