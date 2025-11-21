/**
 * Role Switcher Component
 * Dropdown to switch between available roles
 */

"use client"

import React, { useState } from "react"
import { useRoleContext } from "@/context/RoleContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const ROLE_ICONS: Record<string, string> = {
  lover: "❤️",
  critic: "⭐",
  talent: "🎭",
  industry: "💼",
}

export function RoleSwitcher() {
  const { activeRole, availableRoles, isLoading, switchRole } = useRoleContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const activeRoleInfo = availableRoles.find((r) => r.is_active)

  const handleRoleSwitch = async (role: string) => {
    try {
      setIsSwitching(true)
      await switchRole(role as any)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to switch role:", error)
    } finally {
      setIsSwitching(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading roles...
      </Button>
    )
  }

  if (!activeRoleInfo) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-[#E0E0E0] hover:text-[#00BFFF] hover:bg-[#1A1A1A]"
          disabled={isSwitching}
        >
          <span className="text-lg">{ROLE_ICONS[activeRole || "lover"]}</span>
          <span className="hidden sm:inline text-sm font-medium">{activeRoleInfo.name}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
        <DropdownMenuLabel className="text-[#00BFFF]">Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#3A3A3A]" />

        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role.role}
            onClick={() => handleRoleSwitch(role.role)}
            disabled={isSwitching || role.is_active}
            className={cn(
              "cursor-pointer gap-2 py-2 px-3 text-sm",
              role.is_active
                ? "bg-[#1A1A1A] text-[#00BFFF] font-medium"
                : "hover:bg-[#1A1A1A] hover:text-[#00BFFF]"
            )}
          >
            <span className="text-lg">{ROLE_ICONS[role.role]}</span>
            <div className="flex-1">
              <div className="font-medium">{role.name}</div>
              <div className="text-xs text-[#A0A0A0]">{role.description}</div>
            </div>
            {role.is_active && <span className="text-xs font-bold">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

