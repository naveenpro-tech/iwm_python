"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"

export function NotificationSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure talent hub notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Admin Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-profile-notification">New Profile Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when new talent profiles are created
                </p>
              </div>
              <Switch id="new-profile-notification" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="verification-notification">Verification Request Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for new verification requests</p>
              </div>
              <Switch id="verification-notification" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="casting-notification">New Casting Call Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when new casting calls are posted</p>
              </div>
              <Switch id="casting-notification" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="report-notification">Content Report Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when content is reported</p>
              </div>
              <Switch id="report-notification" defaultChecked />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Email Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-digest">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of all talent hub activity</p>
              </div>
              <Switch id="daily-digest" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-report">Weekly Report</Label>
                <p className="text-sm text-muted-foreground">Receive a weekly summary of talent hub metrics</p>
              </div>
              <Switch id="weekly-report" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="urgent-alerts">Urgent Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive immediate email notifications for urgent issues</p>
              </div>
              <Switch id="urgent-alerts" defaultChecked />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Mobile Notifications</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable push notifications on mobile devices</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Disable notifications during specified hours</p>
              </div>
              <Switch id="quiet-hours" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
