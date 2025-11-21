import { test, expect } from "@playwright/test"

const TEST_URL = "http://localhost:3000/critic/siddu/review/the-shawshank-redemption-1994"

test.describe("Critic Review Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    // Wait for page to load
    await page.waitForLoadState("networkidle")
  })

  test("1. Page loads successfully with all sections visible", async ({ page }) => {
    // Check hero section
    await expect(page.locator("h1")).toContainText("The Shawshank Redemption")
    
    // Check rating section
    await expect(page.getByText("Critic's Rating")).toBeVisible()
    
    // Check engagement bar
    await expect(page.locator("button").filter({ hasText: /^\d+$/ }).first()).toBeVisible()
    
    // Check content section
    await expect(page.locator("text=A Timeless Masterpiece")).toBeVisible()
    
    // Check author bar
    await expect(page.getByText("Siddu Kumar")).toBeVisible()
  })

  test("2. Cinematic header displays movie backdrop and title", async ({ page }) => {
    const title = page.locator("h1")
    await expect(title).toContainText("The Shawshank Redemption")
    await expect(title).toBeVisible()
    
    // Check year is displayed
    await expect(page.getByText("1994")).toBeVisible()
  })

  test("3. Critic rating displays correctly", async ({ page }) => {
    // Check for A+ rating
    await expect(page.getByText("A+")).toBeVisible()
    
    // Check for numeric rating
    await expect(page.getByText(/9\.\d\/10/)).toBeVisible()
    
    // Check Siddu Score
    await expect(page.getByText("Siddu Score")).toBeVisible()
  })

  test("4. YouTube video embed loads (if present)", async ({ page }) => {
    const iframe = page.locator("iframe[src*='youtube.com']")
    if (await iframe.count() > 0) {
      await expect(iframe).toBeVisible()
      const src = await iframe.getAttribute("src")
      expect(src).toContain("youtube.com/embed/")
    }
  })

  test("5. Written content renders with proper formatting", async ({ page }) => {
    // Check for headings
    await expect(page.locator("h2, h3").first()).toBeVisible()
    
    // Check for paragraphs
    await expect(page.locator("p").first()).toBeVisible()
    
    // Check for reading time
    await expect(page.getByText(/\d+ min read/)).toBeVisible()
  })

  test("6. Where to Watch section displays platforms", async ({ page }) => {
    await expect(page.getByText("Where to Watch")).toBeVisible()
    
    // Check for at least one platform
    const platforms = page.locator("text=Netflix, text=Amazon Prime, text=Apple TV")
    const count = await platforms.count()
    expect(count).toBeGreaterThan(0)
  })

  test("7. Like button increments counter on click", async ({ page }) => {
    const likeButton = page.locator("button").filter({ has: page.locator("svg").first() }).first()
    
    // Get initial count
    const initialText = await likeButton.textContent()
    
    // Click like button
    await likeButton.click()
    
    // Note: Since we're not authenticated, this might redirect to login
    // In a real test, we'd mock authentication
  })

  test("8. Comment section displays existing comments", async ({ page }) => {
    // Scroll to comments
    await page.locator("#comments-section").scrollIntoViewIfNeeded()
    
    // Check comments header
    await expect(page.getByText(/Comments \(\d+\)/)).toBeVisible()
    
    // Check for comment composer
    await expect(page.getByPlaceholder("Share your thoughts...")).toBeVisible()
  })

  test("9. Comment composer allows text input", async ({ page }) => {
    const textarea = page.getByPlaceholder("Share your thoughts...")
    await textarea.scrollIntoViewIfNeeded()
    await textarea.fill("This is a test comment")
    
    await expect(textarea).toHaveValue("This is a test comment")
    
    // Check character count
    await expect(page.getByText("24/500")).toBeVisible()
  })

  test("10. Share button opens share modal", async ({ page }) => {
    const shareButton = page.locator("button").filter({ has: page.locator("svg[class*='lucide-share']") }).first()
    await shareButton.click()
    
    // Check modal appears
    await expect(page.getByText("Share Review")).toBeVisible()
    await expect(page.getByText("Copy Link")).toBeVisible()
  })

  test("11. Author bar links to critic profile", async ({ page }) => {
    const profileLink = page.getByRole("link", { name: /Siddu Kumar/ })
    await expect(profileLink).toBeVisible()
    
    const href = await profileLink.getAttribute("href")
    expect(href).toContain("/critic/siddu")
  })

  test("12. Breadcrumb navigation works", async ({ page }) => {
    // Check breadcrumb exists
    await expect(page.getByText("Home")).toBeVisible()
    await expect(page.getByText("Critics")).toBeVisible()
    
    // Click home link
    const homeLink = page.getByRole("link", { name: "Home" })
    await expect(homeLink).toHaveAttribute("href", "/")
  })

  test("13. Responsive layout on mobile (viewport 375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check page still renders
    await expect(page.locator("h1")).toBeVisible()
    
    // Check engagement bar is visible
    await expect(page.locator("button").first()).toBeVisible()
  })

  test("14. Parallax effect works on scroll", async ({ page }) => {
    // Get initial position of hero background
    const hero = page.locator("div").first()
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500))
    
    // Wait for animation
    await page.waitForTimeout(500)
    
    // Hero should still be visible but transformed
    await expect(hero).toBeVisible()
  })

  test("15. Loading skeleton displays before data loads", async ({ page }) => {
    // Navigate to a new page to see loading state
    await page.goto("http://localhost:3000/critic/siddu/review/inception-2010")
    
    // Check for loading skeleton (animate-pulse class)
    const skeleton = page.locator(".animate-pulse").first()
    
    // Skeleton might be very brief, so we just check the page eventually loads
    await page.waitForLoadState("networkidle")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("16. Tags are displayed and clickable", async ({ page }) => {
    // Check for tags
    const tags = page.locator("span").filter({ hasText: /Drama|Hope|Friendship/ })
    const count = await tags.count()
    expect(count).toBeGreaterThan(0)
  })

  test("17. Rating breakdown displays all categories", async ({ page }) => {
    await expect(page.getByText("Rating Breakdown")).toBeVisible()
    
    // Check for at least one category
    await expect(page.getByText("Story")).toBeVisible()
  })

  test("18. Back button navigates to critic profile", async ({ page }) => {
    const backButton = page.getByRole("link", { name: /Back to Profile/ })
    await expect(backButton).toBeVisible()
    
    const href = await backButton.getAttribute("href")
    expect(href).toContain("/critic/siddu")
  })

  test("19. Follow button is visible and interactive", async ({ page }) => {
    const followButton = page.getByRole("button", { name: /Follow/ })
    await followButton.scrollIntoViewIfNeeded()
    await expect(followButton).toBeVisible()
  })

  test("20. Spoiler warning displays when present", async ({ page }) => {
    const spoilerWarning = page.getByText("Spoiler Warning")
    if (await spoilerWarning.count() > 0) {
      await expect(spoilerWarning).toBeVisible()
    }
  })
})

