"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, LayoutDashboard, Bell, Heart, ListChecks } from "lucide-react"

// Mock user data - replace with actual auth state
const mockUser = {
  name: "Siddharth",
  email: "siddharth@example.com",
  avatarUrl: "/placeholder.svg?width=40&height=40&text=S", // Replace with actual avatar
  isLoggedIn: true, // Simulate logged-in state
}

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const user = mockUser // In a real app, get this from context or auth hook

  if (!user.isLoggedIn) {
    return (
      <Link href="/login" passHref legacyBehavior>
        <Button variant="outline" className="text-sm border-primary text-primary hover:bg-primary/10">
          Login
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="focus:outline-none rounded-full"
          aria-label="User profile"
        >
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#282828] border-[#3A3A3A] text-white" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#3A3A3A]" />
        <Link href="/profile" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href="/watchlist" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]">
            <ListChecks className="mr-2 h-4 w-4" />
            Watchlist
          </DropdownMenuItem>
        </Link>
        <Link href="/favorites" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]">
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </DropdownMenuItem>
        </Link>
        <Link href="/notifications" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="bg-[#3A3A3A]" />
        <Link href="/admin" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href="/settings" passHref legacyBehavior>
          <DropdownMenuItem className="cursor-pointer hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="bg-[#3A3A3A]" />
        <DropdownMenuItem
          onClick={() => console.log("Logout")} // Replace with actual logout logic
          className="cursor-pointer text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-300 hover:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
