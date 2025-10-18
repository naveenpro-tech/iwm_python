"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserX,
  UserCheck,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Filter,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { type User, type UserRole, type UserStatus, ALL_USER_ROLES, ALL_USER_STATUSES } from "./types"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { AddUserModal } from "./add-user-modal"
import { ManageRolesModal } from "./manage-roles-modal"
import { UserBatchActionsToolbar, type BatchActionType } from "./user-batch-actions-toolbar"

// Expanded Mock user data
const initialUsers: User[] = Array.from({ length: 28 }, (_, i) => {
  const rolesSample: UserRole[][] = [
    ["User"],
    ["User", "Talent"],
    ["User", "Industry Professional"],
    ["User", "Moderator"],
    ["User", "Talent", "Verified"],
    ["User", "Admin"],
  ]
  const statusSample: UserStatus[] = ["Active", "Suspended", "Inactive"]
  const firstNames = [
    "Rahul",
    "Priya",
    "Vikram",
    "Ananya",
    "Arjun",
    "Neha",
    "Rajesh",
    "Deepika",
    "Sanjay",
    "Kavita",
    "Amit",
    "Sunita",
  ]
  const lastNames = [
    "Sharma",
    "Patel",
    "Singh",
    "Desai",
    "Kapoor",
    "Gupta",
    "Kumar",
    "Reddy",
    "Mehta",
    "Joshi",
    "Verma",
    "Chopra",
  ]
  const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}${i > 10 ? (i % 3) + 1 : ""}`
  return {
    id: `USR${String(i + 1).padStart(3, "0")}`,
    name: name,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    roles: rolesSample[i % rolesSample.length],
    status: statusSample[i % statusSample.length],
    joinedDate: `2023-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  }
})

const ITEMS_PER_PAGE = 10

export function UserManagementTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(initialUsers)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof User | null>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [filterRole, setFilterRole] = useState<UserRole | "all">("all")
  const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all")

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const [currentUserForModal, setCurrentUserForModal] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: "suspend" | "activate" | "delete"
    userId: string
  } | null>(null)
  const [batchConfirmAction, setBatchConfirmAction] = useState<BatchActionType | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      const roleMatch = filterRole === "all" || user.roles.includes(filterRole)
      const statusMatch = filterStatus === "all" || user.status === filterStatus
      return searchMatch && roleMatch && statusMatch
    })
  }, [users, searchTerm, filterRole, filterStatus])

  const sortedUsers = useMemo(() => {
    if (!sortField) return filteredUsers
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (aValue === undefined || bValue === undefined) return 0

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        // For roles
        const aRoles = aValue.join(", ")
        const bRoles = bValue.join(", ")
        return sortDirection === "asc" ? aRoles.localeCompare(bRoles) : bRoles.localeCompare(aRoles)
      }
      return 0
    })
  }, [filteredUsers, sortField, sortDirection])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedUsers, currentPage])

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE)

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: keyof User) => {
    if (sortField !== field) return <ChevronDown size={16} className="opacity-20" />
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))
  }

  const handleSelectAllUsers = (checked: boolean) => {
    setSelectedUserIds(checked ? paginatedUsers.map((u) => u.id) : [])
  }

  const isAllCurrentPageSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.includes(u.id))

  // Modal Openers
  const openAddUserModal = () => setIsAddUserModalOpen(true)
  const openManageRolesModal = (user: User) => {
    setCurrentUserForModal(user)
    setIsManageRolesModalOpen(true)
  }
  const openConfirmModal = (type: "suspend" | "activate" | "delete", user: User) => {
    setCurrentUserForModal(user)
    setConfirmAction({ type, userId: user.id })
    setIsConfirmModalOpen(true)
  }

  // CRUD and action handlers
  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]) // Add to top for visibility
    setCurrentPage(1) // Go to first page to see new user
  }

  const handleUpdateUserRoles = (userId: string, updatedRoles: UserRole[]) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, roles: updatedRoles } : u)))
  }

  const executeConfirmAction = () => {
    if (!confirmAction || !currentUserForModal) return
    const { type, userId } = confirmAction

    // Simulate API
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)}ing user...` })
    setTimeout(() => {
      if (type === "delete") {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: type === "suspend" ? "Suspended" : "Active" } : u)),
        )
      }
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId))
      toast({
        title: `User ${type === "delete" ? "deleted" : type === "suspend" ? "suspended" : "activated"} successfully!`,
      })
    }, 1000)

    setIsConfirmModalOpen(false)
    setConfirmAction(null)
    setCurrentUserForModal(null)
  }

  const handleBatchAction = (action: BatchActionType) => {
    setBatchConfirmAction(action)
    setIsConfirmModalOpen(true) // Reuse confirmation modal for batch actions
  }

  const executeBatchConfirmAction = () => {
    if (!batchConfirmAction || selectedUserIds.length === 0) return

    const actionType = typeof batchConfirmAction === "string" ? batchConfirmAction : batchConfirmAction.type
    toast({ title: `Processing batch ${actionType}...` })

    setTimeout(() => {
      setUsers((prevUsers) => {
        return prevUsers
          .map((user) => {
            if (!selectedUserIds.includes(user.id)) return user

            if (typeof batchConfirmAction === "string") {
              // suspend, activate, delete
              if (batchConfirmAction === "delete") return null // Will be filtered out
              return { ...user, status: batchConfirmAction === "suspend" ? "Suspended" : "Active" }
            } else if (batchConfirmAction.type === "assignRole") {
              const newRoles = Array.from(new Set([...user.roles, batchConfirmAction.role]))
              return { ...user, roles: newRoles as UserRole[] }
            } else if (batchConfirmAction.type === "removeRole") {
              // Ensure 'User' role is not removed if it's the only role or by policy
              if (batchConfirmAction.role === "User" && user.roles.length === 1 && user.roles[0] === "User") {
                return user
              }
              const newRoles = user.roles.filter((r) => r !== batchConfirmAction.role)
              // If all roles removed, ensure 'User' role remains
              return { ...user, roles: newRoles.length > 0 ? newRoles : ["User"] }
            }
            return user
          })
          .filter((user) => user !== null) as User[]
      })

      toast({ title: `Batch ${actionType} completed successfully!` })
      setSelectedUserIds([])
    }, 1500)

    setIsConfirmModalOpen(false)
    setBatchConfirmAction(null)
  }

  const getConfirmModalProps = () => {
    if (batchConfirmAction) {
      const actionType = typeof batchConfirmAction === "string" ? batchConfirmAction : batchConfirmAction.type
      let roleInfo = ""
      if (
        typeof batchConfirmAction !== "string" &&
        (batchConfirmAction.type === "assignRole" || batchConfirmAction.type === "removeRole")
      ) {
        roleInfo = ` role "${batchConfirmAction.role}"`
      }

      return {
        title: `Confirm Batch ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}${roleInfo}`,
        description: `Are you sure you want to ${actionType}${roleInfo} for ${selectedUserIds.length} selected user(s)?`,
        confirmText: "Yes, Proceed",
        confirmButtonVariant: actionType === "delete" ? "destructive" : ("default" as any),
        onConfirm: executeBatchConfirmAction,
      }
    }
    if (confirmAction && currentUserForModal) {
      return {
        title: `Confirm ${confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)} User`,
        description: `Are you sure you want to ${confirmAction.type} ${currentUserForModal.name}? ${confirmAction.type === "delete" ? "This action cannot be undone." : ""}`,
        confirmText: `Yes, ${confirmAction.type}`,
        confirmButtonVariant: confirmAction.type === "delete" ? "destructive" : ("default" as any),
        onConfirm: executeConfirmAction,
      }
    }
    return { title: "", description: "", onConfirm: () => {} }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or ID..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={filterRole}
            onValueChange={(value: UserRole | "all") => {
              setFilterRole(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter size={14} className="mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ALL_USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(value: UserStatus | "all") => {
              setFilterStatus(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter size={14} className="mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ALL_USER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddUserModal} className="w-full sm:w-auto">
          <PlusCircle size={16} className="mr-2" /> Add User
        </Button>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllCurrentPageSelected}
                  onCheckedChange={(checked) => handleSelectAllUsers(Boolean(checked))}
                  aria-label="Select all users on current page"
                />
              </TableHead>
              <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("id")}>
                <div className="flex items-center gap-1">ID {getSortIcon("id")}</div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Name {getSortIcon("name")}</div>
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("email")}>
                <div className="flex items-center gap-1">Email {getSortIcon("email")}</div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Roles</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">Status {getSortIcon("status")}</div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  data-state={selectedUserIds.includes(user.id) ? "selected" : ""}
                  className="data-[state=selected]:bg-muted/50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, Boolean(checked))}
                      aria-label={`Select user ${user.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => {
                        let variant: "default" | "outline" | "secondary" | "destructive" = "secondary"
                        if (role === "Admin") variant = "destructive"
                        else if (role === "Moderator") variant = "default"
                        else if (role === "Verified") variant = "outline"
                        return (
                          <Badge key={role} variant={variant} className="text-xs whitespace-nowrap">
                            {role}
                          </Badge>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        user.status === "Active" &&
                          "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30",
                        user.status === "Suspended" &&
                          "bg-amber-500/20 text-amber-700 dark:text-amber-400 hover:bg-amber-500/30",
                        user.status === "Inactive" &&
                          "bg-slate-500/20 text-slate-700 dark:text-slate-400 hover:bg-slate-500/30",
                      )}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Open menu for {user.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                          <Edit size={14} className="mr-2" />
                          View/Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openManageRolesModal(user)}>
                          <Shield size={14} className="mr-2" />
                          Manage Roles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "Active" ? (
                          <DropdownMenuItem onClick={() => openConfirmModal("suspend", user)}>
                            <UserX size={14} className="mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => openConfirmModal("activate", user)}>
                            <UserCheck size={14} className="mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => openConfirmModal("delete", user)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={sortedUsers.length}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleAddUser}
      />
      <ManageRolesModal
        isOpen={isManageRolesModalOpen}
        onClose={() => setIsManageRolesModalOpen(false)}
        user={currentUserForModal}
        onRolesUpdated={handleUpdateUserRoles}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setConfirmAction(null)
          setBatchConfirmAction(null)
          setCurrentUserForModal(null)
        }}
        {...getConfirmModalProps()}
      />
      <UserBatchActionsToolbar
        selectedUserIds={selectedUserIds}
        onAction={handleBatchAction}
        onClearSelection={() => setSelectedUserIds([])}
      />
    </div>
  )
}
