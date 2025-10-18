"use client"

import { useState } from "react"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FilterBuilderProps {
  dataSource: string
}

interface Filter {
  id: string
  field: string
  operator: string
  value: string
}

export default function FilterBuilder({ dataSource }: FilterBuilderProps) {
  const [filters, setFilters] = useState<Filter[]>([
    {
      id: "filter-1",
      field: "",
      operator: "equals",
      value: "",
    },
  ])

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: `filter-${filters.length + 1}`,
        field: "",
        operator: "equals",
        value: "",
      },
    ])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id))
  }

  const updateFilter = (id: string, field: keyof Filter, value: string) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === id) {
          return { ...filter, [field]: value }
        }
        return filter
      }),
    )
  }

  const getFieldsForDataSource = () => {
    switch (dataSource) {
      case "users":
        return [
          { id: "username", name: "Username" },
          { id: "email", name: "Email" },
          { id: "registration_date", name: "Registration Date" },
          { id: "last_login", name: "Last Login" },
          { id: "country", name: "Country" },
          { id: "user_type", name: "User Type" },
        ]
      case "content":
        return [
          { id: "title", name: "Title" },
          { id: "genre", name: "Genre" },
          { id: "release_date", name: "Release Date" },
          { id: "rating", name: "Rating" },
          { id: "director", name: "Director" },
          { id: "language", name: "Language" },
        ]
      case "system":
        return [
          { id: "timestamp", name: "Timestamp" },
          { id: "endpoint", name: "Endpoint" },
          { id: "response_time", name: "Response Time" },
          { id: "status_code", name: "Status Code" },
          { id: "browser", name: "Browser" },
          { id: "device", name: "Device" },
        ]
      default:
        return []
    }
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {filters.map((filter, index) => (
          <div key={filter.id} className="flex flex-wrap items-center gap-2">
            <Select value={filter.field} onValueChange={(value) => updateFilter(filter.id, "field", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {getFieldsForDataSource().map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filter.operator} onValueChange={(value) => updateFilter(filter.id, "operator", value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Not Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater_than">Greater Than</SelectItem>
                <SelectItem value="less_than">Less Than</SelectItem>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="in">In List</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className="flex-1 min-w-[200px]"
              placeholder="Value"
              value={filter.value}
              onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
            />

            <Button variant="ghost" size="icon" onClick={() => removeFilter(filter.id)} disabled={filters.length === 1}>
              <Trash className="h-4 w-4 text-muted-foreground" />
            </Button>

            {index === filters.length - 1 && (
              <Button variant="outline" size="sm" onClick={addFilter} className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Filter</span>
              </Button>
            )}
          </div>
        ))}

        {filters.length === 0 && (
          <Button variant="outline" size="sm" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Filter</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
