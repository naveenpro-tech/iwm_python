"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Zap, Calendar, Award, Users, Type, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FilterSet } from "./types"

interface VisualQueryBuilderProps {
  filters: FilterSet
  onFiltersChange: (filters: FilterSet) => void
}

interface QueryNode {
  id: string
  type: "text" | "people" | "date" | "rating" | "award" | "technical"
  value: any
  operator?: "AND" | "OR"
}

export function VisualQueryBuilder({ filters, onFiltersChange }: VisualQueryBuilderProps) {
  const [nodes, setNodes] = useState<QueryNode[]>([])
  const [showAddMenu, setShowAddMenu] = useState(false)

  const nodeTypes = [
    { type: "text", label: "Text", icon: Type, color: "bg-blue-500" },
    { type: "people", label: "People", icon: Users, color: "bg-green-500" },
    { type: "date", label: "Date", icon: Calendar, color: "bg-purple-500" },
    { type: "rating", label: "Rating", icon: Star, color: "bg-yellow-500" },
    { type: "award", label: "Awards", icon: Award, color: "bg-red-500" },
    { type: "technical", label: "Technical", icon: Zap, color: "bg-indigo-500" },
  ]

  const addNode = (type: QueryNode["type"]) => {
    const newNode: QueryNode = {
      id: Date.now().toString(),
      type,
      value: {},
      operator: nodes.length > 0 ? "AND" : undefined,
    }
    setNodes([...nodes, newNode])
    setShowAddMenu(false)
  }

  const removeNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
  }

  const updateNodeOperator = (id: string, operator: "AND" | "OR") => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, operator } : node)))
  }

  return (
    <div className="bg-[#282828] border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Visual Query Builder</h3>
        <Button onClick={() => setShowAddMenu(!showAddMenu)} size="sm" className="bg-[#00BFFF] hover:bg-[#0099CC]">
          <Plus className="mr-2" size={16} />
          Add Filter
        </Button>
      </div>

      {/* Add Menu */}
      <AnimatePresence>
        {showAddMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {nodeTypes.map((nodeType) => {
              const Icon = nodeType.icon
              return (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type as QueryNode["type"])}
                  className="flex items-center gap-2 p-3 bg-[#333333] hover:bg-[#404040] rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded ${nodeType.color}`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-white">{nodeType.label}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Query Nodes */}
      <div className="space-y-4">
        <AnimatePresence>
          {nodes.map((node, index) => {
            const nodeType = nodeTypes.find((nt) => nt.type === node.type)!
            const Icon = nodeType.icon

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative"
              >
                {/* Operator */}
                {index > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px bg-gray-600 flex-1" />
                    <select
                      value={node.operator}
                      onChange={(e) => updateNodeOperator(node.id, e.target.value as "AND" | "OR")}
                      className="bg-[#333333] text-white px-3 py-1 rounded border border-gray-600"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                    <div className="h-px bg-gray-600 flex-1" />
                  </div>
                )}

                {/* Node */}
                <div className="flex items-center gap-4 p-4 bg-[#333333] rounded-lg">
                  <div className={`p-3 rounded ${nodeType.color}`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{nodeType.label} Filter</h4>
                    <p className="text-gray-400 text-sm">Configure {nodeType.label.toLowerCase()} criteria</p>
                  </div>
                  <button
                    onClick={() => removeNode(node.id)}
                    className="p-2 hover:bg-[#404040] rounded transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {nodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No filters added yet</p>
            <p className="text-gray-600 text-sm">Click "Add Filter" to start building your query</p>
          </div>
        )}
      </div>

      {/* Query Preview */}
      {nodes.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-[#1A1A1A] rounded-lg">
          <h4 className="text-white font-medium mb-2">Query Preview</h4>
          <code className="text-[#00BFFF] text-sm">
            {nodes.map((node, index) => (
              <span key={node.id}>
                {index > 0 && <span className="text-yellow-500"> {node.operator} </span>}
                <span>{node.type}(...)</span>
              </span>
            ))}
          </code>
        </motion.div>
      )}
    </div>
  )
}
