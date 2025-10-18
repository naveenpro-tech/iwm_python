"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { RefreshCw, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload()
  }

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
              className="mx-auto text-[#FF9933]"
            >
              <path d="M12 9V12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 16.5V16.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M12.7299 4.20215L21.0399 18.3321C21.3699 18.9521 21.0299 19.7021 20.3599 19.7021H3.63992C2.96992 19.7021 2.62992 18.9521 2.95992 18.3321L11.2699 4.20215C11.5999 3.58215 12.3999 3.58215 12.7299 4.20215Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">500</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Server Error</h2>

          <p className="text-[#E0E0E0] max-w-md mx-auto mb-8">
            Something went wrong on our end. We're working to fix the issue. Please try again in a few moments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleRefresh} className="bg-[#00BFFF] hover:bg-[#00A0E0] text-white px-6">
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </Button>

            <Link href="/help">
              <Button variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333] px-6">
                <MessageCircle className="mr-2" size={16} />
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
