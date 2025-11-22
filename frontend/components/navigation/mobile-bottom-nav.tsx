"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, User, Film } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
    const pathname = usePathname()

    const navItems = [
        { href: "/movies", icon: Home, label: "Home" },
        { href: "/explore", icon: Search, label: "Explore" },
        { href: "/pulse", icon: Film, label: "Pulse" },
        { href: "/watchlist", icon: Heart, label: "Watchlist" },
        { href: "/profile", icon: User, label: "Profile" },
    ]

    // Hide on login/signup pages
    if (pathname === "/login" || pathname === "/signup") return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glassmorphic Container */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-t border-white/10" />

            <nav className="relative flex justify-around items-center h-16 px-2 pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link key={item.href} href={item.href} className="relative group w-full">
                            <div className="flex flex-col items-center justify-center py-1">
                                <div className="relative p-1.5">
                                    <Icon
                                        className={cn(
                                            "w-6 h-6 transition-all duration-300",
                                            isActive ? "text-[#00BFFF]" : "text-gray-400 group-hover:text-gray-200"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />

                                    {/* Glow Effect for Active State */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottom-nav-glow"
                                            className="absolute inset-0 bg-[#00BFFF]/20 blur-md rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </div>

                                <span className={cn(
                                    "text-[10px] font-medium mt-0.5 transition-colors duration-300",
                                    isActive ? "text-[#00BFFF]" : "text-gray-500"
                                )}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
