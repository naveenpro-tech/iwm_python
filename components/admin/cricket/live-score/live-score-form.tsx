"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Check, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LiveScoreFormProps {
  matchId: string
}

export function LiveScoreForm({ matchId }: LiveScoreFormProps) {
  const [activeTab, setActiveTab] = useState("score")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  // In a real implementation, this would fetch match data from an API
  const match = {
    id: matchId,
    teams: {
      home: { id: "csk", name: "Chennai Super Kings", score: "145/6", overs: "18.2" },
      away: { id: "mi", name: "Mumbai Indians", score: "0/0", overs: "0.0" },
    },
    batsmen: [
      { id: "player1", name: "MS Dhoni", runs: 28, balls: 15, fours: 2, sixes: 2, strikeRate: 186.67 },
      { id: "player2", name: "Ravindra Jadeja", runs: 16, balls: 8, fours: 1, sixes: 1, strikeRate: 200.0 },
    ],
    bowlers: [{ id: "player3", name: "Jasprit Bumrah", overs: "3.2", maidens: 0, runs: 24, wickets: 2, economy: 7.2 }],
    commentary: [
      "18.2: Bumrah to Jadeja, 1 run, played to mid-wicket",
      "18.1: Bumrah to Dhoni, SIX! Massive hit over long-on!",
    ],
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success")
      setIsSaving(false)

      // Reset after some time
      setTimeout(() => {
        setSaveStatus("idle")
      }, 3000)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Live Score</CardTitle>
        <CardDescription>Make real-time updates to the match data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="score" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="score">Score</TabsTrigger>
            <TabsTrigger value="batsmen">Batsmen</TabsTrigger>
            <TabsTrigger value="bowlers">Bowlers</TabsTrigger>
            <TabsTrigger value="commentary">Commentary</TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">{match.teams.home.name}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="home-score">Score</Label>
                    <Input id="home-score" defaultValue={match.teams.home.score} placeholder="e.g., 145/6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="home-overs">Overs</Label>
                    <Input id="home-overs" defaultValue={match.teams.home.overs} placeholder="e.g., 18.2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="home-status">Innings Status</Label>
                  <Select defaultValue="batting">
                    <SelectTrigger id="home-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batting">Batting</SelectItem>
                      <SelectItem value="completed">Innings Completed</SelectItem>
                      <SelectItem value="yet-to-bat">Yet to Bat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{match.teams.away.name}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="away-score">Score</Label>
                    <Input id="away-score" defaultValue={match.teams.away.score} placeholder="e.g., 0/0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="away-overs">Overs</Label>
                    <Input id="away-overs" defaultValue={match.teams.away.overs} placeholder="e.g., 0.0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="away-status">Innings Status</Label>
                  <Select defaultValue="yet-to-bat">
                    <SelectTrigger id="away-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batting">Batting</SelectItem>
                      <SelectItem value="completed">Innings Completed</SelectItem>
                      <SelectItem value="yet-to-bat">Yet to Bat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="match-status">Match Status</Label>
              <Select defaultValue="live">
                <SelectTrigger id="match-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="innings-break">Innings Break</SelectItem>
                  <SelectItem value="rain-delay">Rain Delay</SelectItem>
                  <SelectItem value="tea-break">Tea Break</SelectItem>
                  <SelectItem value="lunch-break">Lunch Break</SelectItem>
                  <SelectItem value="stumps">Stumps</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="batsmen" className="space-y-4 py-4">
            <div className="space-y-6">
              {match.batsmen.map((batsman, index) => (
                <div key={batsman.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{batsman.name}</h3>
                    <Select defaultValue={index === 0 ? "striker" : "non-striker"}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="striker">Striker</SelectItem>
                        <SelectItem value="non-striker">Non-striker</SelectItem>
                        <SelectItem value="out">Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${batsman.id}-runs`}>Runs</Label>
                      <Input id={`${batsman.id}-runs`} defaultValue={batsman.runs.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${batsman.id}-balls`}>Balls</Label>
                      <Input id={`${batsman.id}-balls`} defaultValue={batsman.balls.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${batsman.id}-fours`}>4s</Label>
                      <Input id={`${batsman.id}-fours`} defaultValue={batsman.fours.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${batsman.id}-sixes`}>6s</Label>
                      <Input id={`${batsman.id}-sixes`} defaultValue={batsman.sixes.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${batsman.id}-sr`}>S/R</Label>
                      <Input id={`${batsman.id}-sr`} defaultValue={batsman.strikeRate.toString()} disabled />
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="space-y-2">
                      <Label htmlFor={`${batsman.id}-dismissal`}>Dismissal</Label>
                      <Select defaultValue="not-out">
                        <SelectTrigger id={`${batsman.id}-dismissal`}>
                          <SelectValue placeholder="Select dismissal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-out">Not Out</SelectItem>
                          <SelectItem value="bowled">Bowled</SelectItem>
                          <SelectItem value="caught">Caught</SelectItem>
                          <SelectItem value="lbw">LBW</SelectItem>
                          <SelectItem value="run-out">Run Out</SelectItem>
                          <SelectItem value="stumped">Stumped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Add New Batsman
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bowlers" className="space-y-4 py-4">
            <div className="space-y-6">
              {match.bowlers.map((bowler) => (
                <div key={bowler.id} className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{bowler.name}</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${bowler.id}-overs`}>Overs</Label>
                      <Input id={`${bowler.id}-overs`} defaultValue={bowler.overs} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${bowler.id}-maidens`}>Maidens</Label>
                      <Input id={`${bowler.id}-maidens`} defaultValue={bowler.maidens.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${bowler.id}-runs`}>Runs</Label>
                      <Input id={`${bowler.id}-runs`} defaultValue={bowler.runs.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${bowler.id}-wickets`}>Wickets</Label>
                      <Input id={`${bowler.id}-wickets`} defaultValue={bowler.wickets.toString()} type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${bowler.id}-economy`}>Economy</Label>
                      <Input id={`${bowler.id}-economy`} defaultValue={bowler.economy.toString()} disabled />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Add New Bowler
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="commentary" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-commentary">Add Commentary</Label>
                <Textarea
                  id="new-commentary"
                  placeholder="Enter ball-by-ball commentary..."
                  className="min-h-[100px]"
                />
              </div>

              <Button variant="secondary" className="w-full">
                Add Commentary
              </Button>

              <div className="space-y-2">
                <Label>Recent Commentary</Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                  {match.commentary.map((comment, index) => (
                    <div key={index} className="p-2 bg-secondary rounded-md text-sm">
                      {comment}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {saveStatus === "success" && (
          <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 mt-4">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Live score updated successfully!</AlertDescription>
          </Alert>
        )}

        {saveStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to update live score. Please try again.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
          {isSaving ? (
            <>
              <motion.div
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
