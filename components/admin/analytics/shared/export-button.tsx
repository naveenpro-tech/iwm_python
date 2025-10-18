"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface ExportButtonProps {
  data: any[]
  filename: string
}

export default function ExportButton({ data, filename }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      // Convert data to CSV format
      const headers = Object.keys(data[0]).join(",")
      const rows = data.map((row) => Object.values(row).join(","))
      const csv = [headers, ...rows].join("\n")

      // In a real implementation, this would create a file for download
      // For now, we'll just show a success message
      toast({
        title: "Export successful",
        description: `${filename} has been downloaded.`,
      })

      setIsExporting(false)
    }, 1000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
      <Download className={`h-4 w-4 mr-2 ${isExporting ? "animate-bounce" : ""}`} />
      <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export CSV"}</span>
    </Button>
  )
}
