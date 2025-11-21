import { test, expect } from '@playwright/test'

const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:3000'
const BACKEND_BASE = process.env.BACKEND_BASE || 'http://localhost:8000'
const TEST_USERNAME = 'user1'
const TEST_EMAIL = 'user1@iwm.com'
const TEST_PASSWORD = 'rmrnn0077'

async function loginViaApiAndSeedStorage(page: any) {
  // Login via API
  const loginRes = await page.request.post(`${BACKEND_BASE}/api/v1/auth/login`, {
    data: {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    },
  })

  const loginData = await loginRes.json()
  const accessToken = loginData.access_token

  // Seed localStorage with token
  await page.addInitScript((token: string) => {
    localStorage.setItem('access_token', token)
  }, accessToken)
}

test.describe('Watchlist Status Updates', () => {
  test('update watchlist item status from plan-to-watch to watching to watched', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await loginViaApiAndSeedStorage(page)

    // Navigate to profile watchlist
    await page.goto(`${FRONTEND_BASE}/profile/${TEST_USERNAME}?section=watchlist`)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-artifacts/watchlist-status/01-watchlist-page.png', fullPage: true })

    // Wait for watchlist to load
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 })
    await page.screenshot({ path: 'test-artifacts/watchlist-status/02-watchlist-loaded.png', fullPage: true })

    // Get first movie card
    const movieCards = page.locator('[class*="group"][class*="relative"]').first()
    await expect(movieCards).toBeVisible()

    // Hover to reveal status dropdown
    await movieCards.hover()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/03-hover-revealed.png', fullPage: true })

    // Find and click status dropdown
    const statusSelect = movieCards.locator('button[role="combobox"]').first()
    await expect(statusSelect).toBeVisible({ timeout: 5000 })
    await statusSelect.click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/04-dropdown-opened.png', fullPage: true })

    // Select "Watching" status
    const watchingOption = page.getByRole('option', { name: /Watching/i })
    await expect(watchingOption).toBeVisible({ timeout: 5000 })
    await watchingOption.click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/05-status-changed-to-watching.png', fullPage: true })

    // Hover again to verify status changed
    await movieCards.hover()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/06-verify-status-changed.png', fullPage: true })

    // Change to "Watched"
    const statusSelect2 = movieCards.locator('button[role="combobox"]').first()
    await statusSelect2.click()
    await page.waitForTimeout(300)
    const watchedOption = page.getByRole('option', { name: /Watched/i })
    await watchedOption.click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/07-status-changed-to-watched.png', fullPage: true })

    // Refresh page to verify persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-artifacts/watchlist-status/08-after-reload.png', fullPage: true })

    // Verify status persisted
    await movieCards.hover()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/09-status-persisted.png', fullPage: true })

    // Assert no console errors
    expect(consoleErrors, 'console errors').toEqual([])
  })

  test('remove movie from watchlist', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await loginViaApiAndSeedStorage(page)

    await page.goto(`${FRONTEND_BASE}/profile/${TEST_USERNAME}?section=watchlist`)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-artifacts/watchlist-status/remove-01-initial.png', fullPage: true })

    // Get first movie card
    const movieCards = page.locator('[class*="group"][class*="relative"]').first()
    const movieTitle = await movieCards.locator('h3').first().textContent()

    // Hover to reveal remove button
    await movieCards.hover()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/remove-02-hover.png', fullPage: true })

    // Find and click remove button (red X button)
    const removeButton = movieCards.locator('button').filter({ has: page.locator('svg') }).last()
    
    // Handle confirmation dialog
    page.once('dialog', dialog => {
      expect(dialog.message()).toContain(movieTitle || '')
      dialog.accept()
    })
    
    await removeButton.click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/remove-03-after-remove.png', fullPage: true })

    // Verify movie removed
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-artifacts/watchlist-status/remove-04-final.png', fullPage: true })

    expect(consoleErrors, 'console errors').toEqual([])
  })
})

