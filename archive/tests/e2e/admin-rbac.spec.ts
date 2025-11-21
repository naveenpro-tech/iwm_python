import { test, expect } from "@playwright/test"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const API_URL = process.env.API_URL || "http://localhost:8000"

// Test user credentials
const ADMIN_USER = {
  email: "admin@test.com",
  password: "testpassword123",
}

const NON_ADMIN_USER = {
  email: "lover@test.com",
  password: "testpassword123",
}

test.describe("Admin RBAC - Authorization Tests", () => {
  test("Admin user can access admin dashboard", async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', ADMIN_USER.email)
    await page.fill('input[type="password"]', ADMIN_USER.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Navigate to admin panel
    await page.goto(`${BASE_URL}/admin`)

    // Should successfully load admin dashboard
    await expect(page).toHaveURL(`${BASE_URL}/admin`)
    await expect(page.locator("text=Admin Dashboard")).toBeVisible()
  })

  test("Non-admin user is redirected from admin panel", async ({ page }) => {
    // Login as non-admin user
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', NON_ADMIN_USER.email)
    await page.fill('input[type="password"]', NON_ADMIN_USER.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Try to navigate to admin panel
    await page.goto(`${BASE_URL}/admin`)

    // Should be redirected to dashboard with error
    await expect(page).toHaveURL(/\/dashboard.*error=admin_access_denied/)

    // Should see error toast
    await expect(page.locator("text=Access Denied")).toBeVisible()
  })

  test("Unauthenticated user is redirected to login from admin panel", async ({ page }) => {
    // Try to access admin panel without authentication
    await page.goto(`${BASE_URL}/admin`)

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login.*error=admin_required/)

    // Should see authentication required message
    await expect(page.locator("text=Authentication Required")).toBeVisible()
  })

  test("Admin user can access admin movies page", async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', ADMIN_USER.email)
    await page.fill('input[type="password"]', ADMIN_USER.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Navigate to admin movies page
    await page.goto(`${BASE_URL}/admin/movies`)

    // Should successfully load admin movies page
    await expect(page).toHaveURL(`${BASE_URL}/admin/movies`)
    await expect(page.locator("text=Movies")).toBeVisible()
  })

  test("Admin user can access admin users page", async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', ADMIN_USER.email)
    await page.fill('input[type="password"]', ADMIN_USER.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Navigate to admin users page
    await page.goto(`${BASE_URL}/admin/users`)

    // Should successfully load admin users page
    await expect(page).toHaveURL(`${BASE_URL}/admin/users`)
    await expect(page.locator("text=Users")).toBeVisible()
  })

  test("Admin user can access admin moderation page", async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', ADMIN_USER.email)
    await page.fill('input[type="password"]', ADMIN_USER.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`)

    // Navigate to admin moderation page
    await page.goto(`${BASE_URL}/admin/moderation`)

    // Should successfully load admin moderation page
    await expect(page).toHaveURL(`${BASE_URL}/admin/moderation`)
    await expect(page.locator("text=Moderation")).toBeVisible()
  })

  test("Backend returns 403 for non-admin API requests", async ({ request }) => {
    // Get non-admin user token
    const loginResponse = await request.post(`${API_URL}/api/v1/auth/login`, {
      data: {
        email: NON_ADMIN_USER.email,
        password: NON_ADMIN_USER.password,
      },
    })

    const { access_token } = await loginResponse.json()

    // Try to access admin endpoint
    const adminResponse = await request.get(`${API_URL}/api/v1/admin/users`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Should receive 403 Forbidden
    expect(adminResponse.status()).toBe(403)
    const error = await adminResponse.json()
    expect(error.detail).toContain("Admin access required")
  })

  test("Backend returns 200 for admin API requests", async ({ request }) => {
    // Get admin user token
    const loginResponse = await request.post(`${API_URL}/api/v1/auth/login`, {
      data: {
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      },
    })

    const { access_token } = await loginResponse.json()

    // Access admin endpoint
    const adminResponse = await request.get(`${API_URL}/api/v1/admin/users`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Should receive 200 OK
    expect(adminResponse.status()).toBe(200)
  })

  test("Backend returns 401 for unauthenticated API requests", async ({ request }) => {
    // Try to access admin endpoint without token
    const response = await request.get(`${API_URL}/api/v1/admin/users`)

    // Should receive 401 Unauthorized
    expect(response.status()).toBe(401)
  })
})

