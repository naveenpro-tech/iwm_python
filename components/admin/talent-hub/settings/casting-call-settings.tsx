"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export function CastingCallSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Casting Call Settings</CardTitle>
          <CardDescription>Configure casting call parameters and moderation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="approval-mode">Casting Call Approval Mode</Label>
            <Select defaultValue="post-moderation">
              <SelectTrigger id="approval-mode">
                <SelectValue placeholder="Select approval mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto-approve">Auto-Approve All</SelectItem>
                <SelectItem value="verified-only">Auto-Approve Verified Users Only</SelectItem>
                <SelectItem value="post-moderation">Post-Moderation (Review After Publishing)</SelectItem>
                <SelectItem value="pre-moderation">Pre-Moderation (Review Before Publishing)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Determines how casting calls are approved before becoming visible
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-active-calls">Maximum Active Calls per User</Label>
              <Input id="max-active-calls" type="number" defaultValue="5" />
              <p className="text-sm text-muted-foreground">Limit the number of active casting calls per user</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-duration">Maximum Duration (days)</Label>
              <Input id="max-duration" type="number" defaultValue="90" />
              <p className="text-sm text-muted-foreground">Maximum number of days a casting call can remain active</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-compensation">Require Compensation Details</Label>
              <p className="text-sm text-muted-foreground">
                Force users to specify compensation details for casting calls
              </p>
            </div>
            <Switch id="require-compensation" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-unpaid">Allow Unpaid Opportunities</Label>
              <p className="text-sm text-muted-foreground">Allow posting of unpaid roles and opportunities</p>
            </div>
            <Switch id="allow-unpaid" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-close">Auto-Close Expired Calls</Label>
              <p className="text-sm text-muted-foreground">Automatically close casting calls after their deadline</p>
            </div>
            <Switch id="auto-close" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-applications">Allow Direct Applications</Label>
              <p className="text-sm text-muted-foreground">Allow talent to apply directly through the platform</p>
            </div>
            <Switch id="allow-applications" defaultChecked />
          </div>

          <Button className="mt-4">Save Casting Call Settings</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
