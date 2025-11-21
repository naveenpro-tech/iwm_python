"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimePickerDemoProps {
  value?: string
  onChange?: (time: string) => void
}

export function TimePickerDemo({ value = "12:00", onChange }: TimePickerDemoProps) {
  const [time, setTime] = React.useState(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value)
    onChange?.(event.target.value)
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="grid gap-1.5">
        <Label htmlFor="time">Time</Label>
        <div className="flex items-center gap-2">
          <Input id="time" type="time" value={time} onChange={handleChange} className="bg-[#333333] border-gray-700" />
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
