"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, DollarSign, Calendar } from "lucide-react"
import { apiGet, apiPost, apiPut } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BrandDeal {
  id: number
  external_id: string
  brand_name: string
  deal_type: string
  amount?: number
  currency?: string
  status: string
  start_date?: string
  end_date?: string
  description?: string
  deliverables?: string
  created_at: string
}

const STATUS_COLORS = {
  pending: "secondary",
  accepted: "default",
  completed: "outline",
  cancelled: "destructive",
}

export default function BrandDealsPage() {
  const [deals, setDeals] = useState<BrandDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingDeal, setEditingDeal] = useState<BrandDeal | null>(null)
  const [formData, setFormData] = useState({
    brand_name: "",
    deal_type: "",
    amount: "",
    currency: "USD",
    start_date: "",
    end_date: "",
    description: "",
    deliverables: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchDeals()
  }, [])

  async function fetchDeals() {
    try {
      const data = await apiGet<{ items: BrandDeal[] }>("/api/v1/critic-brand-deals/critic/me")
      setDeals(data.items || [])
    } catch (error) {
      console.error("Failed to fetch brand deals:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!formData.brand_name.trim() || !formData.deal_type) {
      toast({
        title: "Validation Error",
        description: "Brand name and deal type are required",
        variant: "destructive",
      })
      return
    }

    try {
      const payload = {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
      }

      if (editingDeal) {
        await apiPut(`/api/v1/critic-brand-deals/${editingDeal.id}`, payload)
        toast({ title: "Success", description: "Brand deal updated successfully" })
      } else {
        await apiPost("/api/v1/critic-brand-deals", payload)
        toast({ title: "Success", description: "Brand deal created successfully" })
      }

      setShowDialog(false)
      setEditingDeal(null)
      resetForm()
      fetchDeals()
    } catch (error: any) {
      console.error("Failed to save brand deal:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save brand deal",
        variant: "destructive",
      })
    }
  }

  async function updateStatus(dealId: number, newStatus: string) {
    try {
      await apiPost(`/api/v1/critic-brand-deals/${dealId}/status`, { status: newStatus })
      toast({ title: "Success", description: "Status updated successfully" })
      fetchDeals()
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  function resetForm() {
    setFormData({
      brand_name: "",
      deal_type: "",
      amount: "",
      currency: "USD",
      start_date: "",
      end_date: "",
      description: "",
      deliverables: "",
    })
  }

  function openEditDialog(deal: BrandDeal) {
    setEditingDeal(deal)
    setFormData({
      brand_name: deal.brand_name,
      deal_type: deal.deal_type,
      amount: deal.amount?.toString() || "",
      currency: deal.currency || "USD",
      start_date: deal.start_date || "",
      end_date: deal.end_date || "",
      description: deal.description || "",
      deliverables: deal.deliverables || "",
    })
    setShowDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Deals</h1>
          <p className="text-muted-foreground mt-1">Manage your brand partnerships and sponsorships</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No brand deals yet</p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {deals.map((deal) => (
            <Card key={deal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{deal.brand_name}</CardTitle>
                      <Badge variant={STATUS_COLORS[deal.status as keyof typeof STATUS_COLORS]}>
                        {deal.status}
                      </Badge>
                      <Badge variant="outline">{deal.deal_type}</Badge>
                    </div>
                    {deal.description && (
                      <CardDescription className="line-clamp-2">{deal.description}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    {deal.amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {deal.currency} {deal.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {deal.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(deal.start_date).toLocaleDateString()}
                          {deal.end_date && ` - ${new Date(deal.end_date).toLocaleDateString()}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {deal.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(deal.id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(deal.id, "cancelled")}
                          className="text-red-600"
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {deal.status === "accepted" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(deal.id, "completed")}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(deal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open)
        if (!open) {
          setEditingDeal(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDeal ? "Edit" : "Add"} Brand Deal</DialogTitle>
            <DialogDescription>
              {editingDeal ? "Update" : "Create"} a brand partnership or sponsorship deal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand Name *</Label>
                <Input
                  placeholder="e.g., Netflix"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Deal Type *</Label>
                <Select
                  value={formData.deal_type}
                  onValueChange={(value) => setFormData({ ...formData, deal_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sponsored_content">Sponsored Content</SelectItem>
                    <SelectItem value="product_placement">Product Placement</SelectItem>
                    <SelectItem value="brand_ambassador">Brand Ambassador</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the deal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Deliverables</Label>
              <Textarea
                placeholder="What you need to deliver..."
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingDeal ? "Update" : "Create"} Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

