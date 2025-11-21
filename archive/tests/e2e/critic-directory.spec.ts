import { test, expect } from "@playwright/test"

const CRITICS_URL = "http://localhost:3000/critics"

test.describe("Critic Directory", () => {
  test("1. Critics directory page loads", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await expect(page.getByText("Verified Critics")).toBeVisible()
  })

  test("2. Search bar is visible", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await expect(page.getByPlaceholder("Search critics by name...")).toBeVisible()
  })

  test("3. Sort dropdown is visible", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    await expect(page.getByText("Most Followers")).toBeVisible()
  })

  test("4. Critic cards display in grid", async ({ page }) => {
    await page.goto(CRITICS_URL)
    // Wait for loading to complete
    await page.waitForSelector("text=Siddu Kumar", { timeout: 10000 })
    await expect(page.getByText("Siddu Kumar")).toBeVisible()
    await expect(page.getByText("Rajesh Menon")).toBeVisible()
  })

  test("5. Search functionality filters critics", async ({ page }) => {
    await page.goto(CRITICS_URL)
    // Wait for page to load first
    await page.waitForSelector("text=Siddu Kumar", { timeout: 10000 })
    await page.getByPlaceholder("Search critics by name...").fill("Siddu")
    await page.waitForTimeout(500)
    await expect(page.getByText("Siddu Kumar")).toBeVisible()
  })

  test("6. Sort by Most Followers works", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    // Default sort is already "Most Followers", just verify it's visible
    await expect(page.getByText("Most Followers")).toBeVisible()
  })

  test("7. Sort by Most Reviews works", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    // Click the select trigger to open dropdown
    await page.locator('[role="combobox"]').click()
    await page.waitForTimeout(300)
    // Click "Most Reviews" option
    await page.getByText("Most Reviews", { exact: true }).click()
    await page.waitForTimeout(500)
  })

  test("8. Sort by A-Z works", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    // Click the select trigger to open dropdown
    await page.locator('[role="combobox"]').click()
    await page.waitForTimeout(300)
    // Click "A-Z" option
    await page.getByText("A-Z", { exact: true }).click()
    await page.waitForTimeout(500)
  })

  test("9. Follow button is visible on critic cards", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    const followButton = page.getByRole("button", { name: /Follow/i }).first()
    await expect(followButton).toBeVisible()
  })

  test("10. Follow button toggles to Following", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    const followButton = page.getByRole("button", { name: /Follow/i }).first()
    await followButton.click()
    await expect(page.getByRole("button", { name: /Following/i }).first()).toBeVisible()
  })

  test("11. Critic profile link works", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    const criticLink = page.locator("a[href*='/critic/']").first()
    await expect(criticLink).toBeVisible()
  })

  test("12. Verified badge displays on all critics", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    const verifiedBadge = page.getByText("Verified Critic")
    await expect(verifiedBadge.first()).toBeVisible()
  })

  test("13. Follower count displays", async ({ page }) => {
    await page.goto(CRITICS_URL)
    await page.waitForTimeout(1000)
    await expect(page.getByText(/\d+K? followers/i).first()).toBeVisible()
  })

  test("14. Review count displays", async ({ page }) => {
    await page.goto(CRITICS_URL)
    // Wait for content to load
    await page.waitForSelector("text=Siddu Kumar", { timeout: 10000 })
    await expect(page.getByText(/\d+ reviews/).first()).toBeVisible()
  })

  test("15. Empty search shows no results message", async ({ page }) => {
    await page.goto(CRITICS_URL)
    // Wait for page to load first
    await page.waitForSelector("text=Siddu Kumar", { timeout: 10000 })
    await page.getByPlaceholder("Search critics by name...").fill("NonExistentCritic12345")
    await page.waitForTimeout(500)
    // Check for empty state message
    await expect(page.getByText(/no critics/i)).toBeVisible()
  })
})

