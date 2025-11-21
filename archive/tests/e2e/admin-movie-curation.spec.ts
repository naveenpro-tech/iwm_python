import { test, expect } from "@playwright/test"

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000"
const API_URL = process.env.PLAYWRIGHT_TEST_API_URL || "http://localhost:8000"

// Admin credentials (from test fixtures)
const ADMIN_EMAIL = "admin@example.com"
const ADMIN_PASSWORD = "AdminPassword123!"

test.describe("Admin Movie Curation", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`)
  })

  test("should load admin movie curation page", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Check page title
    await expect(page.locator("h1")).toContainText("Movie Curation Management")
    
    // Check filters are present
    await expect(page.locator("label")).toContainText("Curation Status")
    await expect(page.locator("label")).toContainText("Sort By")
    await expect(page.locator("label")).toContainText("Order")
    
    // Check table headers
    await expect(page.locator("th")).toContainText("Movie")
    await expect(page.locator("th")).toContainText("Status")
    await expect(page.locator("th")).toContainText("Quality Score")
  })

  test("should filter movies by curation status", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Select "Approved" status filter
    await page.selectOption("select", { label: "Curation Status" }, "approved")
    
    // Wait for table to update
    await page.waitForTimeout(500)
    
    // Verify URL contains filter parameter
    const url = page.url()
    expect(url).toContain("curation_status=approved")
  })

  test("should sort by quality score ascending", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Select sort by quality score
    const sortSelects = await page.locator("select").all()
    await sortSelects[1].selectOption("quality_score")
    
    // Select ascending order
    await sortSelects[2].selectOption("asc")
    
    // Wait for table to update
    await page.waitForTimeout(500)
    
    // Verify URL contains sort parameters
    const url = page.url()
    expect(url).toContain("sort_by=quality_score")
    expect(url).toContain("sort_order=asc")
  })

  test("should sort by quality score descending", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Select sort by quality score
    const sortSelects = await page.locator("select").all()
    await sortSelects[1].selectOption("quality_score")
    
    // Select descending order
    await sortSelects[2].selectOption("desc")
    
    // Wait for table to update
    await page.waitForTimeout(500)
    
    // Verify URL contains sort parameters
    const url = page.url()
    expect(url).toContain("sort_by=quality_score")
    expect(url).toContain("sort_order=desc")
  })

  test("should sort by curation date newest first", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Select sort by curated_at (default)
    const sortSelects = await page.locator("select").all()
    await sortSelects[1].selectOption("curated_at")
    
    // Select descending order (newest first)
    await sortSelects[2].selectOption("desc")
    
    // Wait for table to update
    await page.waitForTimeout(500)
    
    // Verify URL contains sort parameters
    const url = page.url()
    expect(url).toContain("sort_by=curated_at")
    expect(url).toContain("sort_order=desc")
  })

  test("should paginate through movies", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Get initial page number
    const initialPageText = await page.locator("text=/Page \\d+ of/").textContent()
    expect(initialPageText).toContain("Page 1 of")
    
    // Click next button
    const nextButton = page.locator("button:has-text('›')")
    if (await nextButton.isEnabled()) {
      await nextButton.click()
      
      // Wait for table to update
      await page.waitForTimeout(500)
      
      // Verify page changed
      const newPageText = await page.locator("text=/Page \\d+ of/").textContent()
      expect(newPageText).toContain("Page 2 of")
    }
  })

  test("should change items per page", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Get initial row count
    const initialRows = await page.locator("table tbody tr").count()
    
    // Change page size to 50
    const pageSizeSelects = await page.locator("select").all()
    await pageSizeSelects[3].selectOption("50")
    
    // Wait for table to update
    await page.waitForTimeout(500)
    
    // Verify URL contains page_size parameter
    const url = page.url()
    expect(url).toContain("page_size=50")
  })

  test("should navigate to movie edit page", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Click edit button on first movie
    const editButton = page.locator("button:has-text('Edit')").first()
    await editButton.click()
    
    // Wait for navigation
    await page.waitForURL(/\/admin\/curation\/\d+/)
    
    // Verify we're on the edit page
    await expect(page.locator("h1")).toContainText("Movie")
    await expect(page.locator("label")).toContainText("Curation Status")
    await expect(page.locator("label")).toContainText("Quality Score")
    await expect(page.locator("label")).toContainText("Curator Notes")
  })

  test("should update movie curation", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Wait for table to load
    await page.waitForSelector("table tbody tr")
    
    // Click edit button on first movie
    const editButton = page.locator("button:has-text('Edit')").first()
    await editButton.click()
    
    // Wait for edit page to load
    await page.waitForURL(/\/admin\/curation\/\d+/)
    
    // Fill form
    const statusSelect = page.locator("select").first()
    await statusSelect.selectOption("approved")
    
    const qualityInput = page.locator('input[type="number"]')
    await qualityInput.fill("85")
    
    const notesTextarea = page.locator("textarea")
    await notesTextarea.fill("This movie has excellent metadata and rich content")
    
    // Submit form
    const submitButton = page.locator("button:has-text('Save Changes')")
    await submitButton.click()
    
    // Wait for success toast
    await page.waitForTimeout(1000)
    
    // Verify redirect back to list
    await page.waitForURL(`${BASE_URL}/admin/curation`)
  })

  test("should prevent non-admin access to curation page", async ({ page, context }) => {
    // Logout
    await page.goto(`${BASE_URL}/dashboard`)
    await page.click("button:has-text('Logout')")
    
    // Wait for redirect to login
    await page.waitForURL(`${BASE_URL}/login`)
    
    // Login as non-admin user
    await page.fill('input[type="email"]', "user@example.com")
    await page.fill('input[type="password"]', "UserPassword123!")
    await page.click('button[type="submit"]')
    
    // Wait for redirect
    await page.waitForURL(`${BASE_URL}/dashboard`)
    
    // Try to access curation page
    await page.goto(`${BASE_URL}/admin/curation`)
    
    // Should be redirected or show error
    const url = page.url()
    expect(url).not.toContain("/admin/curation")
  })
})

