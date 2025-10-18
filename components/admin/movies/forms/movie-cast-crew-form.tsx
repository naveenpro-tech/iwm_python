"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, GripVertical, X, Search } from "lucide-react"
import { motion, Reorder } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { CastMember, CrewMember } from "../types"
import { MOCK_TALENT_POOL } from "../types"

interface MovieCastCrewFormProps {
  initialCast: CastMember[]
  initialCrew: CrewMember[]
  onCastChange: (newCast: CastMember[]) => void
  onCrewChange: (newCrew: CrewMember[]) => void
  onChanges: () => void
}

interface Talent {
  id: string
  name: string
  image?: string
}

export function MovieCastCrewForm({
  initialCast,
  initialCrew,
  onCastChange,
  onCrewChange,
  onChanges,
}: MovieCastCrewFormProps) {
  const [cast, setCast] = useState<CastMember[]>(initialCast)
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew)

  useEffect(() => {
    setCast(initialCast)
  }, [initialCast])

  useEffect(() => {
    setCrew(initialCrew)
  }, [initialCrew])

  const [showAddCast, setShowAddCast] = useState(false)
  const [showAddCrew, setShowAddCrew] = useState(false)

  const [newCastMemberName, setNewCastMemberName] = useState("")
  const [newCastMemberCharacter, setNewCastMemberCharacter] = useState("")
  const [newCastMemberImage, setNewCastMemberImage] = useState<string | undefined>(undefined)
  const [newCrewMemberName, setNewCrewMemberName] = useState("")
  const [newCrewMemberRole, setNewCrewMemberRole] = useState("")
  const [newCrewMemberDepartment, setNewCrewMemberDepartment] = useState("")
  const [newCrewMemberImage, setNewCrewMemberImage] = useState<string | undefined>(undefined)

  const [talentSearchResultsCast, setTalentSearchResultsCast] = useState<Talent[]>([])
  const [talentSearchResultsCrew, setTalentSearchResultsCrew] = useState<Talent[]>([])

  const handleCastSearch = (query: string) => {
    if (query) {
      const results = MOCK_TALENT_POOL.filter((talent) => talent.name.toLowerCase().includes(query.toLowerCase()))
      setTalentSearchResultsCast(results)
    } else {
      setTalentSearchResultsCast([])
    }
  }

  const handleCrewSearch = (query: string) => {
    if (query) {
      const results = MOCK_TALENT_POOL.filter((talent) => talent.name.toLowerCase().includes(query.toLowerCase()))
      setTalentSearchResultsCrew(results)
    } else {
      setTalentSearchResultsCrew([])
    }
  }

  const selectCastTalent = (talent: Talent) => {
    setNewCastMemberName(talent.name)
    setNewCastMemberImage(talent.image)
    setTalentSearchResultsCast([])
  }

  const selectCrewTalent = (talent: Talent) => {
    setNewCrewMemberName(talent.name)
    setNewCrewMemberImage(talent.image)
    setTalentSearchResultsCrew([])
  }

  const removeCastMember = (id: string) => {
    const updatedCast = cast.filter((member) => member.id !== id)
    setCast(updatedCast)
    onCastChange(updatedCast)
    onChanges()
  }

  const removeCrewMember = (id: string) => {
    const updatedCrew = crew.filter((member) => member.id !== id)
    setCrew(updatedCrew)
    onCrewChange(updatedCrew)
    onChanges()
  }

  const addCastMember = () => {
    const newMember: CastMember = {
      id: Math.random().toString(36).substring(7),
      name: newCastMemberName,
      character: newCastMemberCharacter,
      image: newCastMemberImage || "/placeholder.svg",
      order: cast.length + 1,
    }
    const updatedCast = [...cast, newMember]
    setCast(updatedCast)
    onCastChange(updatedCast)
    setNewCastMemberName("")
    setNewCastMemberCharacter("")
    setNewCastMemberImage(undefined)
    setShowAddCast(false)
    onChanges()
  }

  const addCrewMember = () => {
    const newMember: CrewMember = {
      id: Math.random().toString(36).substring(7),
      name: newCrewMemberName,
      role: newCrewMemberRole,
      department: newCrewMemberDepartment,
      image: newCrewMemberImage || "/placeholder.svg",
    }
    const updatedCrew = [...crew, newMember]
    setCrew(updatedCrew)
    onCrewChange(updatedCrew)
    setNewCrewMemberName("")
    setNewCrewMemberRole("")
    setNewCrewMemberDepartment("")
    setNewCrewMemberImage(undefined)
    setShowAddCrew(false)
    onChanges()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cast</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddCast(!showAddCast)}>
            <Plus size={16} className="mr-1" />
            Add Cast Member
          </Button>
        </CardHeader>
        <CardContent>
          {showAddCast && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-4 border rounded-lg space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Actor Name</Label>
                  <Popover>
                    <PopoverTrigger className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <Input
                        placeholder="Search for actor..."
                        className="pl-9"
                        value={newCastMemberName}
                        onChange={(e) => {
                          setNewCastMemberName(e.target.value)
                          handleCastSearch(e.target.value)
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search talent..." />
                        <CommandList>
                          <CommandEmpty>No talent found.</CommandEmpty>
                          <CommandGroup>
                            {talentSearchResultsCast.map((talent) => (
                              <CommandItem key={talent.id} onSelect={() => selectCastTalent(talent)}>
                                {talent.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Character Name</Label>
                  <Input
                    placeholder="Character name"
                    value={newCastMemberCharacter}
                    onChange={(e) => setNewCastMemberCharacter(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddCast(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    addCastMember()
                  }}
                >
                  Add to Cast
                </Button>
              </div>
            </motion.div>
          )}

          <Reorder.Group
            axis="y"
            values={cast}
            onReorder={(newOrder) => {
              setCast(newOrder)
              onCastChange(newOrder)
              onChanges()
            }}
            className="space-y-2"
          >
            {cast.map((member) => (
              <Reorder.Item
                key={member.id}
                value={member}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
              >
                <GripVertical className="text-muted-foreground cursor-grab" size={20} />
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">as {member.character}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeCastMember(member.id)}
                >
                  <X size={16} />
                </Button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crew</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddCrew(!showAddCrew)}>
            <Plus size={16} className="mr-1" />
            Add Crew Member
          </Button>
        </CardHeader>
        <CardContent>
          {showAddCrew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-4 border rounded-lg space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Popover>
                    <PopoverTrigger className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <Input
                        placeholder="Search for person..."
                        className="pl-9"
                        value={newCrewMemberName}
                        onChange={(e) => {
                          setNewCrewMemberName(e.target.value)
                          handleCrewSearch(e.target.value)
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search talent..." />
                        <CommandList>
                          <CommandEmpty>No talent found.</CommandEmpty>
                          <CommandGroup>
                            {talentSearchResultsCrew.map((talent) => (
                              <CommandItem key={talent.id} onSelect={() => selectCrewTalent(talent)}>
                                {talent.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    placeholder="e.g., Director, Producer"
                    value={newCrewMemberRole}
                    onChange={(e) => setNewCrewMemberRole(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={newCrewMemberDepartment} onValueChange={(value) => setNewCrewMemberDepartment(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="directing">Directing</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="cinematography">Cinematography</SelectItem>
                      <SelectItem value="editing">Editing</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="sound">Sound</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="costume">Costume & Make-Up</SelectItem>
                      <SelectItem value="visual-effects">Visual Effects</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddCrew(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    addCrewMember()
                  }}
                >
                  Add to Crew
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            {crew.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role} • {member.department}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeCrewMember(member.id)}
                >
                  <X size={16} />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
