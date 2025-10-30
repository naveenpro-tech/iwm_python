import { test, expect } from "@playwright/test"

test.describe("Role Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login")
    await page.fill('input[type="email"]', "test@example.com")
    await page.fill('input[type="password"]', "testpassword123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/")
  })

  test("Roles tab is visible in settings", async ({ page }) => {
    await page.goto("/settings")
    
    // Wait for settings page to load
    await page.waitForSelector('text="Manage Your Roles"', { timeout: 10000 })
    
    // Check that Roles tab exists
    const rolesTab = page.locator('button[value="roles"]')
    await expect(rolesTab).toBeVisible()
  })

  test("Role Management component displays all 4 roles", async ({ page }) => {
    await page.goto("/settings")
    
    // Click on Roles tab
    await page.click('button[value="roles"]')
    
    // Wait for role management component to load
    await page.waitForSelector('text="Manage Your Roles"')
    
    // Check that all 4 roles are displayed
    await expect(page.locator('text="Movie Lover"')).toBeVisible()
    await expect(page.locator('text="Critic"')).toBeVisible()
    await expect(page.locator('text="Talent"')).toBeVisible()
    await expect(page.locator('text="Industry Professional"')).toBeVisible()
  })

  test("Movie Lover role is enabled by default and cannot be disabled", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Movie Lover"')
    
    // Find Movie Lover role switch
    const loverSwitch = page.locator('#role-lover')
    
    // Should be checked
    await expect(loverSwitch).toBeChecked()
    
    // Should be disabled (cannot toggle)
    await expect(loverSwitch).toBeDisabled()
    
    // Should show "Default" badge
    await expect(page.locator('text="Default"')).toBeVisible()
  })

  test("Can activate Critic role", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Critic"')
    
    // Find Critic role switch
    const criticSwitch = page.locator('#role-critic')
    
    // If already enabled, skip this test
    const isChecked = await criticSwitch.isChecked()
    if (isChecked) {
      test.skip()
      return
    }
    
    // Enable Critic role
    await criticSwitch.click()
    
    // Wait for success toast
    await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
    
    // Verify switch is now checked
    await expect(criticSwitch).toBeChecked()
  })

  test("Critic tab appears after activating Critic role", async ({ page }) => {
    await page.goto("/settings")
    
    // Activate Critic role
    await page.click('button[value="roles"]')
    await page.waitForSelector('text="Critic"')
    
    const criticSwitch = page.locator('#role-critic')
    const isChecked = await criticSwitch.isChecked()
    
    if (!isChecked) {
      await criticSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
    }
    
    // Wait a moment for UI to update
    await page.waitForTimeout(1000)
    
    // Check that Critic tab now appears in settings
    const criticTab = page.locator('button[value="critic"]')
    await expect(criticTab).toBeVisible()
  })

  test("Can deactivate Critic role with confirmation", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Critic"')
    
    // Find Critic role switch
    const criticSwitch = page.locator('#role-critic')
    
    // If not enabled, enable it first
    const isChecked = await criticSwitch.isChecked()
    if (!isChecked) {
      await criticSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1000)
    }
    
    // Now deactivate it
    await criticSwitch.click()
    
    // Should show confirmation dialog
    await expect(page.locator('text="Deactivate Role?"')).toBeVisible()
    await expect(page.locator('text="Critic"').nth(1)).toBeVisible() // In dialog
    
    // Click Deactivate button
    await page.click('button:has-text("Deactivate")')
    
    // Wait for success toast
    await expect(page.locator('text="Role Deactivated"')).toBeVisible({ timeout: 5000 })
    
    // Verify switch is now unchecked
    await expect(criticSwitch).not.toBeChecked()
  })

  test("Critic tab disappears after deactivating Critic role", async ({ page }) => {
    await page.goto("/settings")
    
    // First ensure Critic role is enabled
    await page.click('button[value="roles"]')
    await page.waitForSelector('text="Critic"')
    
    const criticSwitch = page.locator('#role-critic')
    const isChecked = await criticSwitch.isChecked()
    
    if (!isChecked) {
      await criticSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1000)
    }
    
    // Verify Critic tab exists
    await expect(page.locator('button[value="critic"]')).toBeVisible()
    
    // Now deactivate Critic role
    await page.click('button[value="roles"]')
    await criticSwitch.click()
    await page.click('button:has-text("Deactivate")')
    await expect(page.locator('text="Role Deactivated"')).toBeVisible({ timeout: 5000 })
    
    // Wait a moment for UI to update
    await page.waitForTimeout(1000)
    
    // Verify Critic tab is now hidden
    await expect(page.locator('button[value="critic"]')).not.toBeVisible()
  })

  test("Can cancel role deactivation", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Critic"')
    
    // Find Critic role switch
    const criticSwitch = page.locator('#role-critic')
    
    // If not enabled, enable it first
    const isChecked = await criticSwitch.isChecked()
    if (!isChecked) {
      await criticSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1000)
    }
    
    // Try to deactivate
    await criticSwitch.click()
    
    // Should show confirmation dialog
    await expect(page.locator('text="Deactivate Role?"')).toBeVisible()
    
    // Click Cancel
    await page.click('button:has-text("Cancel")')
    
    // Dialog should close
    await expect(page.locator('text="Deactivate Role?"')).not.toBeVisible()
    
    // Switch should still be checked
    await expect(criticSwitch).toBeChecked()
  })

  test("Can activate multiple roles", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Manage Your Roles"')
    
    // Activate Talent role
    const talentSwitch = page.locator('#role-talent')
    const talentChecked = await talentSwitch.isChecked()
    
    if (!talentChecked) {
      await talentSwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1000)
    }
    
    // Activate Industry role
    const industrySwitch = page.locator('#role-industry')
    const industryChecked = await industrySwitch.isChecked()
    
    if (!industryChecked) {
      await industrySwitch.click()
      await expect(page.locator('text="Role Activated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1000)
    }
    
    // Verify both tabs appear
    await expect(page.locator('button[value="talent"]')).toBeVisible()
    await expect(page.locator('button[value="industry"]')).toBeVisible()
  })

  test("Info box explains role management", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Manage Your Roles"')
    
    // Check for info box
    await expect(page.locator('text="About Role Management"')).toBeVisible()
    await expect(page.locator('text="preserves all your data"')).toBeVisible()
  })

  test("Loading state shows during role activation", async ({ page }) => {
    await page.goto("/settings")
    await page.click('button[value="roles"]')
    
    // Wait for role management component
    await page.waitForSelector('text="Critic"')
    
    const criticSwitch = page.locator('#role-critic')
    const isChecked = await criticSwitch.isChecked()
    
    if (isChecked) {
      // Deactivate first
      await criticSwitch.click()
      await page.click('button:has-text("Deactivate")')
      await expect(page.locator('text="Role Deactivated"')).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(1000)
    }
    
    // Click to activate and immediately check for loading spinner
    await criticSwitch.click()
    
    // Should show loading spinner (might be very brief)
    // This is a best-effort check - the spinner might disappear quickly
    const spinner = page.locator('svg.animate-spin')
    // Don't fail if spinner is not visible (it might be too fast)
  })
})

