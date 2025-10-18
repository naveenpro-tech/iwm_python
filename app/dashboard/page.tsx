"use client"

import { useEffect, useState } from "react"
import { me } from "@/lib/auth"

export default function DashboardPage() {
  const [greeting, setGreeting] = useState<string>("Loading...")
  useEffect(() => {
    ;(async () => {
      try {
        const u = await me()
        setGreeting(`Welcome, ${u.name || u.email}`)
      } catch {
        window.location.href = "/login"
      }
    })()
  }, [])
  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold">{greeting}</h1>
    </main>
  )
}

