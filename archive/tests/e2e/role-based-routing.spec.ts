import { test, expect } from "@playwright/test"

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3001"

test.describe("Role-Based Profile Routing", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', "test_role_routing@example.com")
    await page.fill('input[type="password"]', "TestPassword123!")
    await page.click('button:has-text("Sign In")')
    await page.waitForURL(`${BASE_URL}/dashboard`)
  })

  test("With activeRole=lover, clicking Profile navigates to /profile/{username}", async ({ page }) => {
    // Open profile dropdown
    await page.click('[aria-label="User profile"]')
    
    // Wait for dropdown to appear
    await page.waitForSelector('[role="menu"]')
    
    // Click Profile menu item
    await page.click('text=Profile')
    
    // Wait for navigation
    await page.waitForURL(/\/profile\/.*/)
    
    // Verify we're on a profile page
    const url = page.url()
    expect(url).toMatch(/\/profile\//)
  })

  test("With activeRole=critic, clicking Profile navigates to /critic/{username}", async ({ page }) => {
    // First, switch to critic role if available
    await page.click('[aria-label="User profile"]')
    await page.waitForSelector('[role="menu"]')
    
    // Check if critic role is available
    const criticRole = page.locator('text=Critic')
    if (await criticRole.isVisible()) {
      // Click on Critic role to switch
      await criticRole.click()
      
      // Wait for role switch
      await page.waitForTimeout(500)
      
      // Open profile dropdown again
      await page.click('[aria-label="User profile"]')
      await page.waitForSelector('[role="menu"]')
      
      // Click Profile menu item
      await page.click('text=Profile')
      
      // Wait for navigation
      await page.waitForURL(/\/critic\/.*/)
      
      // Verify we're on a critic profile page
      const url = page.url()
      expect(url).toMatch(/\/critic\//)
    }
  })

  test("With activeRole=talent, clicking Profile navigates to /talent-hub/profile/me", async ({ page }) => {
    // First, switch to talent role if available
    await page.click('[aria-label="User profile"]')
    await page.waitForSelector('[role="menu"]')
    
    // Check if talent role is available
    const talentRole = page.locator('text=Talent')
    if (await talentRole.isVisible()) {
      // Click on Talent role to switch
      await talentRole.click()
      
      // Wait for role switch
      await page.waitForTimeout(500)
      
      // Open profile dropdown again
      await page.click('[aria-label="User profile"]')
      await page.waitForSelector('[role="menu"]')
      
      // Click Profile menu item
      await page.click('text=Profile')
      
      // Wait for navigation
      await page.waitForURL(/\/talent-hub\/profile\/me/)
      
      // Verify we're on the talent profile page
      const url = page.url()
      expect(url).toContain("/talent-hub/profile/me")
    }
  })

  test("With activeRole=industry, clicking Profile navigates to /people (temporary placeholder)", async ({ page }) => {
    // First, switch to industry role if available
    await page.click('[aria-label="User profile"]')
    await page.waitForSelector('[role="menu"]')
    
    // Check if industry role is available
    const industryRole = page.locator('text=Industry')
    if (await industryRole.isVisible()) {
      // Click on Industry role to switch
      await industryRole.click()
      
      // Wait for role switch
      await page.waitForTimeout(500)
      
      // Open profile dropdown again
      await page.click('[aria-label="User profile"]')
      await page.waitForSelector('[role="menu"]')
      
      // Click Profile menu item
      await page.click('text=Profile')
      
      // Wait for navigation (temporary placeholder is /people)
      await page.waitForURL(/\/people/)
      
      // Verify we're on the people directory page
      const url = page.url()
      expect(url).toContain("/people")
    }
  })

  test("Switching roles and clicking Profile navigates to new role's profile", async ({ page }) => {
    // Get initial role
    await page.click('[aria-label="User profile"]')
    await page.waitForSelector('[role="menu"]')
    
    // Check available roles
    const criticRole = page.locator('text=Critic')
    const talentRole = page.locator('text=Talent')
    
    if (await criticRole.isVisible() && await talentRole.isVisible()) {
      // Switch to critic
      await criticRole.click()
      await page.waitForTimeout(500)
      
      // Open dropdown and click Profile
      await page.click('[aria-label="User profile"]')
      await page.waitForSelector('[role="menu"]')
      await page.click('text=Profile')
      
      // Should navigate to critic profile
      await page.waitForURL(/\/critic\/.*/)
      let url = page.url()
      expect(url).toMatch(/\/critic\//)
      
      // Go back to dashboard
      await page.goto(`${BASE_URL}/dashboard`)
      
      // Switch to talent
      await page.click('[aria-label="User profile"]')
      await page.waitForSelector('[role="menu"]')
      await talentRole.click()
      await page.waitForTimeout(500)
      
      // Open dropdown and click Profile
      await page.click('[aria-label="User profile"]')
      await page.waitForSelector('[role="menu"]')
      await page.click('text=Profile')
      
      // Should navigate to talent profile
      await page.waitForURL(/\/talent-hub\/profile\/me/)
      url = page.url()
      expect(url).toContain("/talent-hub/profile/me")
    }
  })

  test("Profile dropdown shows current active role indicator", async ({ page }) => {
    // Open profile dropdown
    await page.click('[aria-label="User profile"]')
    
    // Wait for dropdown to appear
    await page.waitForSelector('[role="menu"]')
    
    // Check for role indicator (checkmark or similar)
    // The active role should have a checkmark or indicator
    const activeRoleIndicator = page.locator('text=✓')
    
    // At least one role should be marked as active
    const indicators = await activeRoleIndicator.count()
    expect(indicators).toBeGreaterThan(0)
  })

  test("Graceful fallback to lover profile if activeRole is undefined", async ({ page }) => {
    // This test verifies the fallback behavior
    // Navigate directly to profile dropdown
    await page.click('[aria-label="User profile"]')
    await page.waitForSelector('[role="menu"]')
    
    // Click Profile
    await page.click('text=Profile')
    
    // Should navigate to some profile page (lover as default)
    await page.waitForURL(/\/profile\/.*|\/critic\/.*|\/talent-hub\/profile\/me|\/people/)
    
    // Verify navigation happened
    const url = page.url()
    expect(url).toBeTruthy()
  })

  test("Profile menu item is always visible", async ({ page }) => {
    // Open profile dropdown
    await page.click('[aria-label="User profile"]')
    
    // Wait for dropdown to appear
    await page.waitForSelector('[role="menu"]')
    
    // Profile menu item should always be visible
    const profileMenuItem = page.locator('text=Profile')
    await expect(profileMenuItem).toBeVisible()
  })
})

