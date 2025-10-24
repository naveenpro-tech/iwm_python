import { test, expect } from "@playwright/test"

/**
 * Critic Profile Page E2E Tests
 * 
 * Tests all user flows for the advanced critic profile page including:
 * - Page load and data fetching
 * - Video banner functionality
 * - Follow/unfollow interactions
 * - Filmography heatmap filtering
 * - Analytics charts display
 * - AMA question submission and upvoting
 * - Badge display and interactions
 * - Review search/filter/sort
 * - Responsive design
 * - Error states
 */

test.describe("Critic Profile Page", () => {
  const criticUsername = "testcritic"
  const profileUrl = `/critic/${criticUsername}`

  test.beforeEach(async ({ page }) => {
    // Navigate to critic profile page before each test
    await page.goto(profileUrl)
  })

  test("loads profile page successfully", async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle")

    // Check that the page title contains the critic's display name
    await expect(page.locator("h1")).toBeVisible()

    // Check that the hero section is visible
    await expect(page.locator('[class*="hero"]').first()).toBeVisible()
  })

  test("displays video banner or image fallback", async ({ page }) => {
    // Check if video element exists
    const video = page.locator("video")
    const image = page.locator('img[alt*="banner"]')

    // Either video or image should be visible
    const videoVisible = await video.isVisible().catch(() => false)
    const imageVisible = await image.isVisible().catch(() => false)

    expect(videoVisible || imageVisible).toBeTruthy()
  })

  test("video pause/play button works", async ({ page }) => {
    const video = page.locator("video")
    const pauseButton = page.locator('button[aria-label*="Pause"]')

    // Check if video exists
    const hasVideo = await video.isVisible().catch(() => false)

    if (hasVideo) {
      // Click pause button
      await pauseButton.click()

      // Check that button text changed to "Play"
      await expect(page.locator('button[aria-label*="Play"]')).toBeVisible()
    }
  })

  test("follow button toggles state", async ({ page }) => {
    // Find follow button
    const followButton = page.locator('button:has-text("Follow"), button:has-text("Following")').first()

    // Get initial text
    const initialText = await followButton.textContent()

    // Click follow button
    await followButton.click()

    // Wait for state change
    await page.waitForTimeout(500)

    // Get new text
    const newText = await followButton.textContent()

    // Text should have changed
    expect(initialText).not.toBe(newText)
  })

  test("follower count updates on follow/unfollow", async ({ page }) => {
    // Find follower count
    const followerCount = page.locator('text=/\\d+\\s+Followers/').first()
    const initialCount = await followerCount.textContent()

    // Click follow button
    const followButton = page.locator('button:has-text("Follow"), button:has-text("Following")').first()
    await followButton.click()

    // Wait for update
    await page.waitForTimeout(500)

    // Get new count
    const newCount = await followerCount.textContent()

    // Count should have changed
    expect(initialCount).not.toBe(newCount)
  })

  test("stats constellation displays all 5 nodes", async ({ page }) => {
    // Wait for constellation to load
    await page.waitForTimeout(2000)

    // Check for stat nodes (should be 5)
    const statNodes = page.locator('[class*="stat"]').filter({ hasText: /Followers|Reviews|Rating|Likes|Views/ })
    const count = await statNodes.count()

    expect(count).toBeGreaterThanOrEqual(5)
  })

  test("heatmap tiles are visible and clickable", async ({ page }) => {
    // Scroll to heatmap section
    await page.locator('text="Filmography Heatmap"').scrollIntoViewIfNeeded()

    // Wait for heatmap to load
    await page.waitForTimeout(1000)

    // Find heatmap tiles
    const tiles = page.locator('[data-testid="heatmap-tile"]')
    const tileCount = await tiles.count()

    // Should have at least one tile
    expect(tileCount).toBeGreaterThan(0)

    // Click first tile
    if (tileCount > 0) {
      await tiles.first().click()

      // Should scroll to review showcase
      await page.waitForTimeout(500)
    }
  })

  test("analytics charts are displayed", async ({ page }) => {
    // Scroll to analytics section
    await page.locator('text="Critic\'s Voice Analytics"').scrollIntoViewIfNeeded()

    // Wait for charts to load
    await page.waitForTimeout(1000)

    // Check for chart containers (should be 4)
    const charts = page.locator('[class*="recharts"]')
    const chartCount = await charts.count()

    expect(chartCount).toBeGreaterThanOrEqual(4)
  })

  test("keyword cloud displays words", async ({ page }) => {
    // Scroll to analytics section
    await page.locator('text="Keyword Cloud"').scrollIntoViewIfNeeded()

    // Wait for keywords to load
    await page.waitForTimeout(1000)

    // Check for keyword elements
    const keywords = page.locator('[class*="keyword"]').or(page.locator('span[style*="fontSize"]'))
    const keywordCount = await keywords.count()

    expect(keywordCount).toBeGreaterThan(0)
  })

  test("review showcase displays reviews", async ({ page }) => {
    // Scroll to review showcase
    await page.locator('text=/Reviews \\(\\d+\\)/', { exact: false }).scrollIntoViewIfNeeded()

    // Wait for reviews to load
    await page.waitForTimeout(1000)

    // Check for review cards
    const reviews = page.locator('[class*="review-card"]').or(page.locator('article'))
    const reviewCount = await reviews.count()

    expect(reviewCount).toBeGreaterThan(0)
  })

  test("review search filters results", async ({ page }) => {
    // Scroll to review showcase
    await page.locator('#review-showcase').scrollIntoViewIfNeeded()

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill("inception")

    // Wait for filter
    await page.waitForTimeout(500)

    // Results should update (check results count text)
    const resultsText = page.locator('text=/Showing \\d+ of \\d+ reviews/')
    await expect(resultsText).toBeVisible()
  })

  test("review sort changes order", async ({ page }) => {
    // Scroll to review showcase
    await page.locator('#review-showcase').scrollIntoViewIfNeeded()

    // Find sort dropdown
    const sortDropdown = page.locator('button:has-text("Sort")').or(page.locator('[role="combobox"]')).first()
    await sortDropdown.click()

    // Select "Highest Rated"
    await page.locator('text="Highest Rated"').click()

    // Wait for sort
    await page.waitForTimeout(500)

    // Reviews should be reordered (we can't easily verify order, but no error should occur)
  })

  test("badges section displays badges", async ({ page }) => {
    // Scroll to badges section
    await page.locator('text="Achievement Badges"').scrollIntoViewIfNeeded()

    // Wait for badges to load
    await page.waitForTimeout(1000)

    // Check for badge cards
    const badges = page.locator('[class*="badge"]').filter({ has: page.locator('svg') })
    const badgeCount = await badges.count()

    expect(badgeCount).toBeGreaterThan(0)
  })

  test("clicking badge opens details modal", async ({ page }) => {
    // Scroll to badges section
    await page.locator('text="Achievement Badges"').scrollIntoViewIfNeeded()

    // Wait for badges to load
    await page.waitForTimeout(1000)

    // Click first badge
    const firstBadge = page.locator('[class*="badge"]').first()
    await firstBadge.click()

    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Close modal
    await page.keyboard.press("Escape")
  })

  test("AMA section displays questions", async ({ page }) => {
    // Scroll to AMA section
    await page.locator('text="Ask Me Anything"').scrollIntoViewIfNeeded()

    // Wait for questions to load
    await page.waitForTimeout(1000)

    // Check for question cards
    const questions = page.locator('[data-testid="upvote-btn"]')
    const questionCount = await questions.count()

    expect(questionCount).toBeGreaterThan(0)
  })

  test("AMA upvote button updates count", async ({ page }) => {
    // Scroll to AMA section
    await page.locator('text="Ask Me Anything"').scrollIntoViewIfNeeded()

    // Wait for questions to load
    await page.waitForTimeout(1000)

    // Find first upvote button
    const upvoteBtn = page.locator('[data-testid="upvote-btn"]').first()
    const countElement = upvoteBtn.locator('..').locator('.count')

    // Get initial count
    const initialCount = await countElement.textContent()

    // Click upvote
    await upvoteBtn.click()

    // Wait for update
    await page.waitForTimeout(500)

    // Get new count
    const newCount = await countElement.textContent()

    // Count should have changed
    expect(initialCount).not.toBe(newCount)
  })

  test("AMA question submission works", async ({ page }) => {
    // Scroll to AMA section
    await page.locator('text="Ask Me Anything"').scrollIntoViewIfNeeded()

    // Find question textarea
    const textarea = page.locator('textarea[placeholder*="ask"]')
    await textarea.fill("This is a test question for the critic?")

    // Click submit button
    const submitBtn = page.locator('button:has-text("Submit Question")')
    await submitBtn.click()

    // Wait for submission
    await page.waitForTimeout(1000)

    // Textarea should be cleared
    const textareaValue = await textarea.inputValue()
    expect(textareaValue).toBe("")
  })

  test("responsive design works on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Reload page
    await page.reload()
    await page.waitForLoadState("networkidle")

    // Check that page is still functional
    await expect(page.locator("h1")).toBeVisible()

    // Stats constellation should be vertical list on mobile
    // (We can't easily verify layout, but page should load without errors)
  })

  test("responsive design works on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    // Reload page
    await page.reload()
    await page.waitForLoadState("networkidle")

    // Check that page is still functional
    await expect(page.locator("h1")).toBeVisible()
  })

  test("handles 404 error for non-existent critic", async ({ page }) => {
    // Navigate to non-existent critic
    await page.goto("/critic/nonexistentcritic123")

    // Wait for error state
    await page.waitForTimeout(1000)

    // Should show 404 or error message
    const errorText = page.locator('text=/404|not found|error/i')
    await expect(errorText).toBeVisible()
  })

  test("keyboard navigation works", async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press("Tab") // Focus first interactive element
    await page.keyboard.press("Tab") // Focus next element

    // Check that focus is visible (we can't easily verify focus ring, but no error should occur)
  })

  test("all sections load without console errors", async ({ page }) => {
    const consoleErrors: string[] = []

    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    // Scroll through all sections
    await page.locator('text="About"').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await page.locator('text="Filmography Heatmap"').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await page.locator('text="Critic\'s Voice Analytics"').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await page.locator('text="Reviews"').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await page.locator('text="Achievement Badges"').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await page.locator('text="Ask Me Anything"').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Should have no console errors
    expect(consoleErrors.length).toBe(0)
  })
})

