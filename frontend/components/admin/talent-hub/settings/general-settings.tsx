"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export function GeneralSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure general talent hub settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hub-name">Talent Hub Name</Label>
            <Input id="hub-name" defaultValue="Siddu Talent Hub" />
            <p className="text-sm text-muted-foreground">
              This name will be displayed throughout the talent hub section
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hub-description">Talent Hub Description</Label>
            <Textarea
              id="hub-description"
              defaultValue="The definitive platform for film industry talent to showcase their work and connect with filmmakers."
              rows={3}
            />
            <p className="text-sm text-muted-foreground">This description appears on the talent hub landing page</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="talent-hub-active">Talent Hub Active</Label>
              <p className="text-sm text-muted-foreground">Enable or disable the entire talent hub functionality</p>
            </div>
            <Switch id="talent-hub-active" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profiles">Public Profiles</Label>
              <p className="text-sm text-muted-foreground">
                Allow talent profiles to be publicly visible without login
              </p>
            </div>
            <Switch id="public-profiles" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-approve">Auto-Approve Basic Profiles</Label>
              <p className="text-sm text-muted-foreground">Automatically approve profiles with basic information</p>
            </div>
            <Switch id="auto-approve" />
          </div>

          <Button className="mt-4">Save General Settings</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
