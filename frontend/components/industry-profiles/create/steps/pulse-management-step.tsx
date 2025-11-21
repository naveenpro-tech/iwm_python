"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, ImageIcon, Hash, Send, Edit, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import type { ProfileFormData, ScheduledPulse } from "../../types"

interface PulseManagementStepProps {
  data: ProfileFormData
  updateData: (updates: Partial<ProfileFormData>) => void
}

export function PulseManagementStep({ data, updateData }: PulseManagementStepProps) {
  const [pulseContent, setPulseContent] = useState("")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState("")
  const [activeTab, setActiveTab] = useState("compose")

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags([...hashtags, newHashtag.trim()])
      setNewHashtag("")
    }
  }

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag))
  }

  const handleSchedulePulse = () => {
    if (pulseContent && scheduledDate) {
      const newPulse: ScheduledPulse = {
        id: `pulse-${Date.now()}`,
        content: pulseContent,
        scheduledFor: scheduledDate,
        status: "scheduled",
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      }

      updateData({
        scheduledPulses: [...(data.scheduledPulses || []), newPulse],
      })

      // Reset form
      setPulseContent("")
      setScheduledDate(undefined)
      setHashtags([])
    }
  }

  const handleSaveDraft = () => {
    if (pulseContent) {
      const newPulse: ScheduledPulse = {
        id: `pulse-${Date.now()}`,
        content: pulseContent,
        scheduledFor: new Date(),
        status: "draft",
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      }

      updateData({
        scheduledPulses: [...(data.scheduledPulses || []), newPulse],
      })

      // Reset form
      setPulseContent("")
      setScheduledDate(undefined)
      setHashtags([])
    }
  }

  const handleDeletePulse = (id: string) => {
    updateData({
      scheduledPulses: data.scheduledPulses?.filter((pulse) => pulse.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle>Siddu Pulse Management</CardTitle>
          <CardDescription>Compose and schedule official Pulses for your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#1A1A1A] border border-[#3A3A3A]">
              <TabsTrigger value="compose" className="data-[state=active]:bg-[#3A3A3A]">
                Compose
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-[#3A3A3A]">
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="drafts" className="data-[state=active]:bg-[#3A3A3A]">
                Drafts
              </TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-[#3A3A3A]">
                Published
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pulseContent">Pulse Content</Label>
                  <Textarea
                    id="pulseContent"
                    value={pulseContent}
                    onChange={(e) => setPulseContent(e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] min-h-[120px]"
                    placeholder="Share an update, announcement, or insight..."
                  />
                  <p className="text-xs text-gray-400">{pulseContent.length}/280 characters</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {hashtags.map((tag) => (
                    <div key={tag} className="bg-[#3A3A3A] text-white px-3 py-1 rounded-full flex items-center text-sm">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="flex">
                      <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-l-md px-2 flex items-center">
                        <Hash className="w-4 h-4 text-gray-400" />
                      </div>
                      <Input
                        value={newHashtag}
                        onChange={(e) => setNewHashtag(e.target.value)}
                        className="bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] rounded-l-none"
                        placeholder="Add hashtag"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleAddHashtag}
                    disabled={!newHashtag.trim()}
                    className="border-[#3A3A3A] hover:bg-[#3A3A3A]"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Media
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#3A3A3A]">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Schedule"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#282828] border-[#3A3A3A]">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                        className="bg-[#282828]"
                      />
                      <div className="p-3 border-t border-[#3A3A3A]">
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">Time selector coming soon</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={!pulseContent}
                    className="flex-1 border-[#3A3A3A] hover:bg-[#3A3A3A]"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSchedulePulse}
                    disabled={!pulseContent || !scheduledDate}
                    className="flex-1 bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                  >
                    {scheduledDate ? "Schedule" : "Post Now"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="mt-4">
              {data.scheduledPulses && data.scheduledPulses.filter((p) => p.status === "scheduled").length > 0 ? (
                <div className="space-y-4">
                  {data.scheduledPulses
                    .filter((p) => p.status === "scheduled")
                    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                    .map((pulse) => (
                      <div key={pulse.id} className="bg-[#1A1A1A] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center text-sm text-[#00BFFF] mb-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              Scheduled for {new Date(pulse.scheduledFor).toLocaleDateString()} at{" "}
                              {new Date(pulse.scheduledFor).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-8 w-8 p-0 mr-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePulse(pulse.id)}
                              className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-white">{pulse.content}</p>
                        {pulse.hashtags && pulse.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pulse.hashtags.map((tag) => (
                              <div key={tag} className="bg-[#3A3A3A] text-white px-2 py-0.5 rounded-full text-xs">
                                #{tag}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 bg-[#1A1A1A] rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p>No scheduled Pulses</p>
                  <p className="text-sm">Schedule Pulses to be published automatically</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-4">
              {data.scheduledPulses && data.scheduledPulses.filter((p) => p.status === "draft").length > 0 ? (
                <div className="space-y-4">
                  {data.scheduledPulses
                    .filter((p) => p.status === "draft")
                    .map((pulse) => (
                      <div key={pulse.id} className="bg-[#1A1A1A] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <Edit className="w-4 h-4 mr-2" />
                            <span>Draft</span>
                          </div>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-8 w-8 p-0 mr-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePulse(pulse.id)}
                              className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-white">{pulse.content}</p>
                        {pulse.hashtags && pulse.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pulse.hashtags.map((tag) => (
                              <div key={tag} className="bg-[#3A3A3A] text-white px-2 py-0.5 rounded-full text-xs">
                                #{tag}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 bg-[#1A1A1A] rounded-lg">
                  <Edit className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p>No draft Pulses</p>
                  <p className="text-sm">Save drafts to work on them later</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="published" className="mt-4">
              {data.scheduledPulses && data.scheduledPulses.filter((p) => p.status === "published").length > 0 ? (
                <div className="space-y-4">
                  {data.scheduledPulses
                    .filter((p) => p.status === "published")
                    .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())
                    .map((pulse) => (
                      <div key={pulse.id} className="bg-[#1A1A1A] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <span>Published on {new Date(pulse.scheduledFor).toLocaleDateString()}</span>
                          </div>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePulse(pulse.id)}
                              className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-white">{pulse.content}</p>
                        {pulse.hashtags && pulse.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pulse.hashtags.map((tag) => (
                              <div key={tag} className="bg-[#3A3A3A] text-white px-2 py-0.5 rounded-full text-xs">
                                #{tag}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 bg-[#1A1A1A] rounded-lg">
                  <Send className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p>No published Pulses</p>
                  <p className="text-sm">Your published Pulses will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
