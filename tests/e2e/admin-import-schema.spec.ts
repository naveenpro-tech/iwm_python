import { test, expect } from "@playwright/test"

test.describe("Admin Import Schema Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to schema page directly
    // Note: In production, this would require admin authentication
    await page.goto("/admin/movies/schema")
    await page.waitForLoadState("networkidle")
  })

  test("should load schema page successfully", async ({ page }) => {
    // Check page title
    const title = page.locator("h1")
    await expect(title).toContainText("Movie Import Schema", { timeout: 10000 })
  })

  test("should display download buttons", async ({ page }) => {
    // Check for download buttons
    const downloadSchemaBtn = page.locator("button:has-text('Download Schema')")
    const downloadTemplateBtn = page.locator("button:has-text('Download Template')")

    await expect(downloadSchemaBtn).toBeVisible({ timeout: 10000 })
    await expect(downloadTemplateBtn).toBeVisible({ timeout: 10000 })
  })

  test("should display fields section", async ({ page }) => {
    // Check for fields section
    const fieldsSection = page.locator("text=Fields")
    await expect(fieldsSection).toBeVisible({ timeout: 10000 })
  })

  test("should display example section", async ({ page }) => {
    // Check for example section
    const exampleSection = page.locator("text=Example Movie")
    await expect(exampleSection).toBeVisible({ timeout: 10000 })
  })

  test("should display template preview section", async ({ page }) => {
    // Check for template section
    const templateSection = page.locator("text=Template Preview")
    await expect(templateSection).toBeVisible({ timeout: 10000 })
  })

  test("should display instructions section", async ({ page }) => {
    // Check for instructions section
    const instructionsSection = page.locator("text=How to use:")
    await expect(instructionsSection).toBeVisible({ timeout: 10000 })
  })

  test("should have link to import page", async ({ page }) => {
    // Check for link to import page
    const importLink = page.locator('a[href="/admin/movies/import"]')
    await expect(importLink).toBeVisible({ timeout: 10000 })
  })
})

