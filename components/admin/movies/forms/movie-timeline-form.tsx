"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Edit3, CalendarDays } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { TimelineEvent, TimelineEventCategory } from "../types"
import { MOCK_TIMELINE_EVENT_CATEGORIES } from "../types"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface MovieTimelineFormProps {
  initialEvents: TimelineEvent[]
  onEventsChange: (events: TimelineEvent[]) => void
}

const emptyTimelineEvent: Omit<TimelineEvent, "id"> = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  category: MOCK_TIMELINE_EVENT_CATEGORIES[0] || "Production Start",
  mediaUrl: "",
}

export function MovieTimelineForm({ initialEvents, onEventsChange }: MovieTimelineFormProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    initialEvents.map((event) => ({ ...event, id: event.id || Date.now().toString() + Math.random() })),
  )
  const [editingEvent, setEditingEvent] = useState<(Partial<TimelineEvent> & { id?: string }) | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof TimelineEvent, value: any) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [field]: value })
    }
  }

  const handleSaveEvent = () => {
    if (!editingEvent || !editingEvent.title || !editingEvent.date || !editingEvent.category) {
      toast({ title: "Error", description: "Title, Date, and Category are required.", variant: "destructive" })
      return
    }

    const finalEvent: TimelineEvent = {
      id: editingEvent.id || Date.now().toString(),
      title: editingEvent.title!,
      description: editingEvent.description || "",
      date: editingEvent.date!,
      category: editingEvent.category as TimelineEventCategory,
      mediaUrl: editingEvent.mediaUrl || "",
    }

    let newEventsList
    if (editingEvent.id && !isAdding) {
      newEventsList = events.map((event) => (event.id === editingEvent!.id ? finalEvent : event))
    } else {
      newEventsList = [...events, finalEvent]
    }
    setEvents(newEventsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())) // Sort by date desc
    onEventsChange(newEventsList)
    setEditingEvent(null)
    setIsAdding(false)
  }

  const handleDeleteEvent = (id: string) => {
    const newEventsList = events.filter((event) => event.id !== id)
    setEvents(newEventsList)
    onEventsChange(newEventsList)
  }

  const startEdit = (event: TimelineEvent) => {
    setEditingEvent({ ...event })
    setIsAdding(false)
  }

  const startAdd = () => {
    setEditingEvent({ ...emptyTimelineEvent, id: `new-${Date.now()}` })
    setIsAdding(true)
  }

  const renderEventForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 border rounded-lg space-y-4 mb-4 bg-muted/30"
    >
      <div className="space-y-1">
        <Label htmlFor="event-title">Event Title</Label>
        <Input
          id="event-title"
          value={editingEvent?.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="e.g., World Premiere in London"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          value={editingEvent?.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Details about the event."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="event-date">Date</Label>
          <Input
            id="event-date"
            type="date"
            value={editingEvent?.date || ""}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="event-category">Category</Label>
          <Select
            value={editingEvent?.category}
            onValueChange={(val: TimelineEventCategory) => handleInputChange("category", val)}
          >
            <SelectTrigger id="event-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TIMELINE_EVENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="event-mediaUrl">Media URL (Optional)</Label>
          <Input
            id="event-mediaUrl"
            value={editingEvent?.mediaUrl || ""}
            onChange={(e) => handleInputChange("mediaUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      {editingEvent?.mediaUrl && (
        <div className="mt-2">
          <Label>Media Preview</Label>
          <div className="relative w-full h-32 bg-muted rounded overflow-hidden mt-1">
            <Image
              src={editingEvent.mediaUrl || "/placeholder.svg"}
              alt="Media preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditingEvent(null)
            setIsAdding(false)
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveEvent}>Save Event</Button>
      </div>
    </motion.div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movie Timeline</CardTitle>
        <CardDescription>Manage key events in the movie's history (production, release, awards, etc.).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {(isAdding || editingEvent) && !isAdding && editingEvent && renderEventForm()}
          </AnimatePresence>

          {events.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 border rounded-md bg-card flex items-start justify-between gap-3"
            >
              {editingEvent?.id === event.id && !isAdding ? (
                renderEventForm()
              ) : (
                <>
                  <div className="flex-grow flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">{event.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Category: {event.category}</p>
                      {event.description && <p className="text-sm mt-1">{event.description}</p>}
                      {event.mediaUrl && (
                        <div className="relative w-24 h-16 bg-muted rounded overflow-hidden mt-1.5">
                          <Image
                            src={event.mediaUrl || "/placeholder.svg"}
                            alt="Event media"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(event)}>
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          <AnimatePresence>{isAdding && editingEvent && renderEventForm()}</AnimatePresence>
        </div>

        {!editingEvent && !isAdding && (
          <Button variant="outline" onClick={startAdd} className="mt-4 w-full gap-2">
            <Plus size={16} /> Add Timeline Event
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
