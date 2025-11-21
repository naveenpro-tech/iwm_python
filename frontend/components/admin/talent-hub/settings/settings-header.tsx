"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function SettingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talent Hub Settings</h1>
        <p className="text-muted-foreground">Configure talent hub parameters and policies</p>
      </div>
      <Button>
        <Save className="mr-2 h-4 w-4" />
        Save All Changes
      </Button>
    </div>
  )
}
