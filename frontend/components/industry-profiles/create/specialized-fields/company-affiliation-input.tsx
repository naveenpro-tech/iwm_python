"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Plus, X, Calendar, MapPin, Link2, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Company {
  id: string
  name: string
  role: string
  location?: string
  website?: string
  startDate?: string
  endDate?: string
  current: boolean
  verified: boolean
}

interface CompanyAffiliationInputProps {
  onAdd: (company: Company) => void
  onRemove: (id: string) => void
  onEdit: (company: Company) => void
  initialCompanies?: Company[]
}

// Mock verified companies for auto-suggest
const verifiedCompanies = [
  { id: "c1", name: "Warner Bros. Pictures", verified: true },
  { id: "c2", name: "Universal Pictures", verified: true },
  { id: "c3", name: "Paramount Pictures", verified: true },
  { id: "c4", name: "Walt Disney Studios", verified: true },
  { id: "c5", name: "Sony Pictures Entertainment", verified: true },
  { id: "c6", name: "Lionsgate Films", verified: true },
  { id: "c7", name: "A24", verified: true },
  { id: "c8", name: "Netflix Studios", verified: true },
  { id: "c9", name: "Amazon Studios", verified: true },
  { id: "c10", name: "Apple Studios", verified: true },
  { id: "c11", name: "Syncopy Films", verified: true },
  { id: "c12", name: "Amblin Entertainment", verified: true },
  { id: "c13", name: "Legendary Pictures", verified: true },
  { id: "c14", name: "Blumhouse Productions", verified: true },
  { id: "c15", name: "New Line Cinema", verified: true },
]

export default function CompanyAffiliationInput({
  onAdd,
  onRemove,
  onEdit,
  initialCompanies = [],
}: CompanyAffiliationInputProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [suggestions, setSuggestions] = useState<typeof verifiedCompanies>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [formData, setFormData] = useState<Omit<Company, "id">>({
    name: "",
    role: "",
    location: "",
    website: "",
    startDate: "",
    endDate: "",
    current: false,
    verified: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Handle company name suggestions
    if (name === "name" && value.length > 1) {
      const filtered = verifiedCompanies.filter((company) => company.name.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else if (name === "name") {
      setShowSuggestions(false)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, current: checked }))
  }

  const handleSelectSuggestion = (company: (typeof verifiedCompanies)[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: company.name,
      verified: company.verified,
    }))
    setShowSuggestions(false)
  }

  const handleAddCompany = () => {
    setIsDialogOpen(true)
    setEditingCompany(null)
    setFormData({
      name: "",
      role: "",
      location: "",
      website: "",
      startDate: "",
      endDate: "",
      current: false,
      verified: false,
    })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleEditCompany = (company: Company) => {
    setIsDialogOpen(true)
    setEditingCompany(company)
    setFormData({
      name: company.name,
      role: company.role,
      location: company.location || "",
      website: company.website || "",
      startDate: company.startDate || "",
      endDate: company.endDate || "",
      current: company.current,
      verified: company.verified,
    })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.role) return

    if (editingCompany) {
      const updatedCompany = {
        ...editingCompany,
        ...formData,
      }
      setCompanies((prev) => prev.map((company) => (company.id === editingCompany.id ? updatedCompany : company)))
      onEdit(updatedCompany)
    } else {
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        ...formData,
        // Check if it's a verified company from our list
        verified: formData.verified || verifiedCompanies.some((c) => c.name === formData.name),
      }
      setCompanies((prev) => [...prev, newCompany])
      onAdd(newCompany)
    }

    setIsDialogOpen(false)
  }

  const handleRemoveCompany = (id: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id))
    onRemove(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Company Affiliations</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCompany}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <AnimatePresence>
        {companies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center text-center"
          >
            <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No company affiliations added yet. Add your current and past companies.
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {companies.map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-muted rounded-lg p-4 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{company.name}</h4>
                      {company.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{company.role}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {company.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{company.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {company.startDate || "Start date"} -{" "}
                          {company.current ? "Present" : company.endDate || "End date"}
                        </span>
                      </div>

                      {company.website && (
                        <div className="flex items-center gap-1 text-xs text-primary sm:col-span-2">
                          <Link2 className="h-3 w-3" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                          >
                            {company.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditCompany(company)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pencil"
                      >
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveCompany(company.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company Affiliation" : "Add Company Affiliation"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Warner Bros. Pictures"
                    required
                    className={showSuggestions ? "rounded-b-none" : ""}
                  />
                  {showSuggestions && (
                    <div className="absolute z-10 w-full bg-popover border border-t-0 border-border rounded-b-md max-h-[200px] overflow-y-auto">
                      {suggestions.map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                          onClick={() => handleSelectSuggestion(company)}
                        >
                          <div className="flex items-center">
                            <span>{company.name}</span>
                            {company.verified && <CheckCircle className="h-3 w-3 text-green-500 ml-2" />}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role *</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Director of Photography"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="current" checked={formData.current} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="current" className="text-sm font-normal">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Los Angeles, CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="e.g. https://www.warnerbros.com"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={!formData.name || !formData.role}>
              {editingCompany ? "Save Changes" : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
