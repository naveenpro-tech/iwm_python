'use client'

/**
 * Quick Navigation Component
 * Navigation links with badge counts
 */

import { Home, Bell, MessageCircle, Bookmark, User, Settings } from 'lucide-react'

interface QuickNavigationProps {
  notificationCount: number
  messageCount: number
}

export default function QuickNavigation({
  notificationCount,
  messageCount,
}: QuickNavigationProps) {
  const navItems = [
    { icon: Home, label: 'Home', badge: 0, href: '/pulse' },
    { icon: Bell, label: 'Notifications', badge: notificationCount, href: '/notifications' },
    { icon: MessageCircle, label: 'Messages', badge: messageCount, href: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', badge: 0, href: '/bookmarks' },
    { icon: User, label: 'Profile', badge: 0, href: '/profile' },
    { icon: Settings, label: 'Settings', badge: 0, href: '/settings' },
  ]

  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-2">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#3A3A3A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-[#A0A0A0] group-hover:text-[#00BFFF] transition-colors" />
              <span className="text-[#E0E0E0] font-medium">{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="px-2 py-0.5 bg-[#00BFFF] text-white text-xs font-bold rounded-full">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
    </div>
  )
}

