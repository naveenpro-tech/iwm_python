"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomepageSectionManager } from "@/components/admin/content/homepage-section-manager"
import { CuratedListsManager } from "@/components/admin/content/curated-lists-manager"
import { PromotionalContentManager } from "@/components/admin/content/promotional-content-manager"
import { EventsAwardsManager } from "@/components/admin/content/events-awards-manager"
import { motion } from "framer-motion"

export default function PlatformContentManagementPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Platform Content Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage homepage sections, curated lists, promotional content, and events
        </p>
      </motion.div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="lists">Curated Lists</TabsTrigger>
          <TabsTrigger value="promotional">Promotional</TabsTrigger>
          <TabsTrigger value="events">Events & Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <HomepageSectionManager />
        </TabsContent>

        <TabsContent value="lists">
          <CuratedListsManager />
        </TabsContent>

        <TabsContent value="promotional">
          <PromotionalContentManager />
        </TabsContent>

        <TabsContent value="events">
          <EventsAwardsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
