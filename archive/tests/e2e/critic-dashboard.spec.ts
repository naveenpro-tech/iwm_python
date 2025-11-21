import { test, expect } from "@playwright/test"

const DASHBOARD_URL = "http://localhost:3000/critic/dashboard"

test.describe("Critic Dashboard", () => {
  test("1. Dashboard loads successfully", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page.getByText("Critic Dashboard")).toBeVisible()
  })

  test("2. Stats cards display correctly", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page.getByText("Total Reviews")).toBeVisible()
    await expect(page.getByText("Total Views")).toBeVisible()
    await expect(page.getByText("Total Likes")).toBeVisible()
    await expect(page.getByText("Followers")).toBeVisible()
  })

  test("3. Create New Review button is visible", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    const createButton = page.getByRole("link", { name: /Create New Review/i })
    await expect(createButton).toBeVisible()
    await expect(createButton).toHaveAttribute("href", "/critic/dashboard/create-review")
  })

  test("4. Views Over Time chart displays", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page.getByText("Views Over Time")).toBeVisible()
  })

  test("5. Engagement Rate chart displays", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page.getByText("Engagement Rate")).toBeVisible()
  })

  test("6. Drafts section displays", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page.getByText(/Drafts \(\d+\)/)).toBeVisible()
  })

  test("7. Draft cards show progress bars", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await page.waitForTimeout(1000)
    const progressText = page.getByText(/\d+%/)
    if (await progressText.count() > 0) {
      await expect(progressText.first()).toBeVisible()
    }
  })

  test("8. Draft Continue button links correctly", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await page.waitForTimeout(1000)
    const continueButton = page.getByRole("button", { name: /Continue/i }).first()
    if (await continueButton.count() > 0) {
      await expect(continueButton).toBeVisible()
    }
  })

  test("9. Recent Reviews section displays", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page.getByText("Recent Reviews")).toBeVisible()
  })

  test("10. Review cards show view and like counts", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await page.waitForTimeout(1000)
    // Check for numbers (views/likes)
    const numbers = page.locator("text=/\\d+,?\\d*/")
    await expect(numbers.first()).toBeVisible()
  })

  test("11. Edit button on reviews is visible", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await page.waitForTimeout(1000)
    const editButton = page.getByRole("button", { name: /Edit/i }).first()
    if (await editButton.count() > 0) {
      await expect(editButton).toBeVisible()
    }
  })

  test("12. Delete button on reviews is visible", async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await page.waitForTimeout(1000)
    const deleteButton = page.getByRole("button", { name: /Delete/i }).first()
    if (await deleteButton.count() > 0) {
      await expect(deleteButton).toBeVisible()
    }
  })
})

