"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Edit3, Search, AwardIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { AwardInfo } from "../types"
import { MOCK_AWARDS_POOL } from "../types" // Assuming MOCK_AWARDS_POOL is in types.ts
import { useToast } from "@/hooks/use-toast"

interface MovieAwardsFormProps {
  initialAwards: AwardInfo[]
  onAwardsChange: (awards: AwardInfo[]) => void
}

const emptyAward: Omit<AwardInfo, "id"> = {
  name: "",
  year: new Date().getFullYear(),
  category: "",
  status: "Nominee",
}

export function MovieAwardsForm({ initialAwards, onAwardsChange }: MovieAwardsFormProps) {
  const [awards, setAwards] = useState<AwardInfo[]>(
    initialAwards.map((a) => ({ ...a, id: a.id || Date.now().toString() + Math.random() })),
  )
  const [editingAward, setEditingAward] = useState<(Partial<AwardInfo> & { id?: string }) | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [awardSearch, setAwardSearch] = useState("")
  const { toast } = useToast()

  const handleInputChange = (field: keyof AwardInfo, value: any) => {
    if (editingAward) {
      setEditingAward({ ...editingAward, [field]: value })
    }
  }

  const handleAwardNameSelect = (awardName: string) => {
    const selectedMockAward = MOCK_AWARDS_POOL.find((a) => a.name === awardName)
    if (editingAward && selectedMockAward) {
      setEditingAward({
        ...editingAward,
        name: selectedMockAward.name,
        category: selectedMockAward.defaultCategory || editingAward.category || "",
      })
      setAwardSearch("") // Clear search
    }
  }

  const handleSaveAward = () => {
    if (!editingAward || !editingAward.name || !editingAward.category || !editingAward.year) {
      toast({ title: "Error", description: "Award Name, Category, and Year are required.", variant: "destructive" })
      return
    }

    const finalAward: AwardInfo = {
      id: editingAward.id || Date.now().toString(),
      name: editingAward.name!,
      year: Number(editingAward.year!),
      category: editingAward.category!,
      status: editingAward.status || "Nominee",
    }

    let newAwardsList
    if (editingAward.id && !isAdding) {
      // Editing existing
      newAwardsList = awards.map((a) => (a.id === editingAward!.id ? finalAward : a))
    } else {
      // Adding new
      newAwardsList = [...awards, finalAward]
    }
    setAwards(newAwardsList)
    onAwardsChange(newAwardsList)
    setEditingAward(null)
    setIsAdding(false)
    setAwardSearch("")
  }

  const handleDeleteAward = (id: string) => {
    const newAwardsList = awards.filter((a) => a.id !== id)
    setAwards(newAwardsList)
    onAwardsChange(newAwardsList)
  }

  const startEdit = (award: AwardInfo) => {
    setEditingAward({ ...award })
    setIsAdding(false)
    setAwardSearch(award.name)
  }

  const startAdd = () => {
    setEditingAward({ ...emptyAward, id: Date.now().toString() })
    setIsAdding(true)
    setAwardSearch("")
  }

  const filteredMockAwards = awardSearch
    ? MOCK_AWARDS_POOL.filter((a) => a.name.toLowerCase().includes(awardSearch.toLowerCase()))
    : []

  const renderAwardForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 border rounded-lg space-y-4 mb-4 bg-muted/30"
    >
      <div className="space-y-1 relative">
        <Label htmlFor="award-name">Award Name / Event</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="award-name"
            value={awardSearch}
            onChange={(e) => {
              setAwardSearch(e.target.value)
              handleInputChange("name", e.target.value) // Keep name updated for manual entry
            }}
            placeholder="Search or type award name (e.g., Academy Awards)"
            className="pl-9"
          />
        </div>
        {filteredMockAwards.length > 0 && awardSearch && (
          <ScrollArea className="absolute z-10 w-full bg-background border rounded-md shadow-lg max-h-40 mt-1">
            {filteredMockAwards.map((mockAward) => (
              <div
                key={mockAward.id}
                className="p-2 hover:bg-accent cursor-pointer text-sm"
                onClick={() => handleAwardNameSelect(mockAward.name)}
              >
                {mockAward.name}
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="award-category">Category</Label>
          <Input
            id="award-category"
            value={editingAward?.category || ""}
            onChange={(e) => handleInputChange("category", e.target.value)}
            placeholder="e.g., Best Picture"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="award-year">Year</Label>
          <Input
            id="award-year"
            type="number"
            value={editingAward?.year || ""}
            onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
            placeholder={new Date().getFullYear().toString()}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="award-status">Status</Label>
          <Select
            value={editingAward?.status}
            onValueChange={(val: "Winner" | "Nominee") => handleInputChange("status", val)}
          >
            <SelectTrigger id="award-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Winner">Winner</SelectItem>
              <SelectItem value="Nominee">Nominee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditingAward(null)
            setIsAdding(false)
            setAwardSearch("")
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveAward}>Save Award</Button>
      </div>
    </motion.div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Awards & Nominations</CardTitle>
        <CardDescription>Manage awards and nominations received by the movie.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {(isAdding || editingAward) && !isAdding && editingAward && renderAwardForm()}
          </AnimatePresence>

          {awards.map((award) => (
            <motion.div
              key={award.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 border rounded-md bg-card flex items-center justify-between gap-2"
            >
              {editingAward?.id === award.id && !isAdding ? (
                renderAwardForm()
              ) : (
                <>
                  <div className="flex-grow flex items-center gap-3">
                    <AwardIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">{award.name}</span> ({award.year})
                      <p className="text-xs text-muted-foreground">
                        {award.category} -{" "}
                        <span className={award.status === "Winner" ? "text-green-500 font-medium" : ""}>
                          {award.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(award)}>
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAward(award.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          <AnimatePresence>{isAdding && editingAward && renderAwardForm()}</AnimatePresence>
        </div>

        {!editingAward && !isAdding && (
          <Button variant="outline" onClick={startAdd} className="mt-4 w-full gap-2">
            <Plus size={16} /> Add Award/Nomination
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
