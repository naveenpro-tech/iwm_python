"use client"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfileNavigationProps {
  activeTab: string
  onTabChange: (value: string) => void
  showContact?: boolean
}

export function ProfileNavigation({ activeTab, onTabChange, showContact = false }: ProfileNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="bg-[#282828] p-1 h-auto">
        <TabsTrigger
          value="overview"
          className={cn(
            "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
            "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
          )}
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="filmography"
          className={cn(
            "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
            "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
          )}
        >
          Filmography
        </TabsTrigger>
        <TabsTrigger
          value="awards"
          className={cn(
            "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
            "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
          )}
        >
          Awards
        </TabsTrigger>
        <TabsTrigger
          value="press"
          className={cn(
            "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
            "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
          )}
        >
          Press Kit
        </TabsTrigger>
        <TabsTrigger
          value="pulses"
          className={cn(
            "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
            "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
          )}
        >
          Pulses
        </TabsTrigger>
        {showContact && (
          <TabsTrigger
            value="contact"
            className={cn(
              "px-4 py-2 rounded-md data-[state=active]:bg-[#3A3A3A] data-[state=active]:shadow",
              "data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]",
            )}
          >
            Contact
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  )
}
