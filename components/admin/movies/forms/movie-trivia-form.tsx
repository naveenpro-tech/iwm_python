"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Edit3, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { TriviaItem, TriviaCategory } from "../types"
import { MOCK_TRIVIA_CATEGORIES } from "../types"
import { useToast } from "@/hooks/use-toast"

interface MovieTriviaFormProps {
  initialTrivia: TriviaItem[]
  onTriviaChange: (trivia: TriviaItem[]) => void
}

const emptyTriviaItem: Omit<TriviaItem, "id"> = {
  question: "",
  category: MOCK_TRIVIA_CATEGORIES[0] || "Behind the Scenes",
  answer: "",
  explanation: "",
}

export function MovieTriviaForm({ initialTrivia, onTriviaChange }: MovieTriviaFormProps) {
  const [triviaItems, setTriviaItems] = useState<TriviaItem[]>(
    initialTrivia.map((item) => ({ ...item, id: item.id || Date.now().toString() + Math.random() })),
  )
  const [editingItem, setEditingItem] = useState<(Partial<TriviaItem> & { id?: string }) | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof TriviaItem, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value })
    }
  }

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.question || !editingItem.category || !editingItem.answer) {
      toast({ title: "Error", description: "Question, Category, and Answer are required.", variant: "destructive" })
      return
    }

    const finalItem: TriviaItem = {
      id: editingItem.id || Date.now().toString(),
      question: editingItem.question!,
      category: editingItem.category as TriviaCategory,
      answer: editingItem.answer!,
      explanation: editingItem.explanation || "",
    }

    let newItemsList
    if (editingItem.id && !isAdding) {
      newItemsList = triviaItems.map((item) => (item.id === editingItem!.id ? finalItem : item))
    } else {
      newItemsList = [...triviaItems, finalItem]
    }
    setTriviaItems(newItemsList)
    onTriviaChange(newItemsList)
    setEditingItem(null)
    setIsAdding(false)
  }

  const handleDeleteItem = (id: string) => {
    const newItemsList = triviaItems.filter((item) => item.id !== id)
    setTriviaItems(newItemsList)
    onTriviaChange(newItemsList)
  }

  const startEdit = (item: TriviaItem) => {
    setEditingItem({ ...item })
    setIsAdding(false)
  }

  const startAdd = () => {
    setEditingItem({ ...emptyTriviaItem, id: `new-${Date.now()}` })
    setIsAdding(true)
  }

  const renderTriviaForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 border rounded-lg space-y-4 mb-4 bg-muted/30"
    >
      <div className="space-y-1">
        <Label htmlFor="trivia-question">Question</Label>
        <Textarea
          id="trivia-question"
          value={editingItem?.question || ""}
          onChange={(e) => handleInputChange("question", e.target.value)}
          placeholder="e.g., What was the original title of the movie?"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="trivia-category">Category</Label>
          <Select
            value={editingItem?.category}
            onValueChange={(val: TriviaCategory) => handleInputChange("category", val)}
          >
            <SelectTrigger id="trivia-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TRIVIA_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="trivia-answer">Answer</Label>
          <Textarea
            id="trivia-answer"
            value={editingItem?.answer || ""}
            onChange={(e) => handleInputChange("answer", e.target.value)}
            placeholder="The answer to the trivia question."
            rows={2}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="trivia-explanation">Explanation (Optional)</Label>
        <Textarea
          id="trivia-explanation"
          value={editingItem?.explanation || ""}
          onChange={(e) => handleInputChange("explanation", e.target.value)}
          placeholder="Additional context or explanation for the answer."
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            setEditingItem(null)
            setIsAdding(false)
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveItem}>Save Trivia Item</Button>
      </div>
    </motion.div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movie Trivia</CardTitle>
        <CardDescription>Manage interesting facts and trivia related to the movie.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {(isAdding || editingItem) && !isAdding && editingItem && renderTriviaForm()}
          </AnimatePresence>

          {triviaItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 border rounded-md bg-card flex items-start justify-between gap-2"
            >
              {editingItem?.id === item.id && !isAdding ? (
                renderTriviaForm()
              ) : (
                <>
                  <div className="flex-grow flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-sm">{item.question}</span>
                      <p className="text-xs text-muted-foreground">Category: {item.category}</p>
                      <p className="text-sm mt-1">
                        <strong>Answer:</strong> {item.answer}
                      </p>
                      {item.explanation && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <em>Explanation:</em> {item.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          <AnimatePresence>{isAdding && editingItem && renderTriviaForm()}</AnimatePresence>
        </div>

        {!editingItem && !isAdding && (
          <Button variant="outline" onClick={startAdd} className="mt-4 w-full gap-2">
            <Plus size={16} /> Add Trivia Item
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
