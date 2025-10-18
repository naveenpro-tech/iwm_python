"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"

export function VerificationSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Verification Settings</CardTitle>
          <CardDescription>Configure how talent profiles are verified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-level">Verification Level</Label>
            <Select defaultValue="standard">
              <SelectTrigger id="verification-level">
                <SelectValue placeholder="Select verification level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (ID only)</SelectItem>
                <SelectItem value="standard">Standard (ID + Portfolio)</SelectItem>
                <SelectItem value="advanced">Advanced (ID + Portfolio + References)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Determines the level of verification required for talent profiles
            </p>
          </div>

          <div className="space-y-2">
            <Label>Required Documents</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="id-proof" defaultChecked />
                <Label htmlFor="id-proof">Government ID Proof</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="portfolio" defaultChecked />
                <Label htmlFor="portfolio">Portfolio/Showreel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="experience" defaultChecked />
                <Label htmlFor="experience">Experience Certificate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="social-links" defaultChecked />
                <Label htmlFor="social-links">Professional Social Links</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="references" />
                <Label htmlFor="references">Industry References</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="awards" />
                <Label htmlFor="awards">Awards/Recognition Proof</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-verification">Auto-Verification for Known Entities</Label>
              <p className="text-sm text-muted-foreground">
                Automatically verify profiles with verified social media accounts
              </p>
            </div>
            <Switch id="auto-verification" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verification-expiry">Verification Expiry</Label>
              <p className="text-sm text-muted-foreground">Require re-verification after 1 year of inactivity</p>
            </div>
            <Switch id="verification-expiry" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verification-badge">Display Verification Badge</Label>
              <p className="text-sm text-muted-foreground">Show verification badge on talent profiles</p>
            </div>
            <Switch id="verification-badge" defaultChecked />
          </div>

          <Button className="mt-4">Save Verification Settings</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
