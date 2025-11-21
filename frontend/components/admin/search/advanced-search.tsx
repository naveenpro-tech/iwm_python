"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AdvancedSearchState, SearchResult } from "./advanced-search"

export function AdvancedSearch() {
  const [searchState, setSearchState] = useState<AdvancedSearchState>({
    query: "",
    filters: {
      textFilters: {},
      peopleFilters: {},
      dateFilters: {},
      ratingFilters: {},
      awardFilters: {},
      technicalFilters: {},
    },
    savedSearches: [],
    searchHistory: [],
    results: [],
    isLoading: false,
  })

  const handleSearch = () => {
    setSearchState((prev) => ({ ...prev, isLoading: true }))

    // Simulate search results after a delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "movie",
          title: "Inception",
          year: 2010,
          poster: "/inception-movie-poster.png",
          rating: 8.8,
          matchScore: 98,
          hasOscar: true,
        },
        {
          id: "2",
          type: "movie",
          title: "The Dark Knight",
          year: 2008,
          poster: "/dark-knight-poster.png",
          rating: 9.0,
          matchScore: 95,
          hasOscar: true,
        },
      ]

      setSearchState((prev) => ({
        ...prev,
        results: mockResults,
        isLoading: false,
        searchHistory: [
          ...prev.searchHistory,
          {
            id: Date.now().toString(),
            query: prev.query,
            filters: prev.filters,
            timestamp: new Date(),
            resultCount: mockResults.length,
          },
        ],
      }))
    }, 1000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Advanced Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search query..."
              value={searchState.query}
              onChange={(e) => setSearchState((prev) => ({ ...prev, query: e.target.value }))}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searchState.isLoading}>
              {searchState.isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          <Tabs defaultValue="filters">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="results">Results ({searchState.results.length})</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="filters" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Text Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <Input placeholder="Exact phrase..." className="mb-2" />
                    <Input placeholder="Title contains..." className="mb-2" />
                    <Input placeholder="Exclude words (comma separated)..." />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">People Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <Input placeholder="Actors (comma separated)..." className="mb-2" />
                    <Input placeholder="Directors (comma separated)..." className="mb-2" />
                    <Input placeholder="Writers (comma separated)..." />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Date Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input placeholder="Year from..." type="number" />
                      <Input placeholder="Year to..." type="number" />
                    </div>
                    <Input placeholder="Specific decade (e.g. 1990s)..." />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Rating Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input placeholder="Min Siddu Score..." type="number" min="0" max="10" step="0.1" />
                      <Input placeholder="Max Siddu Score..." type="number" min="0" max="10" step="0.1" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Min User Rating..." type="number" min="0" max="10" step="0.1" />
                      <Input placeholder="Max User Rating..." type="number" min="0" max="10" step="0.1" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset Filters</Button>
                <Button onClick={handleSearch}>Apply Filters</Button>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {searchState.isLoading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Searching...</p>
                </div>
              ) : searchState.results.length > 0 ? (
                <div className="space-y-4">
                  {searchState.results.map((result) => (
                    <div key={result.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {result.poster && (
                          <img
                            src={result.poster || "/placeholder.svg"}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold">
                            {result.title} {result.year && `(${result.year})`}
                          </h3>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {result.matchScore}% match
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          {result.rating && (
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">★ {result.rating}</span>
                          )}
                          {result.hasOscar && (
                            <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">Oscar Winner</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No results found. Try adjusting your search criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {searchState.searchHistory.length > 0 ? (
                <div className="space-y-2">
                  {searchState.searchHistory.map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.query || "Empty query"}</p>
                        <span className="text-sm text-muted-foreground">{item.resultCount} results</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No search history yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
