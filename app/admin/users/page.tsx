import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagementTable } from "@/components/admin/users/user-management-table"

export default function UserManagementPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
      </div>

      <Card className="bg-card shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">All Users</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions within the Siddu platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable />
        </CardContent>
      </Card>
    </div>
  )
}
