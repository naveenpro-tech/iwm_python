"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Plus, ImageIcon, Bell, BarChart, Calendar, Users, Trash, Edit } from "lucide-react"

interface PromotionalItem {
  id: string
  type: "banner" | "announcement"
  title: string
  status: "active" | "scheduled" | "expired"
  startDate: string
  endDate: string
  targeting: string
  clicks?: number
  impressions?: number
}

const mockBanners: PromotionalItem[] = [
  {
    id: "1",
    type: "banner",
    title: "Summer Movie Festival 2024",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    targeting: "All users",
    clicks: 1234,
    impressions: 45678,
  },
  {
    id: "2",
    type: "banner",
    title: "New User Welcome Offer",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    targeting: "New users",
    clicks: 567,
    impressions: 12345,
  },
]

const mockAnnouncements: PromotionalItem[] = [
  {
    id: "3",
    type: "announcement",
    title: "Platform Maintenance Notice",
    status: "scheduled",
    startDate: "2024-02-01",
    endDate: "2024-02-02",
    targeting: "All users",
  },
  {
    id: "4",
    type: "announcement",
    title: "New Features Released",
    status: "expired",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    targeting: "All users",
  },
]

export function PromotionalContentManager() {
  const getStatusColor = (status: PromotionalItem["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "scheduled":
        return "bg-blue-500/10 text-blue-500"
      case "expired":
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="banners">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Site-wide Banners</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Promotional banners displayed across the platform</p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Create Banner
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBanners.map((banner, index) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon size={24} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{banner.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(banner.status)} variant="secondary">
                            {banner.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{banner.targeting}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive">
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(banner.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(banner.endDate).toLocaleDateString()}</p>
                    </div>
                    {banner.impressions && (
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-medium">{banner.impressions.toLocaleString()}</p>
                      </div>
                    )}
                    {banner.clicks && (
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-medium">{banner.clicks.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <BarChart size={14} />
                      Analytics
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Calendar size={14} />
                      Schedule
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Users size={14} />
                      Targeting
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Announcements</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Notifications and alerts for users</p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Create Announcement
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <Bell size={24} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{announcement.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(announcement.status)} variant="secondary">
                            {announcement.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{announcement.targeting}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive">
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(announcement.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(announcement.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Calendar size={14} />
                      Schedule
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Users size={14} />
                      Targeting
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
