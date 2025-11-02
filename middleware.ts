import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/watchlist",
  "/favorites",
  "/collections",
  "/reviews/new",
  "/pulse",
  "/notifications",
  "/settings",
]

// Routes that require admin role
const adminRoutes: string[] = ["/admin"]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"]

// Routes that are public (don't require authentication)
const publicRoutes = [
  /^\/collections\/[^/]+\/public$/,  // Public collection view: /collections/{id}/public
]

// Helper function to check if user has admin role
function hasAdminRole(token: string): boolean {
  try {
    const decoded = jwtDecode<any>(token)
    // Check if user has admin role in their role_profiles
    // The token should contain user info with role_profiles
    return decoded?.role_profiles?.some((role: any) => role.role_type === "admin" && role.enabled) ?? false
  } catch (error) {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("access_token")?.value

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => route.test(pathname))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if the route is admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If trying to access admin route without token, redirect to login
  if (isAdminRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    loginUrl.searchParams.set("error", "admin_required")
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access admin route without admin role, redirect to dashboard with error
  if (isAdminRoute && accessToken && !hasAdminRole(accessToken)) {
    const dashboardUrl = new URL("/dashboard", request.url)
    dashboardUrl.searchParams.set("error", "admin_access_denied")
    return NextResponse.redirect(dashboardUrl)
  }

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access auth routes with token, redirect to dashboard
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)",
  ],
}

