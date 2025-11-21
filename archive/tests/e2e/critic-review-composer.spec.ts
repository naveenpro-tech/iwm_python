import { test, expect } from "@playwright/test"

const CREATE_URL = "http://localhost:3000/critic/dashboard/create-review"
const DASHBOARD_URL = "http://localhost:3000/critic/dashboard"

test.describe("Critic Review Composer", () => {
  test("1. Movie search step loads correctly", async ({ page }) => {
    await page.goto(CREATE_URL)
    await expect(page.getByText("Select a Movie")).toBeVisible()
    await expect(page.getByPlaceholder("Search for a movie...")).toBeVisible()
  })

  test("2. Search functionality works", async ({ page }) => {
    await page.goto(CREATE_URL)
    const searchInput = page.getByPlaceholder("Search for a movie...")
    await searchInput.fill("Shawshank")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    // Results should appear
    await expect(page.locator("text=The Shawshank Redemption")).toBeVisible()
  })

  test("3. Movie selection transitions to compose step", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()
    await expect(page.getByText("Create Review")).toBeVisible()
  })

  test("4. Rating section displays all fields", async ({ page }) => {
    await page.goto(CREATE_URL)
    // Skip to compose step (mock)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    await expect(page.getByText("Letter Grade")).toBeVisible()
    await expect(page.getByText("Numeric Rating")).toBeVisible()
    await expect(page.getByText("Rating Breakdown")).toBeVisible()
  })

  test("5. Letter grade selection works", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    // Open letter grade dropdown
    await page.locator("button").filter({ hasText: "Select grade" }).click()
    await page.getByText("A+", { exact: true }).click()
  })

  test("6. Numeric rating input accepts values", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const numericInput = page.locator("input[type='number']").first()
    await numericInput.fill("9.5")
    await expect(numericInput).toHaveValue("9.5")
  })

  test("7. Rating breakdown inputs work", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    // Fill in story rating
    const storyInput = page.locator("input[type='number']").nth(1)
    await storyInput.fill("9")
    await expect(storyInput).toHaveValue("9")
  })

  test("8. YouTube URL input accepts values", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const youtubeInput = page.getByPlaceholder("https://youtube.com/watch?v=...")
    await youtubeInput.fill("https://youtube.com/watch?v=YoHD9XEInc0")
    await expect(youtubeInput).toHaveValue("https://youtube.com/watch?v=YoHD9XEInc0")
  })

  test("9. Written content textarea works", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const contentArea = page.getByPlaceholder("Write your review here...")
    await contentArea.fill("This is a test review content")
    await expect(contentArea).toHaveValue("This is a test review content")
  })

  test("10. Character count updates", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const contentArea = page.getByPlaceholder("Write your review here...")
    await contentArea.fill("Test")
    await expect(page.getByText("4 characters")).toBeVisible()
  })

  test("11. Tags input accepts comma-separated values", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const tagsInput = page.getByPlaceholder("Drama, Thriller, Must-Watch")
    await tagsInput.fill("Sci-Fi, Thriller, Mind-Bending")
    await expect(tagsInput).toHaveValue("Sci-Fi, Thriller, Mind-Bending")
  })

  test("12. Spoiler warning checkbox toggles", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const spoilerCheckbox = page.locator("input#spoiler")
    await spoilerCheckbox.check()
    await expect(spoilerCheckbox).toBeChecked()
  })

  test("13. Save Draft button works", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    await page.getByRole("button", { name: /Save Draft/i }).click()
    await page.waitForTimeout(1500)
    // Toast should appear
    await expect(page.getByText("Draft saved")).toBeVisible()
  })

  test("14. Publish button shows validation error for empty fields", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    await page.getByRole("button", { name: /Publish/i }).click()
    await expect(page.getByText("Please complete all required fields")).toBeVisible()
  })

  test("15. Back button navigates to dashboard", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    const backButton = page.getByRole("link", { name: /Back/i })
    await expect(backButton).toHaveAttribute("href", "/critic/dashboard")
  })

  test("16. Preview button is visible", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    await expect(page.getByRole("button", { name: /Preview/i })).toBeVisible()
  })

  test("17. Image upload button is visible", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    await expect(page.getByRole("button", { name: /Upload Images/i })).toBeVisible()
  })

  test("18. All rating breakdown categories are present", async ({ page }) => {
    await page.goto(CREATE_URL)
    await page.getByPlaceholder("Search for a movie...").fill("Inception")
    await page.getByRole("button", { name: /Search/i }).click()
    await page.waitForTimeout(500)
    await page.locator("text=Inception").first().click()

    await expect(page.getByText("story", { exact: false })).toBeVisible()
    await expect(page.getByText("acting", { exact: false })).toBeVisible()
    await expect(page.getByText("direction", { exact: false })).toBeVisible()
    await expect(page.getByText("cinematography", { exact: false })).toBeVisible()
    await expect(page.getByText("music", { exact: false })).toBeVisible()
    await expect(page.getByText("overall", { exact: false })).toBeVisible()
  })
})

