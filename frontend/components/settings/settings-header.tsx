"use client"

import { motion } from "framer-motion"
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsHeaderProps {
  hasUnsavedChanges: boolean
}

export function SettingsHeader({ hasUnsavedChanges }: SettingsHeaderProps) {
  return (
    <div className="border-b border-gray-700 bg-[#1A1A1A]/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#00BFFF]/20 rounded-lg">
              <Settings className="h-6 w-6 text-[#00BFFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your account and preferences</p>
            </div>
          </div>

          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
