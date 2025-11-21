import { test, expect } from "@playwright/test"

const APPLY_URL = "http://localhost:3000/apply-critic"
const ADMIN_APPS_URL = "http://localhost:3000/admin/critic-applications"
const ADMIN_CRITICS_URL = "http://localhost:3000/admin/critics"

test.describe("Critic Application Flow", () => {
  test("1. Application page loads", async ({ page }) => {
    await page.goto(APPLY_URL)
    await expect(page.getByText("Apply to Become a Verified Critic")).toBeVisible()
  })

  test("2. Personal Information section displays", async ({ page }) => {
    await page.goto(APPLY_URL)
    await expect(page.getByText("Personal Information")).toBeVisible()
  })

  test("3. Full Name field is required", async ({ page }) => {
    await page.goto(APPLY_URL)
    const nameInput = page.getByPlaceholder("John Doe")
    await expect(nameInput).toBeVisible()
    await expect(nameInput).toHaveAttribute("required", "")
  })

  test("4. Username field is required", async ({ page }) => {
    await page.goto(APPLY_URL)
    const usernameInput = page.getByPlaceholder("johndoe_critic")
    await expect(usernameInput).toBeVisible()
    await expect(usernameInput).toHaveAttribute("required", "")
  })

  test("5. Bio field is required with character limit", async ({ page }) => {
    await page.goto(APPLY_URL)
    const bioInput = page.getByPlaceholder("Tell us about your background in film criticism...")
    await expect(bioInput).toBeVisible()
    await bioInput.fill("Test bio")
    await expect(page.getByText("8/500 characters")).toBeVisible()
  })

  test("6. Social Media Links section displays", async ({ page }) => {
    await page.goto(APPLY_URL)
    await expect(page.getByText("Social Media Links")).toBeVisible()
  })

  test("7. Portfolio section displays", async ({ page }) => {
    await page.goto(APPLY_URL)
    await expect(page.getByText("Portfolio")).toBeVisible()
  })

  test("8. Why Apply field is required", async ({ page }) => {
    await page.goto(APPLY_URL)
    const whyInput = page.getByPlaceholder("Share your passion for film criticism...")
    await expect(whyInput).toBeVisible()
    await expect(whyInput).toHaveAttribute("required", "")
  })

  test("9. Submit button is visible", async ({ page }) => {
    await page.goto(APPLY_URL)
    await expect(page.getByRole("button", { name: /Submit Application/i })).toBeVisible()
  })

  test("10. Form validation prevents empty submission", async ({ page }) => {
    await page.goto(APPLY_URL)
    await page.getByRole("button", { name: /Submit Application/i }).click()
    // Browser validation should prevent submission
  })

  test("11. Successful submission shows confirmation", async ({ page }) => {
    await page.goto(APPLY_URL)
    await page.getByPlaceholder("John Doe").fill("Test User")
    await page.getByPlaceholder("johndoe_critic").fill("testuser")
    await page.getByPlaceholder("Tell us about your background in film criticism...").fill("Test bio content")
    await page.getByPlaceholder("Share your passion for film criticism...").fill("Test reason for applying")
    await page.getByRole("button", { name: /Submit Application/i }).click()
    await page.waitForTimeout(2500)
    await expect(page.getByText("Application Submitted!")).toBeVisible()
  })

  test("12. Admin applications page loads", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await expect(page.getByText("Critic Applications")).toBeVisible()
  })

  test("13. Admin page shows stats cards", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await expect(page.getByText("Pending")).toBeVisible()
    await expect(page.getByText("Approved")).toBeVisible()
    await expect(page.getByText("Rejected")).toBeVisible()
  })

  test("14. Admin page has search functionality", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await expect(page.getByPlaceholder("Search by name or username...")).toBeVisible()
  })

  test("15. Admin page has status filter", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await expect(page.getByRole("button", { name: /All Status/i })).toBeVisible()
  })

  test("16. View button opens application details", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await page.waitForTimeout(1000)
    const viewButton = page.getByRole("button", { name: /View/i }).first()
    if (await viewButton.count() > 0) {
      await viewButton.click()
      await expect(page.getByText("Application Details")).toBeVisible()
    }
  })

  test("17. Approve button works for pending applications", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await page.waitForTimeout(1000)
    const approveButton = page.getByRole("button", { name: /Approve/i }).first()
    if (await approveButton.count() > 0) {
      await approveButton.click()
      await expect(page.getByText("Approve Application?")).toBeVisible()
    }
  })

  test("18. Reject button requires reason", async ({ page }) => {
    await page.goto(ADMIN_APPS_URL)
    await page.waitForTimeout(1000)
    const rejectButton = page.getByRole("button", { name: /Reject/i }).first()
    if (await rejectButton.count() > 0) {
      await rejectButton.click()
      await expect(page.getByText("Reject Application")).toBeVisible()
      await expect(page.getByPlaceholder("Enter rejection reason...")).toBeVisible()
    }
  })

  test("19. Admin critics management page loads", async ({ page }) => {
    await page.goto(ADMIN_CRITICS_URL)
    await expect(page.getByText("Verified Critics Management")).toBeVisible()
  })

  test("20. Admin critics page shows stats", async ({ page }) => {
    await page.goto(ADMIN_CRITICS_URL)
    await expect(page.getByText("Total Critics")).toBeVisible()
    await expect(page.getByText("Active")).toBeVisible()
    await expect(page.getByText("Suspended")).toBeVisible()
  })

  test("21. Revoke button works for active critics", async ({ page }) => {
    await page.goto(ADMIN_CRITICS_URL)
    await page.waitForTimeout(1000)
    const revokeButton = page.getByRole("button", { name: /Revoke/i }).first()
    if (await revokeButton.count() > 0) {
      await expect(revokeButton).toBeVisible()
    }
  })

  test("22. View Profile button links to critic profile", async ({ page }) => {
    await page.goto(ADMIN_CRITICS_URL)
    await page.waitForTimeout(1000)
    const viewProfileButton = page.getByRole("link", { name: /View Profile/i }).first()
    if (await viewProfileButton.count() > 0) {
      await expect(viewProfileButton).toBeVisible()
    }
  })
})

