import { test, expect } from '@playwright/test'

test.describe('Pulse Feed Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/pulse')
    await page.waitForLoadState('networkidle')
  })

  test('should load the pulse page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Siddu Pulse/)
    
    // Check main layout elements are visible
    await expect(page.locator('text=Pulse Feed').or(page.locator('text=What\'s happening'))).toBeVisible({ timeout: 10000 })
  })

  test('should display composer', async ({ page }) => {
    // Check composer textarea is visible
    const composer = page.locator('textarea[placeholder*="What\'s happening"]').or(page.locator('textarea[placeholder*="Share"]'))
    await expect(composer).toBeVisible({ timeout: 10000 })
  })

  test('should display feed tabs', async ({ page }) => {
    // Check all tabs are visible
    await expect(page.locator('text=For You')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Following')).toBeVisible()
    await expect(page.locator('text=Movies')).toBeVisible()
    await expect(page.locator('text=Cricket')).toBeVisible()
  })

  test('should display pulse posts', async ({ page }) => {
    // Wait for posts to load
    await page.waitForTimeout(2000)
    
    // Check if at least one post is visible
    const posts = page.locator('[data-testid="pulse-card"]').or(page.locator('article'))
    await expect(posts.first()).toBeVisible({ timeout: 10000 })
  })

  test('should switch between tabs', async ({ page }) => {
    // Click Movies tab
    await page.locator('text=Movies').click()
    await page.waitForTimeout(1000)
    
    // Click Cricket tab
    await page.locator('text=Cricket').click()
    await page.waitForTimeout(1000)
    
    // Click For You tab
    await page.locator('text=For You').click()
    await page.waitForTimeout(1000)
  })

  test('should display left sidebar', async ({ page }) => {
    // Check user profile card or navigation
    const sidebar = page.locator('text=Profile').or(page.locator('text=Home'))
    await expect(sidebar).toBeVisible({ timeout: 10000 })
  })

  test('should display right sidebar', async ({ page }) => {
    // Check trending topics or who to follow
    const trending = page.locator('text=Trending').or(page.locator('text=Who to Follow'))
    await expect(trending).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(1000)
    
    // Check page still loads
    await expect(page.locator('text=Pulse').or(page.locator('textarea'))).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(1000)
    
    // Check page still loads
    await expect(page.locator('text=Pulse').or(page.locator('textarea'))).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(1000)
    
    // Check page still loads
    await expect(page.locator('text=Pulse').or(page.locator('textarea'))).toBeVisible({ timeout: 10000 })
  })
})

