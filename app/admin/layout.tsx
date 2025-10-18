import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/navigation/admin-sidebar"
import { AdminHeader } from "@/components/admin/navigation/admin-header"
import { ThemeProvider } from "@/components/theme-provider"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
