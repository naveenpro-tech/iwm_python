import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BadgeCheck, Users, Film, Award, Newspaper, TrendingUp, Search } from "lucide-react"
import Link from "next/link"
import IndustryProfessionalsGrid from "@/components/industry-profiles/browse/industry-professionals-grid"

export default function IndustryPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Industry Hub</h1>
          <p className="text-muted-foreground">Connect with verified industry professionals</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/industry/profile/create">Create Industry Profile</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Verified Professionals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2,547</p>
            <p className="text-sm text-muted-foreground">+124 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              Productions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8,392</p>
            <p className="text-sm text-muted-foreground">+312 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Awards & Recognitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12,847</p>
            <p className="text-sm text-muted-foreground">+532 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Press Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5,128</p>
            <p className="text-sm text-muted-foreground">+217 this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="professionals" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="professionals" className="flex-1 md:flex-none">
            <Users className="h-4 w-4 mr-2" />
            Professionals
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex-1 md:flex-none">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="search" className="flex-1 md:flex-none">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professionals" className="mt-6">
          <IndustryProfessionalsGrid />
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending Industry Professionals</CardTitle>
              <CardDescription>The most viewed and followed professionals this week</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Trending professionals content would go here */}
              <p>Trending professionals content placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
              <CardDescription>Find industry professionals by specific criteria</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Advanced search form would go here */}
              <p>Advanced search form placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
