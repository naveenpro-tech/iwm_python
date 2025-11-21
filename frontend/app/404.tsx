"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <svg
              width="180"
              height="180"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto text-[#00BFFF]"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 8L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Page Not Found</h2>

          <p className="text-[#E0E0E0] max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white px-6">Back to Home</Button>
            </Link>

            <Link href="/search">
              <Button variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333] px-6">
                <Search className="mr-2" size={16} />
                Search
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
