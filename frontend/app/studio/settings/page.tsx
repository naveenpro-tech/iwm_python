"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function StudioSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Studio Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your critic studio preferences</p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Studio Settings</CardTitle>
          <CardDescription>Customize your studio experience</CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Settings className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Settings Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Studio-specific settings will be available in the next update. 
              For now, use the main settings page to manage your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

