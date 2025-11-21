"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Reorder, motion } from "framer-motion"
import { GripVertical, Eye, EyeOff, Save } from "lucide-react"

interface HomepageSection {
  id: string
  title: string
  description: string
  enabled: boolean
  order: number
  type: string
  settings: {
    itemCount?: number
    displayStyle?: string
  }
}

export function HomepageSectionManager() {
  const [sections, setSections] = useState<HomepageSection[]>([
    {
      id: "1",
      title: "Siddu's Picks",
      description: "Featured movies handpicked by our curators",
      enabled: true,
      order: 1,
      type: "featured",
      settings: { itemCount: 3, displayStyle: "cards" },
    },
    {
      id: "2",
      title: "Trending Pulses",
      description: "Most popular discussions and reviews",
      enabled: true,
      order: 2,
      type: "pulses",
      settings: { itemCount: 6, displayStyle: "carousel" },
    },
    {
      id: "3",
      title: "New Releases",
      description: "Latest movies added to the platform",
      enabled: true,
      order: 3,
      type: "new-releases",
      settings: { itemCount: 12, displayStyle: "carousel" },
    },
    {
      id: "4",
      title: "Global Masterpieces",
      description: "Acclaimed films from around the world",
      enabled: true,
      order: 4,
      type: "masterpieces",
      settings: { itemCount: 10, displayStyle: "carousel" },
    },
  ])

  const [hasChanges, setHasChanges] = useState(false)

  const toggleSection = (id: string) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section)))
    setHasChanges(true)
  }

  const updateSectionSettings = (id: string, settings: any) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, settings: { ...section.settings, ...settings } } : section,
      ),
    )
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Homepage Sections</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Drag to reorder, toggle to enable/disable sections</p>
          </div>
          <Button disabled={!hasChanges} className="gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        </CardHeader>
        <CardContent>
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={(newOrder) => {
              setSections(newOrder)
              setHasChanges(true)
            }}
            className="space-y-3"
          >
            {sections.map((section) => (
              <Reorder.Item key={section.id} value={section} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="text-muted-foreground cursor-grab mt-1" size={20} />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {section.title}
                          {section.enabled ? (
                            <Eye size={16} className="text-green-500" />
                          ) : (
                            <EyeOff size={16} className="text-muted-foreground" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} />
                    </div>

                    {section.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t"
                      >
                        <div className="space-y-2">
                          <Label>Number of Items</Label>
                          <Input
                            type="number"
                            value={section.settings.itemCount}
                            onChange={(e) =>
                              updateSectionSettings(section.id, {
                                itemCount: Number.parseInt(e.target.value),
                              })
                            }
                            min={1}
                            max={20}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Display Style</Label>
                          <Select
                            value={section.settings.displayStyle}
                            onValueChange={(value) => updateSectionSettings(section.id, { displayStyle: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cards">Cards</SelectItem>
                              <SelectItem value="carousel">Carousel</SelectItem>
                              <SelectItem value="grid">Grid</SelectItem>
                              <SelectItem value="list">List</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Homepage preview will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
