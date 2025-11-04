// Force dynamic rendering for all quiz admin pages
export const dynamic = 'force-dynamic'

export default function QuizzesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

