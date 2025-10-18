"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { UserX, UserCheck, Trash2, Users, ShieldCheck, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { type UserRole, ALL_USER_ROLES } from "./types"

export type BatchActionType =
  | "suspend"
  | "activate"
  | "delete"
  | { type: "assignRole"; role: UserRole }
  | { type: "removeRole"; role: UserRole }

interface UserBatchActionsToolbarProps {
  selectedUserIds: string[]
  onAction: (action: BatchActionType) => void
  onClearSelection: () => void
}

export function UserBatchActionsToolbar({ selectedUserIds, onAction, onClearSelection }: UserBatchActionsToolbarProps) {
  if (selectedUserIds.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border shadow-xl rounded-lg p-3 flex items-center space-x-3"
    >
      <div className="flex items-center text-sm font-medium text-foreground">
        <Users size={16} className="mr-2 text-primary" />
        {selectedUserIds.length} user{selectedUserIds.length > 1 ? "s" : ""} selected
      </div>
      <Button variant="outline" size="sm" onClick={() => onAction("activate")}>
        <UserCheck size={14} className="mr-1" /> Activate
      </Button>
      <Button variant="outline" size="sm" onClick={() => onAction("suspend")}>
        <UserX size={14} className="mr-1" /> Suspend
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ShieldCheck size={14} className="mr-1" /> Manage Roles <ChevronDown size={14} className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            Assign Role:
          </DropdownMenuItem>
          {ALL_USER_ROLES.filter((r) => r !== "Verified").map(
            (
              role, // 'Verified' might be special
            ) => (
              <DropdownMenuItem key={`assign-${role}`} onClick={() => onAction({ type: "assignRole", role })}>
                Assign {role}
              </DropdownMenuItem>
            ),
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            Remove Role:
          </DropdownMenuItem>
          {ALL_USER_ROLES.filter((r) => r !== "User").map(
            (
              role, // Cannot remove 'User' role typically
            ) => (
              <DropdownMenuItem key={`remove-${role}`} onClick={() => onAction({ type: "removeRole", role })}>
                Remove {role}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="destructive" size="sm" onClick={() => onAction("delete")}>
        <Trash2 size={14} className="mr-1" /> Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-muted-foreground">
        Clear Selection
      </Button>
    </motion.div>
  )
}
