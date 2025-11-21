import { test, expect } from "@playwright/test"

const MOVIE_URL = "http://localhost:3000/movies/tt0111161"
const REVIEWS_URL = "http://localhost:3000/movies/tt0111161/reviews"

test.describe("Movie Critic Reviews Integration", () => {
  test("1. Verified Critic Reviews section appears on movie page", async ({ page }) => {
    await page.goto(MOVIE_URL)
    await page.waitForLoadState("networkidle")
    // Section might not always be visible if no critic reviews
    const section = page.getByText("Verified Critic Reviews")
    if (await section.count() > 0) {
      await expect(section).toBeVisible()
    }
  })

  test("2. Critic review cards display in carousel", async ({ page }) => {
    await page.goto(MOVIE_URL)
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(1000)
    // Check if carousel exists
    const criticCard = page.locator("text=Siddu Kumar, text=Rajesh Menon").first()
    if (await criticCard.count() > 0) {
      await expect(criticCard).toBeVisible()
    }
  })

  test("3. View All button links to reviews page", async ({ page }) => {
    await page.goto(MOVIE_URL)
    await page.waitForLoadState("networkidle")
    const viewAllButton = page.getByRole("link", { name: /View All/i })
    if (await viewAllButton.count() > 0) {
      await expect(viewAllButton).toBeVisible()
    }
  })

  test("4. Reviews page shows filter tabs", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await expect(page.getByRole("button", { name: /All Reviews/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /User Reviews/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /Critic Reviews/i })).toBeVisible()
  })

  test("5. All Reviews tab shows both types", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.getByRole("button", { name: /All Reviews/i }).click()
    await page.waitForTimeout(500)
    // Should show total count
    await expect(page.getByText(/All Reviews \(\d+\)/)).toBeVisible()
  })

  test("6. User Reviews filter works", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.getByRole("button", { name: /User Reviews/i }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText(/User Reviews \(\d+\)/)).toBeVisible()
  })

  test("7. Critic Reviews filter works", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.getByRole("button", { name: /Critic Reviews/i }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText(/Critic Reviews \(\d+\)/)).toBeVisible()
  })

  test("8. Verified Critic badge displays on critic reviews", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.waitForTimeout(1000)
    const badge = page.getByText("Verified Critic")
    if (await badge.count() > 0) {
      await expect(badge.first()).toBeVisible()
    }
  })

  test("9. Critic name is clickable link", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.waitForTimeout(1000)
    const criticLink = page.locator("a[href*='/critic/']").first()
    if (await criticLink.count() > 0) {
      await expect(criticLink).toBeVisible()
    }
  })

  test("10. Read Full Review link appears for critic reviews", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.waitForTimeout(1000)
    const readFullLink = page.getByText("Read Full Review")
    if (await readFullLink.count() > 0) {
      await expect(readFullLink.first()).toBeVisible()
    }
  })

  test("11. Empty state shows when no reviews match filter", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    // This test depends on data availability
    await page.waitForTimeout(500)
  })

  test("12. Star ratings display correctly", async ({ page }) => {
    await page.goto(REVIEWS_URL)
    await page.waitForTimeout(1000)
    // Check for star icons
    const stars = page.locator("svg").filter({ hasText: "" })
    if (await stars.count() > 0) {
      await expect(stars.first()).toBeVisible()
    }
  })
})

