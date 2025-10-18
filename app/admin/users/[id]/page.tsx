import { UserDetailView } from "@/components/admin/users/user-detail-view"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* The UserDetailView component now includes the back button and main title logic */}
      <UserDetailView userId={params.id} />
    </div>
  )
}
