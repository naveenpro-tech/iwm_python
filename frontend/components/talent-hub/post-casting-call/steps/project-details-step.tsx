"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { FormData } from "../../types"
import { cn } from "@/lib/utils"

interface ProjectDetailsStepProps {
  data: Partial<FormData>
  onUpdate: (data: Partial<FormData>) => void
}

export default function ProjectDetailsStep({ data, onUpdate }: ProjectDetailsStepProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Project Details</h2>

        {/* Project Title */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="projectTitle">Project Title *</Label>
          <Input
            id="projectTitle"
            value={data.projectTitle || ""}
            onChange={(e) => onUpdate({ projectTitle: e.target.value })}
            placeholder="Enter your project title"
            className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
          />
          <p className="text-sm text-[#A0A0A0]">{data.projectTitle?.length || 0}/100 characters</p>
        </div>

        {/* Project Type */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="projectType">Project Type *</Label>
          <Select value={data.projectType} onValueChange={(value) => onUpdate({ projectType: value as any })}>
            <SelectTrigger className="bg-[#282828] border-[#3A3A3A]">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature">Feature Film</SelectItem>
              <SelectItem value="short">Short Film</SelectItem>
              <SelectItem value="tv-series">TV Series</SelectItem>
              <SelectItem value="web-series">Web Series</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="documentary">Documentary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Production Company */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="productionCompany">Production Company *</Label>
          <Input
            id="productionCompany"
            value={data.productionCompany || ""}
            onChange={(e) => onUpdate({ productionCompany: e.target.value })}
            placeholder="Enter production company name"
            className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
          />
        </div>

        {/* Project Description */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            value={data.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Provide a brief description of your project"
            rows={4}
            className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
          />
          <p className="text-sm text-[#A0A0A0]">{data.description?.length || 0}/500 characters</p>
        </div>

        {/* Production Timeline */}
        <div className="space-y-2 mb-6">
          <Label>Production Timeline *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-[#A0A0A0]">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-[#282828] border-[#3A3A3A]",
                      !data.productionTimeline?.start && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.productionTimeline?.start ? (
                      format(data.productionTimeline.start, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data.productionTimeline?.start}
                    onSelect={(date) =>
                      onUpdate({
                        productionTimeline: {
                          ...data.productionTimeline,
                          start: date || new Date(),
                          end: data.productionTimeline?.end || new Date(),
                        },
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-sm text-[#A0A0A0]">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-[#282828] border-[#3A3A3A]",
                      !data.productionTimeline?.end && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.productionTimeline?.end ? (
                      format(data.productionTimeline.end, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data.productionTimeline?.end}
                    onSelect={(date) =>
                      onUpdate({
                        productionTimeline: {
                          ...data.productionTimeline,
                          start: data.productionTimeline?.start || new Date(),
                          end: date || new Date(),
                        },
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2 mb-6">
          <Label>Location *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="City"
              value={data.location?.city || ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, city: e.target.value } as any,
                })
              }
              className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
            <Input
              placeholder="State/Province"
              value={data.location?.state || ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, state: e.target.value } as any,
                })
              }
              className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
            <Input
              placeholder="Country"
              value={data.location?.country || ""}
              onChange={(e) =>
                onUpdate({
                  location: { ...data.location, country: e.target.value } as any,
                })
              }
              className="bg-[#282828] border-[#3A3A3A] focus:border-[#00BFFF]"
            />
          </div>
        </div>

        {/* Budget Range */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="budgetRange">Budget Range (Optional)</Label>
          <Select value={data.budgetRange} onValueChange={(value) => onUpdate({ budgetRange: value as any })}>
            <SelectTrigger className="bg-[#282828] border-[#3A3A3A]">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Budget</SelectItem>
              <SelectItem value="medium">Medium Budget</SelectItem>
              <SelectItem value="high">High Budget</SelectItem>
              <SelectItem value="undisclosed">Undisclosed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Project Visibility */}
        <div className="space-y-2">
          <Label>Project Visibility</Label>
          <RadioGroup value={data.visibility} onValueChange={(value) => onUpdate({ visibility: value as any })}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="font-normal cursor-pointer">
                Public - Visible to all users
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="font-normal cursor-pointer">
                Private - Only visible via direct link
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
