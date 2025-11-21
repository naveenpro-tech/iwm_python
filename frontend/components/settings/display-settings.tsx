"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Moon, Monitor, Palette, TextIcon, Contrast } from "lucide-react"
import { useTheme } from "next-themes" // Assuming next-themes is used

interface DisplaySettingsData {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  highContrastMode: boolean
  reduceMotion: boolean
}

const initialDisplaySettings: DisplaySettingsData = {
  theme: "dark", // Default to dark as per project instructions
  fontSize: "medium",
  highContrastMode: false,
  reduceMotion: false,
}

export function DisplaySettings() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<DisplaySettingsData>({
    ...initialDisplaySettings,
    theme: (theme as DisplaySettingsData["theme"]) || "dark",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    // Apply settings to the document, e.g., by adding classes to <html>
    document.documentElement.classList.toggle("high-contrast", settings.highContrastMode)
    document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion)
    // Font size might need specific CSS or context provider
    if (mounted) {
      document.documentElement.style.fontSize =
        settings.fontSize === "small" ? "14px" : settings.fontSize === "large" ? "18px" : "16px"
    }
  }, [settings.highContrastMode, settings.reduceMotion, settings.fontSize, mounted])

  const handleThemeChange = (newTheme: DisplaySettingsData["theme"]) => {
    setTheme(newTheme)
    setSettings((prev) => ({ ...prev, theme: newTheme }))
  }

  const handleSettingChange = (key: keyof DisplaySettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    console.log("Saving display settings:", settings)
    // Simulate API call / saving to localStorage
    localStorage.setItem("displaySettings", JSON.stringify(settings))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Display settings updated!") // Replace with toast
  }

  if (!mounted) return null // Avoid rendering mismatch during hydration with next-themes

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Palette className="h-6 w-6 mr-2 text-sky-400" /> Display Settings
        </CardTitle>
        <CardDescription className="text-gray-400">Customize the look and feel of the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200">Theme</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={settings.theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className={settings.theme === "light" ? "bg-sky-600" : "bg-gray-700 border-gray-600"}
            >
              <Sun className="h-4 w-4 mr-2" /> Light
            </Button>
            <Button
              variant={settings.theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className={settings.theme === "dark" ? "bg-sky-600" : "bg-gray-700 border-gray-600"}
            >
              <Moon className="h-4 w-4 mr-2" /> Dark
            </Button>
            <Button
              variant={settings.theme === "system" ? "default" : "outline"}
              onClick={() => handleThemeChange("system")}
              className={settings.theme === "system" ? "bg-sky-600" : "bg-gray-700 border-gray-600"}
            >
              <Monitor className="h-4 w-4 mr-2" /> System
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <TextIcon className="h-5 w-5 mr-2 text-sky-300" />
            Font Size
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="fontSize" className="text-gray-300">
              Adjust text size
            </Label>
            <Select
              value={settings.fontSize}
              onValueChange={(value) => handleSettingChange("fontSize", value as DisplaySettingsData["fontSize"])}
            >
              <SelectTrigger id="fontSize" className="w-[150px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Contrast className="h-5 w-5 mr-2 text-sky-300" />
            Accessibility
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="highContrastMode" className="text-gray-300">
              High Contrast Mode
            </Label>
            <Switch
              id="highContrastMode"
              checked={settings.highContrastMode}
              onCheckedChange={(checked) => handleSettingChange("highContrastMode", checked)}
              className="data-[state=checked]:bg-sky-500"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Label htmlFor="reduceMotion" className="text-gray-300">
              Reduce Motion
            </Label>
            <Switch
              id="reduceMotion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => handleSettingChange("reduceMotion", checked)}
              className="data-[state=checked]:bg-sky-500"
            />
          </div>
          <p className="text-xs text-gray-500">Enable these options for improved readability and reduced animations.</p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-700 pt-6">
        <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-sky-600 hover:bg-sky-500 text-white">
          {isSaving ? "Saving..." : "Save Display Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}
