import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { RoleProvider } from "@/context/RoleContext"
// import { MotionLazyContainer } from "@/components/animate/motion-lazy-container" // Optional

// PWA components - keep commented if not fully implemented or causing issues
// import { InstallPrompt } from "@/components/pwa/install-prompt"
// import { OfflineBanner } from "@/components/pwa/offline-banner"
// import { UpdateNotification } from "@/components/pwa/update-notification"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Siddu Global Entertainment Hub",
  description:
    "The definitive digital destination for cinematic masterpieces, visual treats, and real-time cricket updates.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A", // Matches dark theme background
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} font-sans`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RoleProvider>
            {/* <MotionLazyContainer> */}
            <TopNavigation />
            {/* Adjust pt-16 if TopNavigation height changes from 4rem/64px */}
            {/* Adjust pb-16 if BottomNavigation height changes from 4rem/64px or if it's not mobile-only */}
            <main className="pt-16 pb-16 md:pb-4 bg-background text-foreground min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)]">
              {/* md:pb-4 is a small padding for desktop if bottom nav is mobile only */}
              {children}
            </main>
            <BottomNavigation />
            <Toaster />
            {/* <InstallPrompt /> */}
            {/* <OfflineBanner /> */}
            {/* <UpdateNotification /> */}
            {/* </MotionLazyContainer> */}
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
